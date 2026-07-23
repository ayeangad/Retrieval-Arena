import { describe, expect, test } from "bun:test";
import { recallAtK } from "../src/eval/metrics/recall";

describe("recallAtK", () => {
  test("returns the fraction of relevant chunks that were retrieved", () => {
    const retrievedChunkIds = ["A", "X", "B", "Y"];
    const relevantChunkIds = ["A", "B", "C", "D"];

    expect(
      recallAtK(retrievedChunkIds, relevantChunkIds, 4)
    ).toBe(2 / 4);
  });

  test("handles fewer than k retrieved chunks", () => {
    const retrievedChunkIds = ["A", "X"];
    const relevantChunkIds = ["A", "B", "C"];

    expect(
      recallAtK(retrievedChunkIds, relevantChunkIds, 5)
    ).toBe(1 / 3);
  });

  test("returns 0 when there are no relevant chunks", () => {
    const retrievedChunkIds = ["A", "B"];
    const relevantChunkIds: string[] = [];

    expect(
      recallAtK(retrievedChunkIds, relevantChunkIds, 5)
    ).toBe(0);
  });
});
