import { OpenAIEmbedder } from "../../embeddings/openai";
import type { Chunk, Chunker, Document, TextUnit } from "../../types";
import { countTokens } from "../../utils/tokenizer";

const strategy = "semantic"
export class SemanticChunker implements Chunker {
  readonly name: string
  constructor() {
    this.name = "semantic"
  }
  async chunk(doc: Document): Promise<Chunk[]> {

    function findProtectedRanges(text: string): Array<[number, number]> {
      const ranges: Array<[number, number]> = [];
      const patterns = [/`[^`]*`/g, /\[[^\]]*\]\([^)]*\)/g];
      for (const re of patterns) {
        for (const m of text.matchAll(re)) {
          ranges.push([m.index!, m.index! + m[0].length]);
        }
      }
      return ranges;
    }

    function isProtected(index: number, ranges: Array<[number, number]>): boolean {
      return ranges.some(([start, end]) => index >= start && index < end);
    }


    const protectedRange = findProtectedRanges(doc.content)

    let pos = 0
    const sentenceBlocks: TextUnit[] = []

    while (pos < doc.content.length) {
      let searchPos = pos
      let punctuationPos = -1

      while (searchPos < doc.content.length) {
        const relativeIndex = doc.content.slice(searchPos).search(/[.!?]/)
        if (relativeIndex === -1) break;

        const candidate = searchPos + relativeIndex

        if (isProtected(candidate, protectedRange)) {
          searchPos = candidate + 1
          continue;
        }
        punctuationPos = candidate
        break;
      }

      if (punctuationPos === -1) break;

      const sentenceText = doc.content.slice(pos, punctuationPos + 1).trim()
      sentenceBlocks.push({
        type: "sentence",
        tokenCount: countTokens(sentenceText),
        content: sentenceText,
        charStart: pos,
        charEnd: punctuationPos + 1
      })
      pos = punctuationPos + 1
    }


    if (pos < doc.content.length) {
      const content = doc.content.slice(pos)
      sentenceBlocks.push({ type: "sentence", tokenCount: countTokens(content), content, charStart: pos, charEnd: doc.content.length })
    }

    if (sentenceBlocks.length === 0) return []

    const embedder = new OpenAIEmbedder()

    function dotProduct(a: number[], b: number[]): number {
      let sum = 0
      for (let i = 0; i < a.length; i++) {
        sum += a[i]! * b[i]!
      }
      return sum
    }

    function magnitude(a: number[]): number {
      let sum = 0
      for (let i = 0; i < a.length; i++) {
        sum += a[i]! * a[i]!
      }
      sum = Math.sqrt(sum)
      return sum
    }

    function cosineSimilarity(a: number[], b: number[]): number {
      const similarity = dotProduct(a, b) / (magnitude(a) * magnitude(b))
      return similarity
    }

    const embeddings: number[][] = await embedder.embed(sentenceBlocks.map(s => s.content))
    const similarities: number[] = []


    for (let i = 0; i < embeddings.length - 1; i++) {
      const found = cosineSimilarity(embeddings[i]!, embeddings[i + 1]!)
      similarities.push(found)
    }

    function percentile(values: number[], p: number): number {
      const sorted = [...values].sort((a, b) => a - b)
      const index = (p / 100) * (sorted.length - 1)
      const lower = Math.floor(index)
      const upper = Math.ceil(index)

      if (lower === upper) return sorted[lower]!
      const weight = index - lower
      return sorted[lower]! * (1 - weight) + sorted[upper]! * weight
    }

    const MIN_SENTENCES_FOR_PERCENTILE = 50
    const BREAKPOINT_PERCENTILE = 15
    const MAX_CHUNK_TOKENS = 450

    const breakpoints: number[] = []

    if (similarities.length >= MIN_SENTENCES_FOR_PERCENTILE) {
      const cutoff = percentile(similarities, BREAKPOINT_PERCENTILE)
      for (let i = 0; i < similarities.length; i++) {
        if (similarities[i]! <= cutoff)
          breakpoints.push(i)
      }
    }

    const forcedBreakpoints: number[] = []
    const breakpointSet = new Set(breakpoints)
    let tokensSinceLastBreak = 0

    for (let i = 0; i < sentenceBlocks.length; i++) {
      tokensSinceLastBreak += sentenceBlocks[i]!.tokenCount
      if (breakpointSet.has(i)) {
        tokensSinceLastBreak = 0
      } else if (tokensSinceLastBreak > MAX_CHUNK_TOKENS) {
        tokensSinceLastBreak = 0
        forcedBreakpoints.push(i)
      }
    }

    const allBreakpoints = [...breakpoints, ...forcedBreakpoints]
    const breakpointsSorted = [...new Set(allBreakpoints)]
      .filter(i => i !== sentenceBlocks.length - 1)
      .sort((a, b) => a - b)


    const groupBoundaries = [-1, ...breakpointsSorted, sentenceBlocks.length - 1]
    const sentenceGroups: TextUnit[][] = []

    for (let i = 0; i < groupBoundaries.length - 1; i++) {
      const start = groupBoundaries[i]! + 1
      const end = groupBoundaries[i + 1]!
      const group = sentenceBlocks.slice(start, end + 1)
      sentenceGroups.push(group)
    }


    const finalChunks: Chunk[] = []
    for (const group of sentenceGroups) {
      const text = group.map(s => s.content).join(" ")

      const tokenCount = countTokens(text)

      const first = group[0]
      const last = group.at(-1)

      if (!first || !last) {
        throw new Error("cannot close an emply chunk")
      }

      const charStart = first.charStart
      const charEnd = last.charEnd


      const idInput = doc.id + String(charStart) + String(charEnd) + strategy
      const id = String(Bun.hash(String(idInput)))

      const chunk: Chunk = {
        id: id,
        documentId: doc.id,
        content: text,
        strategy,
        charStart: charStart,
        charEnd: charEnd,
        tokenCount
      }
      finalChunks.push(chunk)
    }


    return finalChunks
  }

}

