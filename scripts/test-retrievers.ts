import { VectorRetriever } from "../src/retrieval/retrievers/vector";
import { BM25Retriever } from "../src/retrieval/retrievers/bm25retriever";
import { tokenize } from "../src/retrieval/tokenize";
import { HybridRetrieval } from "../src/retrieval/retrievers/hybridretriever";

async function runTest() {
  const query = "what would happen if my invoice is configured to be billed through automatic charges";
  const k = 3;

  const vector = new VectorRetriever();
  const bm25 = new BM25Retriever();
  const hybrid = new HybridRetrieval(vector, bm25);

  console.log(`\n--- Testing Query: "${query}" ---\n`);
  console.log("🔍 TOKENS:", tokenize(query));

  const vectorResults = await vector.retrieve({ query, k });
  console.log("🟦 VECTOR RESULTS:");
  vectorResults.forEach((r, i) => console.log(`${i + 1}. [Score: ${r.score.toFixed(4)}] ${r.content.substring(0, 80)}...`));

  const bm25Results = await bm25.retrieve({ query, k });
  console.log("\n🟩 BM25 RESULTS:");
  bm25Results.forEach((r, i) => console.log(`${i + 1}. [Score: ${r.score.toFixed(4)}] ${r.content.substring(0, 80)}...`));

  const hybridResults = await hybrid.retrieve({ query, k });
  console.log("\n🟪 HYBRID RESULTS:");
  hybridResults.forEach((r, i) => console.log(`${i + 1}. [Score: ${r.score.toFixed(4)}] ${r.content.substring(0, 80)}...`));

}

runTest().then(() => process.exit(0)).catch(console.error);

