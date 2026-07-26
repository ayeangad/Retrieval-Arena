import type { ContextChunk, RetrievalResult } from "../types";


interface ContextBuilderOptions {
  maxContextChunks?: number;
}

export class ContextBuilder {
  constructor(
    private options: ContextBuilderOptions = {}
  ) { }

  build(
    retrievalResults: RetrievalResult[]
  ): ContextChunk[] {
    const unique = new Map<string, RetrievalResult>()

    for (const result of retrievalResults) {
      if (!unique.has(result.chunkId)) {
        unique.set(result.chunkId, result)
      }
    }

    const budgeted = Array.from(unique.values()).slice(
      0,
      this.options.maxContextChunks ?? unique.size
    )

    const grouped = new Map<string, RetrievalResult[]>()

    for (const chunk of budgeted) {
      const existing = grouped.get(chunk.documentId)

      if (existing) {
        existing.push(chunk)
      } else {
        grouped.set(chunk.documentId, [chunk])
      }
    }

    const orderedGroups = Array.from(grouped.values()).sort(
      (a, b) =>
        Math.min(
          ...a.map((c) => c.retrievalRank)
        ) -
        Math.min(
          ...b.map((c) => c.retrievalRank)
        )
    )


    const context: ContextChunk[] = []

    for (const group of orderedGroups) {
      group.sort(
        (a, b) => a.charStart - b.charStart
      );

      for (const retrieval of group) {
        context.push({
          retrieval,
          role: "retrieved"
        })
      }
    }

    return context
  }
}


