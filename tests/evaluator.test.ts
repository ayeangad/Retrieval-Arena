import { expect, test } from "bun:test";
import { sql } from "../src/db/client";
import { evaluateRetrieval } from "../src/eval/evaluator";
import { stripeRefunds } from "../src/eval/golden-dataset/stripeRefunds";
import { HybridRetrieval } from "../src/retrieval/retrievers/hybridretriever";
import { VectorRetriever } from "../src/retrieval/retrievers/vector";
import { BM25Retriever } from "../src/retrieval/retrievers/bm25retriever";
import type { Chunk } from "../src/types";

test("evaluate one retrieval example", async () => {

  const vector = new VectorRetriever();
  const bm25 = new BM25Retriever();
  const retriever = new HybridRetrieval(vector, bm25)

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

  const corpusChunks: Chunk[] = rows.map((row) => ({
    id: row.id,
    documentId: row.document_id,
    content: row.content,
    strategy: row.strategy,
    charStart: row.char_start,
    charEnd: row.char_end,
    tokenCount: row.token_count,
  }));


  const example = stripeRefunds[0]!;

  const result = await evaluateRetrieval(
    example,
    retriever,
    corpusChunks,
    5
  );


  console.log(result);

  expect(result.id).toBe("q01");
});
