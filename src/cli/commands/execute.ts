import { sql } from "../../db/client";
import { stripeRefunds } from "../../eval/golden-dataset/stripeRefunds";
import { evaluateDataset } from "../../eval/runner";
import { VectorRetriever } from "../../retrieval/retrievers/vector";
import { BM25Retriever } from "../../retrieval/retrievers/bm25retriever";
import { HybridRetrieval } from "../../retrieval/retrievers/hybridretriever";
import type { Chunk } from "../../types";

const K = 5;

// Load chunks
const rows = await sql`
  SELECT
    id,
    document_id,
    content,
    strategy,
    char_start,
    char_end,
    token_count
  FROM chunks
`;

const chunks: Chunk[] = rows.map((row) => ({
  id: row.id,
  documentId: row.document_id,
  content: row.content,
  strategy: row.strategy,
  charStart: row.char_start,
  charEnd: row.char_end,
  tokenCount: row.token_count,
}));

// Build retriever
const vector = new VectorRetriever();
const bm25 = new BM25Retriever();
const hybrid = new HybridRetrieval(vector, bm25);

// change this to benchmark different retrievers
const retriever = hybrid;

// Evaluate
const evaluation = await evaluateDataset(
  stripeRefunds,
  retriever,
  chunks,
  K,
);

// Print summary
const summary = evaluation.summary;

console.log("\n========================================");
console.log("Retrieval Arena");
console.log("========================================\n");

console.log(`Retriever: ${summary.retrieverName}`);
console.log(`Dataset: Stripe Refunds`);
console.log(`Examples: ${summary.totalExamples}`);
console.log(`k: ${summary.k}`);

console.log("\nMetrics");
console.log("----------------------------------------");

console.log(
  `Precision@${summary.k}:      ${summary.averagePrecisionAtK.toFixed(3)}`
);

console.log(
  `Recall@${summary.k}:         ${summary.averageRecallAtK.toFixed(3)}`
);

console.log(
  `MRR:               ${summary.averageReciprocalRank.toFixed(3)}`
);

console.log(
  `nDCG@${summary.k}:           ${summary.averageNdcgAtK.toFixed(3)}`
);

console.log(
  `Latency:           ${summary.averageLatencyMs.toFixed(2)} ms`
);

// Failures
const failures = evaluation.evaluations.filter(
  (e) => e.recallAtK < 1
);

if (failures.length > 0) {
  console.log("\nQueries with imperfect recall");
  console.log("----------------------------------------");

  for (const failure of failures) {
    console.log(`${failure.id} (${failure.query})`);
    console.log(
      `Recall: ${failure.recallAtK.toFixed(2)}`
    );
    console.log();
  }
}

await sql.end();
