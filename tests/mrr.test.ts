
import { describe, expect, test } from "bun:test";
import { reciprocalRank } from "../src/eval/metrics/mrr";

describe("reciprocalRank", () => {
  test("returns 1 when the first relevant chunk is at rank 1", () => {
    const retrievedChunkIds = ["A", "X", "Y"];
    const relevantChunkIds = ["A", "B"];

    expect(
      reciprocalRank(retrievedChunkIds, relevantChunkIds)
    ).toBe(1);
  });

  test("returns the reciprocal of the first relevant chunk's rank", () => {
    const retrievedChunkIds = ["X", "Y", "Z", "A"];
    const relevantChunkIds = ["A", "B"];

    expect(
      reciprocalRank(retrievedChunkIds, relevantChunkIds)
    ).toBe(1 / 4);
  });

  test("returns 0 when no relevant chunks are retrieved", () => {
    const retrievedChunkIds = ["X", "Y", "Z"];
    const relevantChunkIds = ["A", "B"];

    expect(
      reciprocalRank(retrievedChunkIds, relevantChunkIds)
    ).toBe(0);
  });
});
