import type { Chunk, Chunker, Document } from "../../types"
import { countTokens } from "../../utils/tokenizer"

const strategy = "fixed-size"
export class FixedSizeChunker implements Chunker {
  readonly name: string
  constructor(private chunkSize: number, private overlap: number) {
    if (chunkSize <= 0) {
      throw new Error("chunkSize must be positive");
    }

    if (overlap < 0 || overlap >= chunkSize) {
      throw new Error("overlap must be >= 0 and < chunkSize");
    }

    this.name = `fixed-size-${chunkSize}`
  }
  async chunk(doc: Document): Promise<Chunk[]> {

    let currentStart = 0
    const chunks: Chunk[] = []
    for (currentStart; currentStart < doc.content.length; currentStart += this.chunkSize - this.overlap) {
      let currentEnd = Math.min(currentStart + this.chunkSize, doc.content.length)
      const content = doc.content.slice(currentStart, currentEnd)

      const idInput = doc.id + String(currentStart) + String(currentEnd) + strategy
      const id = String(Bun.hash(String(idInput)))

      const tokenCount = countTokens(content)

      const chunk: Chunk = {
        id: id,
        documentId: doc.id,
        content,
        strategy,
        charStart: currentStart,
        charEnd: currentEnd,
        tokenCount
      }
      chunks.push(chunk)
    }

    return chunks
  }
}




