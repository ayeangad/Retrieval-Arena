import { pipeline, env } from "@huggingface/transformers"
import type { Chunk, RerankResult } from "../types"


export class LocalReranker {
  private pipe: any = null

  async init() {
    env.allowLocalModels = false

    if (!this.pipe) {
      console.log("Loadingg Local Cross Encoding Model!")
      this.pipe = await pipeline('text-classification', 'Xenova/bge-reranker-base');
    }
  }

  async rerank(query: string, chunks: Chunk[]): Promise<RerankResult[]> {
    await this.init()

    const results: RerankResult[] = []

    for (const chunk of chunks) {
      const output = await this.pipe({
        text: query,
        text_pair: chunk.content
      })

      results.push({
        chunk,
        score: output[0].score
      })
    }

    return results.sort((a, b) => b.score - a.score)
  }

}




