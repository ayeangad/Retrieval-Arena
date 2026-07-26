import { sql } from "../../db/client";
import { stripeRefunds } from "../../eval/golden-dataset/stripeRefunds";
import { evaluateDataset } from "../../eval/runner";
import { VectorRetriever } from "../../retrieval/retrievers/vector";
import { BM25Retriever } from "../../retrieval/retrievers/bm25retriever";
import { HybridRetrieval } from "../../retrieval/retrievers/hybridretriever";
import type { Chunk } from "../../types";
import { printSummary } from "../output/summary";
import { printFailures } from "../output/failures";
import { OpenAIGenerator } from "../../generation/openai-generator";
import { OpenAIJudge } from "../../judge/openai-judge";

const K = 5;
const CHUNKER_NAME = "fixed-size";

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
  WHERE strategy = ${CHUNKER_NAME}
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
const bm25 = new BM25Retriever()


// change this to benchmark different retrievers
const retriever = bm25;

// build generator + judge
const generator = new OpenAIGenerator();
const judge = new OpenAIJudge();

console.log(`Loaded ${chunks.length} chunks`);

const strategies = [...new Set(chunks.map(c => c.strategy))];
console.log("Strategies:", strategies);

// Evaluate
const { evaluations, summary } = await evaluateDataset(
  stripeRefunds,
  CHUNKER_NAME,
  retriever,
  generator,
  judge,
  chunks,
  K,
);


printSummary(summary)

printFailures(evaluations, chunks);

await sql.end();



