import type { MatchingTerm } from "../../types";

function groupByChunk(rows: { term: string; chunk_id: string; term_count: number }[]): Map<string, MatchingTerm[]> {
  const grouped = new Map<string, MatchingTerm[]>()

  for (const row of rows) {
    if (grouped.has(row.chunk_id)) {
      const term = grouped.get(row.chunk_id)!
      term.push({
        term: row.term,
        count: row.term_count
      })
    } else {
      grouped.set(row.chunk_id, [{
        term: row.term,
        count: row.term_count
      }])
    }
  }

  return grouped
}

function scoreTerm(
  tf: number,
  df: number,
  N: number,
  docLen: number,
  avgDocLen: number,
  k1: number = 1.2,
  b: number = 0.75
): number {

  const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
  const numerator = tf * (k1 + 1);
  const denominator = tf + k1 * (1 - b + b * (docLen / avgDocLen));

  return idf * (numerator / denominator);
}


export function bm25Search(
  rows: { term: string; chunk_id: string; term_count: number; df: number }[],
  chunks: { id: string; token_count: number }[],
  N: number,
  avgDocLen: number,
  k: number,
  k1: number = 1.2,
  b: number = 0.75
): { chunkId: string; score: number }[] {

  const grouped = groupByChunk(rows);
  const docLenMap = new Map(chunks.map(chunk => [chunk.id, chunk.token_count]));
  const dfMap = new Map(rows.map(row => [row.term, row.df]));

  const scoredChunks: { chunkId: string; score: number }[] = [];

  for (const [chunkId, matches] of grouped) {
    let totalScore = 0;
    const docLen = docLenMap.get(chunkId) ?? 0;

    for (const match of matches) {
      const df = dfMap.get(match.term) ?? 0;
      totalScore += scoreTerm(match.count, df, N, docLen, avgDocLen, k1, b);
    }

    scoredChunks.push({ chunkId, score: totalScore });
  }

  scoredChunks.sort((a, b) => b.score - a.score);

  return scoredChunks.slice(0, k);
}


