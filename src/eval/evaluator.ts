import type { GoldenExample, Chunk, RetrievalEvaluation, RetrievalResult } from "../types";
import { precisionAtK } from "./metrics/precision";
import { recallAtK } from "./metrics/recall";
import { reciprocalRank } from "./metrics/mrr";
import { ndcgAtK } from "./metrics/ndcg";
import { getRelevantChunkIds } from "./overlap";


export function evaluateRetrieval(
  example: GoldenExample,
  retrievalResults: RetrievalResult[],
  latencyMs: number,
  chunks: Chunk[],
  k: number,
): RetrievalEvaluation {
  const relevantChunkIds = [
    ...new Set(
      example.relevantSpans.flatMap((span) => getRelevantChunkIds(span, chunks)),
    ),
  ];

  const retrievedChunkIds = retrievalResults.map((result) => result.chunkId);

  return {
    id: example.id,
    query: example.query,
    k,
    retrievedChunkIds,
    relevantChunkIds,
    precisionAtK: precisionAtK(retrievedChunkIds, relevantChunkIds, k),
    recallAtK: recallAtK(retrievedChunkIds, relevantChunkIds, k),
    reciprocalRank: reciprocalRank(retrievedChunkIds, relevantChunkIds),
    ndcgAtK: ndcgAtK(retrievedChunkIds, relevantChunkIds, k),
    latencyMs,
  };
}
