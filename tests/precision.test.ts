import { describe, expect, test } from "bun:test";
import { precisionAtK } from "../src/eval/metrics/precision";

describe("precisionAtK", () => {
  test("returns the fraction of retrieved chunks that are relevant", () => {
    const retrievedChunkIds = ["C", "A", "F", "B", "D"];
    const relevantChunkIds = ["A", "B", "E"];

    expect(
      precisionAtK(retrievedChunkIds, relevantChunkIds, 5)
    ).toBe(2 / 5);
  });

  test("returns 0 when no chunks are retrieved", () => {
    const retrievedChunkIds: string[] = [];
    const relevantChunkIds = ["A", "B", "E"];

    expect(
      precisionAtK(retrievedChunkIds, relevantChunkIds, 5)
    ).toBe(0);
  });

  test("uses the number of retrieved chunks when fewer than k are returned", () => {
    const retrievedChunkIds = ["A", "X", "B"];
    const relevantChunkIds = ["A", "B", "C"];

    expect(
      precisionAtK(retrievedChunkIds, relevantChunkIds, 5)
    ).toBe(2 / 3);
  });
});
