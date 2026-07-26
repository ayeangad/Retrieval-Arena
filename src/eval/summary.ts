import type { RetrievalEvaluation, RetrievalSummary } from "../types";

export function summarizeResults(
  retrieverName: string,
  k: number,
  results: RetrievalEvaluation[]
): RetrievalSummary {

  const totalExamples = results.length

  const averagePrecisionAtK = results.reduce(
    (sum, result) => sum + result.precisionAtK,
    0
  ) / totalExamples

  const averageRecallAtK = results.reduce(
    (sum, result) => sum + result.recallAtK,
    0
  ) / totalExamples

  const averageReciprocalRank = results.reduce(
    (sum, result) => sum + result.reciprocalRank,
    0
  ) / totalExamples

  const averageNdcgAtK = results.reduce(
    (sum, result) => sum + result.ndcgAtK,
    0
  ) / totalExamples

  const averageLatencyMs = results.reduce(
    (sum, result) => sum + result.latencyMs,
    0
  ) / totalExamples


  return {
    retrieverName,
    k,
    totalExamples,
    averagePrecisionAtK,
    averageRecallAtK,
    averageReciprocalRank,
    averageNdcgAtK,
    averageLatencyMs
  }










}





