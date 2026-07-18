import type { Retrieval, RetrievalResult } from "../../types";
import { OpenAIEmbedder } from "../../embeddings/openai";
import { sql } from "../../db/client";

const EMBEDDING_MODEL = "text-embedding-3-small";

export class VectorRetriever implements Retrieval {
  readonly name: string
  constructor() {
    this.name = "vector"
  }

  async retrieve(parameteres: { query: string; k: number; }): Promise<RetrievalResult[]> {
    const embedder = new OpenAIEmbedder()


    const embeddings = await embedder.embed([parameteres.query])
    const queryVector = embeddings[0]
    const vectorLiteral = `[${queryVector!.join(",")}]`;

    const rows = await sql`
      SELECT
        chunks.document_id,
        chunks.content,
        chunks.char_start,
        chunks.char_end,
        (chunk_embeddings.embedding <=> ${vectorLiteral}::vector) AS distance
      FROM chunks
      INNER JOIN chunk_embeddings ON chunks.id = chunk_embeddings.chunk_id
      WHERE chunk_embeddings.embedding_model = ${EMBEDDING_MODEL}
      ORDER BY chunk_embeddings.embedding <=> ${vectorLiteral}::vector
      LIMIT ${parameteres.k}
    `;

    return rows.map((row) => ({
      documentId: row.document_id,
      content: row.content,
      charStart: row.char_start,
      charEnd: row.char_end,
      score: row.distance,
    }));
  }


}




