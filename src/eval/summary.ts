import type { Correctness, Faithfulness, PipelineConfig, PipelineEvaluation, PipelineSummary, RetrievalEvaluation, RetrievalSummary } from "../types";

export function summarizePipelineResults(
  config: PipelineConfig,
  evaluations: PipelineEvaluation[],
): PipelineSummary {
  const totalExamples = evaluations.length;
  const avg = (fn: (e: PipelineEvaluation) => number) =>
    evaluations.reduce((sum, e) => sum + fn(e), 0) / totalExamples;

  const retrieval = summarizeResults(
    config.retriever,
    config.k,
    evaluations.map((e) => e.retrieval),
  );

  return {
    config,
    totalExamples,
    retrieval,
    averageCorrectness: avg((e) => CORRECTNESS_SCORE[e.judge.correctness]!),
    averageFaithfulness: avg((e) => FAITHFULNESS_SCORE[e.judge.faithfulness]!),
    averagePromptTokens: avg((e) => e.generation.usage.promptTokens),
    averageCompletionTokens: avg((e) => e.generation.usage.completionTokens),
    averageTotalTokens: avg((e) => e.generation.usage.totalTokens),
    averageGenerationLatencyMs: avg((e) => e.generation.latencyMs),
  };
}

export function summarizeResults(
  retrieverName: string,
  k: number,
  results: RetrievalEvaluation[],
): RetrievalSummary {
  if (results.length === 0) {
    throw new Error("Cannot summarize an empty evaluation set.")
  }

  const totalExamples = results.length;

  const avg = (fn: (r: RetrievalEvaluation) => number) =>
    results.reduce((sum, r) => sum + fn(r), 0) / totalExamples;

  return {
    retrieverName,
    k,
    totalExamples,
    averagePrecisionAtK: avg((r) => r.precisionAtK),
    averageRecallAtK: avg((r) => r.recallAtK),
    averageReciprocalRank: avg((r) => r.reciprocalRank),
    averageNdcgAtK: avg((r) => r.ndcgAtK),
    averageLatencyMs: avg((r) => r.latencyMs),
  };
}

const CORRECTNESS_SCORE: Record<Correctness, number> = {
  incorrect: 0,
  "partially-correct": 0.5,
  correct: 1,
};

const FAITHFULNESS_SCORE: Record<Faithfulness, number> = {
  unfaithful: 0,
  "partially-faithful": 0.5,
  faithful: 1,
};

