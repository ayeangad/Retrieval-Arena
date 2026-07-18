import { readFileSync, readdirSync } from "fs";
import path from "path";

import { sql } from "../src/db/client";
import { RecursiveChunker } from "../src/ingestion/chunkers/recursive"
import { OpenAIEmbedder } from "../src/embeddings/openai"
import type { Document } from "../src/types"

const CORPUS_DIR = "./data";
const EMBEDDING_MODEL = "text-embedding-3-small";

function loadDocs(dir: string): Document[] {
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((filename, i) => {
    const content = readFileSync(path.join(dir, filename), "utf-8");
    return {
      id: `doc-${i}-${filename}`,
      source: "tests",
      content,
    } as Document;
  });
}

async function main() {
  const docs = loadDocs(CORPUS_DIR);
  const chunker = new RecursiveChunker()
  const embedder = new OpenAIEmbedder()

  for (const doc of docs) {
    console.log(`Ingesting ${doc.content ?? doc.id}...`);

    await sql`
      INSERT INTO documents (id, source_path, content, metadata)
      VALUES (${doc.id}, ${doc.content ?? null}, ${doc.content}, ${sql.json(doc.content ?? {})})
      ON CONFLICT (id) DO NOTHING
    `;

    const chunks = await chunker.chunk(doc);
    if (chunks.length === 0) continue;

    for (const chunk of chunks) {
      await sql`
        INSERT INTO chunks (id, document_id, strategy, content, char_start, char_end, token_count)
        VALUES (${chunk.id}, ${chunk.documentId}, ${chunk.strategy}, ${chunk.content}, ${chunk.charStart}, ${chunk.charEnd}, ${chunk.tokenCount})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    const embeddings = await embedder.embed(chunks.map((c) => c.content));

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]!;
      const embedding = embeddings[i]!;
      const vectorLiteral = `[${embedding.join(",")}]`;

      await sql`
        INSERT INTO chunk_embeddings (chunk_id, embedding_model, embedding)
        VALUES (${chunk.id}, ${EMBEDDING_MODEL}, ${vectorLiteral}::vector)
        ON CONFLICT (chunk_id, embedding_model) DO NOTHING
      `;
    }

    console.log(`  -> ${chunks.length} chunks embedded and stored`);
  }

  await sql.end();
  console.log("Ingestion complete.");
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
