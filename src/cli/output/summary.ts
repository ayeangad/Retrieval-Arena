import type { RetrievalSummary } from "../../types";

export function printSummary(summary: RetrievalSummary) {
  console.log();
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(" Retrieval Arena");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log();

  console.log(`Retriever    ${summary.retrieverName}`);
  console.log(`Examples     ${summary.totalExamples}`);
  console.log(`Top K        ${summary.k}`);

  console.log();
  console.log("Metrics");
  console.log("──────────────────────────────────────────────");

  console.log(
    `Precision@${summary.k}`.padEnd(20) +
    summary.averagePrecisionAtK.toFixed(3)
  );

  console.log(
    `Recall@${summary.k}`.padEnd(20) +
    summary.averageRecallAtK.toFixed(3)
  );

  console.log(
    "MRR".padEnd(20) +
    summary.averageReciprocalRank.toFixed(3)
  );

  console.log(
    `nDCG@${summary.k}`.padEnd(20) +
    summary.averageNdcgAtK.toFixed(3)
  );

  console.log(
    "Latency".padEnd(20) +
    `${summary.averageLatencyMs.toFixed(2)} ms`
  );

  console.log();
}
