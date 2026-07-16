import type { Chunk, Chunker, Document, TextUnit } from "../../types";
import { countTokens } from "../../utils/tokenizer";

const strategy = "recursive"
export class RecursiveChunker implements Chunker {
  readonly name: string
  constructor() {
    this.name = `recursive`
  }
  async chunk(doc: Document): Promise<Chunk[]> {

    let searchFrom = 0
    const codeBlocks: TextUnit[] = []

    while (true) {
      const open = doc.content.indexOf("```", searchFrom)
      if (open === -1) break;

      const close = doc.content.indexOf("```", open + 3)
      if (close === -1) break;

      const content = doc.content.slice(open, close + 3)
      codeBlocks.push({ type: "codeblock", tokenCount: countTokens(content), content, charStart: open, charEnd: close + 3 })

      searchFrom = close + 3
    }

    const boundaries = [{ charEnd: 0 }, ...codeBlocks, { charStart: doc.content.length }]
    const paragraphs: TextUnit[] = []

    for (let i = 0; i < boundaries.length - 1; i++) {
      const gapStart = boundaries[i]!.charEnd
      const gapEnd = boundaries[i + 1]!.charStart

      const content = doc.content.slice(gapStart, gapEnd)

      const pieces = content.split("\n\n")

      let piecePos = gapStart
      pieces.forEach((piece) => {
        const pieceStart = piecePos
        const pieceEnd = pieceStart! + piece.length
        piecePos = pieceEnd + 2
        const trimmed = piece.trim()
        if (trimmed.length === 0) return
        paragraphs.push({ type: "paragraph", tokenCount: countTokens(trimmed), content: trimmed, charStart: pieceStart!, charEnd: pieceEnd })
      })
    }

    const allUnits = [...codeBlocks, ...paragraphs].sort((a, b) => a.charStart - b.charStart)

    let currentUnits: TextUnit[] = []
    let currentTokens = 0
    const finalChunks: Chunk[] = []

    for (const unit of allUnits) {
      const wouldExceed = currentTokens + unit.tokenCount > 400

      if (currentTokens >= 300 && wouldExceed) {
        const text = currentUnits.map(unit => unit.content).join("\n\n");

        const first = currentUnits[0]
        const last = currentUnits.at(-1)

        const tokenCount = countTokens(text)

        if (!first || !last) {
          throw new Error("cannot close an emply chunk")
        }

        const charStart = first.charStart
        const charEnd = last.charEnd

        const idInput = doc.id + String(charStart) + String(charEnd) + strategy
        const id = String(Bun.hash(String(idInput)))

        finalChunks.push({
          id: id,
          documentId: doc.id,
          content: text,
          strategy,
          charStart,
          charEnd,
          tokenCount
        })

        currentUnits = [unit]
        currentTokens = unit.tokenCount

      } else {
        currentUnits.push(unit)
        currentTokens += unit.tokenCount
      }
    }

    if (currentUnits.length > 0) {
      const text = currentUnits.map(unit => unit.content).join("\n\n")
      const first = currentUnits[0]
      const last = currentUnits.at(-1)
      if (!first || !last) {
        throw new Error("cannot close on empty chunk")
      }

      const charStart = first.charStart
      const charEnd = last.charEnd
      const idInput = doc.id + String(charStart) + String(charEnd) + strategy
      const id = String(Bun.hash(String(idInput)))
      const tokenCount = countTokens(text)

      finalChunks.push({
        id,
        documentId: doc.id,
        content: text,
        strategy,
        charStart,
        charEnd,
        tokenCount
      })
    }

    return finalChunks
  }
}

