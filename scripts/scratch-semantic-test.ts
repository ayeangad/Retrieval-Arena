import { sql } from "../src/db/client";
import { VectorRetriever } from "../src/retrieval/retrievers/vector"; // adjust path if different

async function main() {
  const retriever = new VectorRetriever();

  const results = await retriever.retrieve({
    query: "what would happen if my invoice is configured to be billed through automatic charges",
    k: 3,
  });

  const tables = await sql`
    SELECT content, count(*) FROM chunks GROUP BY content HAVING count(*) > 1 ORDER BY count(*) DESC LIMIT 10;
  `;

  console.log("Duplicate content groups:", tables.map((t) => ({ count: t.count, preview: t.content.slice(0, 100) })));

  console.log(`\nTop ${results.length} results:\n`);
  for (const [i, r] of results.entries()) {
    console.log(`--- Rank ${i + 1} (score: ${r.score}) ---`);
    console.log(r.content.slice(0, 200));
    console.log();
  }

  await sql.end();
}

main().catch((err) => {
  console.error("Retriever smoke test failed:", err);
  process.exit(1);
});


