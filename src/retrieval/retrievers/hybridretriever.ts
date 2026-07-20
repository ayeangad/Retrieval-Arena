import type { Retrieval, RetrievalResult } from "../../types";

export class HybridRetrieval implements Retrieval {
  readonly name: string
  constructor(private vectorRetriever: Retrieval, private bm25Retriever: Retrieval, private k: number = 60) {
    this.name = "hybrid"
  }

  async retrieve({ query, k }: { query: string; k: number }): Promise<RetrievalResult[]> {

    const [vectorResults, bm25Results] = await Promise.all([
      this.vectorRetriever.retrieve({ query, k }),
      this.bm25Retriever.retrieve({ query, k })
    ])

    const groupAndSum = new Map<string, RetrievalResult>()

    for (const [index, vector] of vectorResults.entries()) {
      const rank = index + 1
      const rrf = 1 / (this.k + rank)
      vector.score = rrf
      groupAndSum.set(vector.chunkId, {
        ...vector,
        score: rrf,
        retrieverName: this.name
      })
    }

    for (const [index, bm] of bm25Results.entries()) {
      const rank = index + 1
      const rrf = 1 / (this.k + rank)
      if (groupAndSum.has(bm.chunkId)) {
        const existing = groupAndSum.get(bm.chunkId)!
        const combinedScore = existing.score + rrf;
        groupAndSum.set(bm.chunkId, {
          ...bm,
          score: combinedScore
        })
      } else {
        groupAndSum.set(bm.chunkId, {
          ...bm,
          score: rrf,
          retrieverName: this.name
        })
      }
    }

    const results = Array.from(groupAndSum.values());

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, k).map(result => ({
      ...result,
      retrieverName: this.name
    }))

  }


}


