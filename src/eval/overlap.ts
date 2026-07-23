import type { Chunk, RelevantSpan } from "../types"


function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && endA > startB;
}

export function getRelevantChunkIds(span: RelevantSpan, chunks: Chunk[]): string[] {
  return chunks
    .filter((chunk) =>
      chunk.documentId === span.documentId &&
      rangesOverlap(span.charStart, span.charEnd, chunk.charStart, chunk.charEnd)
    )
    .map((chunk) => chunk.id)
}


