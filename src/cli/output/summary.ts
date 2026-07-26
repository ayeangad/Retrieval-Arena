import type { PipelineSummary } from "../../types";

export function printSummary(summary: PipelineSummary) {
  const { config, retrieval } = summary;

  console.log();
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(" Retrieval Arena");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log();
  console.log("Configuration");
  console.log("──────────────────────────────────────────────");
  console.log(`Chunker      ${config.chunker}`);
  console.log(`Retriever    ${config.retriever}`);
  console.log(`Generator    ${config.generator}`);
  console.log(`Judge        ${config.judge}`);
  console.log(`Top K        ${config.k}`);
  console.log(`Examples     ${summary.totalExamples}`);
  console.log();

  console.log("Retrieval");
  console.log("──────────────────────────────────────────────");
  console.log(`Precision@${config.k}`.padEnd(20) + retrieval.averagePrecisionAtK.toFixed(3));
  console.log(`Recall@${config.k}`.padEnd(20) + retrieval.averageRecallAtK.toFixed(3));
  console.log("MRR".padEnd(20) + retrieval.averageReciprocalRank.toFixed(3));
  console.log(`nDCG@${config.k}`.padEnd(20) + retrieval.averageNdcgAtK.toFixed(3));
  console.log("Latency".padEnd(20) + `${retrieval.averageLatencyMs.toFixed(2)} ms`);
  console.log();

  console.log("Generation");
  console.log("──────────────────────────────────────────────");
  console.log("Correctness".padEnd(20) + summary.averageCorrectness.toFixed(3));
  console.log("Faithfulness".padEnd(20) + summary.averageFaithfulness.toFixed(3));
  console.log("Prompt tokens".padEnd(20) + summary.averagePromptTokens.toFixed(1));
  console.log("Completion tokens".padEnd(20) + summary.averageCompletionTokens.toFixed(1));
  console.log("Total tokens".padEnd(20) + summary.averageTotalTokens.toFixed(1));
  console.log("Latency".padEnd(20) + `${summary.averageGenerationLatencyMs.toFixed(2)} ms`);
  console.log();
}
