import { sql } from "../../db/client";
import { stripeRefunds } from "../../eval/golden-dataset/stripeRefunds";
import { evaluateDataset } from "../../eval/runner";
import { VectorRetriever } from "../../retrieval/retrievers/vector";
import { BM25Retriever } from "../../retrieval/retrievers/bm25retriever";
import { HybridRetrieval } from "../../retrieval/retrievers/hybridretriever";
import type { Chunk } from "../../types";
import { printSummary } from "../output/summary";
import { printFailures } from "../output/failures";

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

printSummary(evaluation.summary);

printFailures(
  evaluation,
  chunks,
);

await sql.end();


