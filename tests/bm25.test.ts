import { describe, it, expect } from "vitest";
import { bm25Search } from "../src/retrieval/retrievers/bm25";

// Toy corpus, hand-calculated expected scores in comments.
// chunk1: "cat" x1, "sat" x1, docLen=5
// chunk2: "dog" x1, "sat" x1, docLen=5
// chunk3: "cat" x2, docLen=2
// N=3, avgDocLen=4

const chunks = [
  { id: "chunk1", token_count: 5 },
  { id: "chunk2", token_count: 5 },
  { id: "chunk3", token_count: 2 },
];

const N = 3;
const avgDocLen = 4;

describe("bm25Search", () => {
  it("scores a single-term query matching the hand-calculated values", () => {
    // Query: "cat" — df=2 (chunk1, chunk3), chunk2 has no match at all
    const rows = [
      { term: "cat", chunk_id: "chunk1", term_count: 1, df: 2 },
      { term: "cat", chunk_id: "chunk3", term_count: 2, df: 2 },
    ];

    const results = bm25Search(rows, chunks, N, avgDocLen, 10);
    const scoreMap = new Map(results.map((r) => [r.chunkId, r.score]));

    // chunk3 has higher term density in a shorter doc -> should score higher than chunk1
    expect(scoreMap.get("chunk3")).toBeGreaterThan(scoreMap.get("chunk1")!);

    // Hand-calculated values (k1=1.2, b=0.75), tolerance to 4 decimal places
    expect(scoreMap.get("chunk1")).toBeCloseTo(0.42636, 4);
    expect(scoreMap.get("chunk3")).toBeCloseTo(0.75201, 4);

    // chunk2 never appears in rows for this term -> should not be in results at all
    expect(scoreMap.has("chunk2")).toBe(false);
  });

  it("respects the k (topK) cutoff", () => {
    const rows = [
      { term: "cat", chunk_id: "chunk1", term_count: 1, df: 2 },
      { term: "cat", chunk_id: "chunk3", term_count: 2, df: 2 },
    ];

    const results = bm25Search(rows, chunks, N, avgDocLen, 1);
    expect(results).toHaveLength(1);
    expect(results[0].chunkId).toBe("chunk3"); // highest scorer
  });

  it("returns results sorted descending by score", () => {
    const rows = [
      { term: "cat", chunk_id: "chunk1", term_count: 1, df: 2 },
      { term: "cat", chunk_id: "chunk3", term_count: 2, df: 2 },
    ];

    const results = bm25Search(rows, chunks, N, avgDocLen, 10);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("handles a chunk with zero matches gracefully (empty rows)", () => {
    const results = bm25Search([], chunks, N, avgDocLen, 10);
    expect(results).toEqual([]);
  });

  it("boosts a term that appears in fewer chunks (higher idf) over a common term, all else equal", () => {
    // rare term df=1 vs common term df=3, same tf/docLen otherwise
    const rowsRare = [{ term: "rare", chunk_id: "chunk1", term_count: 1, df: 1 }];
    const rowsCommon = [{ term: "common", chunk_id: "chunk1", term_count: 1, df: 3 }];

    const rareResult = bm25Search(rowsRare, chunks, N, avgDocLen, 10)[0];
    const commonResult = bm25Search(rowsCommon, chunks, N, avgDocLen, 10)[0];

    expect(rareResult.score).toBeGreaterThan(commonResult.score);
  });
});
