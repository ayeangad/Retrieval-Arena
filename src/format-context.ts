import type { ContextChunk } from "./types"


export function formatContext(
  context: ContextChunk[]
): string {
  return context.map(({ retrieval, role }, index) => {
    return [
      `=== Chunk ${index + 1} ===`,
      `Role: ${role}`,
      `Document: ${retrieval.documentId}`,
      `Chunk ID: ${retrieval.chunkId}`,
      `Retrieval Rank: ${retrieval.retrievalRank}`,
      "",
      retrieval.content.trim()
    ].join("\n")
  })
    .join("\n\n")
}




