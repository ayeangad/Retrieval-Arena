import { sql } from "../../db/client";
import { stripeRefunds } from "../../eval/golden-dataset/stripeRefunds";
import { evaluateDataset } from "../../eval/runner";
import type { BenchmarkConfig, Chunk } from "../../types";
import { printSummary } from "../output/summary";
import { printFailures } from "../output/failures";
import { OpenAIGenerator } from "../../generation/openai-generator";
import { OpenAIJudge } from "../../judge/openai-judge";
import { BM25Retriever } from "../../retrieval/retrievers/bm25retriever";
import { saveResults } from "../../benchmark/save-results";
import { LocalReranker } from "../../retrieval/reranker";
import { VectorRetriever } from "../../retrieval/retrievers/vector";
import { HybridRetrieval } from "../../retrieval/retrievers/hybridretriever";


const K = 5;
const CHUNKER_NAME = "recursive";

const ENABLE_RERANKER = false;

const reranker = ENABLE_RERANKER
  ? new LocalReranker()
  : null;

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
const vector = new VectorRetriever(CHUNKER_NAME)
const bm25 = new BM25Retriever(CHUNKER_NAME)
const hybrid = new HybridRetrieval(vector, bm25)


// change this to benchmark different retrievers
const retriever = hybrid;

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
  reranker,
  generator,
  judge,
  chunks,
  K,
);

const config: BenchmarkConfig = {
  chunker: CHUNKER_NAME,
  retriever: retriever.name,
  reranker: reranker?.name ?? null,
  generator: generator.name,
  judge: judge.name,
  topK: K,
  dataset: "stripe-refunds",
  timestamp: new Date().toISOString(),
};

const folder = await saveResults(
  config,
  summary,
  evaluations
);

console.log(`Results saved to ${folder}`);



printSummary(summary)

printFailures(evaluations, chunks);

await sql.end();



