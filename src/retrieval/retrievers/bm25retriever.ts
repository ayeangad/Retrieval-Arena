import { sql } from "../../db/client";
import type { Retrieval, RetrievalResult } from "../../types";
import { tokenize } from "../tokenize";
import { bm25Search } from "./bm25";

export class BM25Retriever implements Retrieval {
  readonly name = "bm25";
  constructor(private k1: number = 1.2, private b: number = 0.75) { }

  async retrieve(params: { query: string; k: number }): Promise<RetrievalResult[]> {
    const terms = tokenize(params.query)

    if (terms.length === 0) return []

    const termRows = await sql <{ term: string; chunk_id: string; term_count: number; df: number }[]>`
      SELECT tf.term, tf.chunk_id, tf.term_count, df_table.df
      FROM term_frequencies tf
      JOIN (
        SELECT term, COUNT(DISTINCT chunk_id) AS df
        FROM term_frequencies
        GROUP BY term
      ) df_table ON df_table.term = tf.term
      WHERE tf.term = ANY(${terms}::text[])
    `;

    if (termRows.length === 0) return []

    const candidateChunkIds = [...new Set(termRows.map((r) => r.chunk_id))]

    const chunkRows = await sql<{ id: string; token_count: number; content: string; document_id: string; char_start: number; char_end: number }[]>`
      SELECT id, token_count, content, document_id, char_start, char_end
      FROM chunks
      WHERE id = ANY(${candidateChunkIds}::text[])
    `;

    const [corpusStats] = await sql`
      SELECT COUNT(*) AS n, AVG(token_count) AS avg_doc_len
      FROM chunks
    `;


    const n = Number(corpusStats!.n);
    const avgDocLen = Number(corpusStats!.avg_doc_len);

    const scored = bm25Search(
      termRows,
      chunkRows,
      n,
      avgDocLen,
      params.k,
      this.k1,
      this.b
    );

    const chunkById = new Map(chunkRows.map((c) => [c.id, c]));

    return scored
      .map(({ chunkId, score }) => {
        const chunk = chunkById.get(chunkId);
        if (!chunk) return null;
        return {
          chunkId: chunk.id,
          content: chunk.content,
          documentId: chunk.document_id,
          charStart: chunk.char_start,
          charEnd: chunk.char_end,
          score,
          retrieverName: this.name,
        } satisfies RetrievalResult;
      })
      .filter((r): r is RetrievalResult => r !== null);
  }
}

