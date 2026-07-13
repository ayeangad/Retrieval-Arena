import type { Chunk, Chunker, Document } from "../../types"

const strategy = "fixed-size"
export class FixedSizeChunker implements Chunker {
  readonly name: string
  constructor(private chunkSize: number, private overlap: number) {
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

      const chunk: Chunk = {
        id: id,
        documentId: doc.id,
        content,
        strategy,
        charStart: currentStart,
        charEnd: currentEnd,
        tokenCount: 0
      }
      chunks.push(chunk)
    }

    return chunks
  }
}




