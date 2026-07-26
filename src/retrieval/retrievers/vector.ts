import type { Retrieval, RetrievalResult } from "../../types";
import { OpenAIEmbedder } from "../../embeddings/openai-embedder";
import { sql } from "../../db/client";

const EMBEDDING_MODEL = "text-embedding-3-small";

export class VectorRetriever implements Retrieval {
  readonly name: string
  constructor(private readonly strategy: string) {
    this.name = "vector"
  }

  async retrieve(parameteres: { query: string; k: number; }): Promise<RetrievalResult[]> {
    const embedder = new OpenAIEmbedder()

    const embedStart = performance.now();
    const embeddings = await embedder.embed([parameteres.query])
    console.log("Embedding:", performance.now() - embedStart);

    const queryVector = embeddings[0]
    const vectorLiteral = `[${queryVector!.join(",")}]`;


    const dbStart = performance.now();
    const rows = await sql`
      SELECT
        chunks.id,
        chunks.document_id,
        chunks.content,
        chunks.char_start,
        chunks.char_end,
        (chunk_embeddings.embedding <=> ${vectorLiteral}::vector) AS distance
      FROM chunks
      INNER JOIN chunk_embeddings ON chunks.id = chunk_embeddings.chunk_id
      WHERE
        chunk_embeddings.embedding_model = ${EMBEDDING_MODEL}
        AND chunks.strategy = ${this.strategy}
      ORDER BY chunk_embeddings.embedding <=> ${vectorLiteral}::vector
      LIMIT ${parameteres.k}
    `;
    console.log("Vector DB:", performance.now() - dbStart);

    return rows.map((row, index) => ({
      chunkId: row.id,
      documentId: row.document_id,
      content: row.content,
      charStart: row.char_start,
      charEnd: row.char_end,
      retrievalRank: index + 1,
      score: row.distance,
      retrieverName: this.name
    }));
  }
}




