
import { describe, expect, test } from "bun:test";
import { ndcgAtK } from "../src/eval/metrics/ndcg";

describe("ndcgAtK", () => {
  test("returns 1 for a perfect ranking", () => {
    const retrievedChunkIds = ["A", "B", "X", "Y", "Z"];
    const relevantChunkIds = ["A", "B"];

    expect(
      ndcgAtK(retrievedChunkIds, relevantChunkIds, 5)
    ).toBe(1);
  });

  test("matches the worked example", () => {
    const resultA = ["A", "B", "X", "Y", "Z"];
    const resultB = ["X", "Y", "Z", "A", "B"];
    const relevant = ["A", "B"];

    expect(
      ndcgAtK(resultA, relevant, 5)
    ).toBeCloseTo(1, 5);

    expect(
      ndcgAtK(resultB, relevant, 5)
    ).toBeCloseTo(0.501, 3);
  });


  test("gives a higher score when relevant chunks appear earlier", () => {
    const resultA = ["A", "B", "X", "Y", "Z"];
    const resultB = ["X", "Y", "Z", "A", "B"];
    const relevantChunkIds = ["A", "B"];

    const ndcgA = ndcgAtK(resultA, relevantChunkIds, 5);
    const ndcgB = ndcgAtK(resultB, relevantChunkIds, 5);

    expect(ndcgA).toBeGreaterThan(ndcgB);
  });

  test("returns 0 when there are no relevant chunks", () => {
    const retrievedChunkIds = ["A", "B", "C"];
    const relevantChunkIds: string[] = [];

    expect(
      ndcgAtK(retrievedChunkIds, relevantChunkIds, 5)
    ).toBe(0);
  });
});
