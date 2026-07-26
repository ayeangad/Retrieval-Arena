import type { GoldenExample, Retrieval, Chunk, RetrievalEvaluation } from "../types";
import { performance } from "node:perf_hooks";
import { precisionAtK } from "./metrics/precision";
import { recallAtK } from "./metrics/recall";
import { reciprocalRank } from "./metrics/mrr";
import { ndcgAtK } from "./metrics/ndcg";
import { getRelevantChunkIds } from "./overlap";


export async function evaluateRetrieval(
  example: GoldenExample,
  retriever: Retrieval,
  chunks: Chunk[],
  k: number,
): Promise<RetrievalEvaluation> {

  const relevantChunkIds = [
    ...new Set(
      example.relevantSpans.flatMap((span) =>

        getRelevantChunkIds(span, chunks)
      )
    ),
  ];

  const start = performance.now();

  const retrievalResults = await retriever.retrieve({
    query: example.query,
    k,
  });

  const latencyMs = performance.now() - start;

  const retrievedChunkIds = retrievalResults.map(
    (result) => result.chunkId
  );

  return {
    id: example.id,
    query: example.query,
    k,

    retrievedChunkIds,
    relevantChunkIds,

    precisionAtK: precisionAtK(
      retrievedChunkIds,
      relevantChunkIds,
      k
    ),

    recallAtK: recallAtK(
      retrievedChunkIds,
      relevantChunkIds,
      k
    ),

    reciprocalRank: reciprocalRank(
      retrievedChunkIds,
      relevantChunkIds
    ),

    ndcgAtK: ndcgAtK(
      retrievedChunkIds,
      relevantChunkIds,
      k
    ),

    latencyMs,
  };
}
