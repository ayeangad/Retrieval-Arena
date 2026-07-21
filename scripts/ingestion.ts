import { readFileSync, readdirSync } from "fs";
import path from "path";
import { sql } from "../src/db/client";
import { RecursiveChunker } from "../src/ingestion/chunkers/recursive"
import { OpenAIEmbedder } from "../src/embeddings/openai"
import type { Document } from "../src/types"
import { countTermFrequencies, tokenize } from "../src/retrieval/tokenize";
import { contextualizeDocument } from "../src/ingestion/contextualizer/FullDocument.ts";

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
    console.log(`Ingesting ${doc.id}...`);

    await sql`
      INSERT INTO documents (id, source_path, content, metadata)
      VALUES (${doc.id}, ${doc.source}, ${doc.content}, ${sql.json({})})
      ON CONFLICT (id) DO NOTHING
    `;

    let chunks = await chunker.chunk(doc)
    if (chunks.length === 0) continue;

    chunks = await contextualizeDocument(chunks, doc)
    for (const chunk of chunks) {
      await sql`
        INSERT INTO chunks (
          id, document_id, strategy, content, 
          char_start, char_end, token_count, original_context
        )
        VALUES (
          ${chunk.id}, ${chunk.documentId}, ${chunk.strategy}, ${chunk.content}, 
          ${chunk.charStart}, ${chunk.charEnd}, ${chunk.tokenCount}, ${chunk.originalContext || null}
        )
        ON CONFLICT (id) DO NOTHING
      `;

      const tokenized = tokenize(chunk.content)
      const termCounts = countTermFrequencies(tokenized)

      for (const [term, count] of termCounts) {
        await sql`
          INSERT INTO term_frequencies (term, chunk_id, term_count)
          VALUES (${term}, ${chunk.id}, ${count})
          ON CONFLICT (term, chunk_id) DO NOTHING
        `
      }
    }

    const embeddings = await embedder.embed(
      chunks.map((c) =>
        c.originalContext ? `${c.originalContext}\n\n${c.content}` : c.content
      )
    );

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
