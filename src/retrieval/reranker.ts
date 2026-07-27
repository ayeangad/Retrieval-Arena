import { pipeline, env } from "@huggingface/transformers";
import type { RetrievalResult, Reranker } from "../types";

export class LocalReranker implements Reranker {
  readonly name = "bge-reranker-base";
  private pipe: any = null;

  async init() {
    env.allowLocalModels = false;

    if (!this.pipe) {
      console.log("Loading local cross-encoder...");
      this.pipe = await pipeline(
        "text-classification",
        "Xenova/bge-reranker-base"
      );
    }
  }

  async rerank(
    query: string,
    results: RetrievalResult[],
    k: number
  ): Promise<RetrievalResult[]> {

    await this.init();

    const scored = await Promise.all(
      results.map(async (result) => {
        const output = await this.pipe({
          text: query,
          text_pair: result.content,
        });

        return {
          result,
          score: output[0].score,
        };
      })
    );

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(({ result }, index) => ({
        ...result,
        retrievalRank: index + 1,
      }));
  }
}




