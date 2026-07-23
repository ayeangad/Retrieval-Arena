import { describe, expect, test } from "bun:test";
import { getRelevantChunkIds } from "../src/eval/overlap";
import type { Chunk, RelevantSpan } from "../src/types";


describe("getRelevantChunkIds", () => {
  test("ignores overlapping chunks from different documents", () => {
    const chunks: Chunk[] = [
      {
        id: "A",
        documentId: "doc-1",
        content: "",
        strategy: "fixed-size",
        tokenCount: 0,
        charStart: 100,
        charEnd: 200,
      },
      {
        id: "B",
        documentId: "doc-2",
        content: "",
        strategy: "fixed-size",
        tokenCount: 0,
        charStart: 100,
        charEnd: 200,
      },
    ];

    const span: RelevantSpan = {
      documentId: "doc-1",
      charStart: 150,
      charEnd: 175,
    };

    expect(getRelevantChunkIds(span, chunks)).toEqual(["A"]);
  });


  test("does not count chunks that only touch the span boundary", () => {
    const chunks: Chunk[] = [
      {
        id: "A",
        documentId: "doc-1",
        content: "",
        strategy: "fixed-size",
        tokenCount: 0,
        charStart: 0,
        charEnd: 100,
      },
      {
        id: "B",
        documentId: "doc-1",
        content: "",
        strategy: "fixed-size",
        tokenCount: 0,
        charStart: 100,
        charEnd: 200,
      },
    ];

    const span: RelevantSpan = {
      documentId: "doc-1",
      charStart: 100,
      charEnd: 150,
    };

    expect(getRelevantChunkIds(span, chunks)).toEqual(["B"]);
  });

  test("returns the ids of all overlapping chunks", () => {
    const chunks: Chunk[] = [
      {
        id: "A",
        documentId: "doc-1",
        content: "",
        strategy: "fixed-size",
        tokenCount: 0,
        charStart: 0,
        charEnd: 100,
      },
      {
        id: "B",
        documentId: "doc-1",
        content: "",
        strategy: "fixed-size",
        tokenCount: 0,
        charStart: 100,
        charEnd: 200,
      },
      {
        id: "C",
        documentId: "doc-1",
        content: "",
        strategy: "fixed-size",
        tokenCount: 0,
        charStart: 200,
        charEnd: 300,
      },
      {
        id: "D",
        documentId: "doc-1",
        content: "",
        strategy: "fixed-size",
        tokenCount: 0,
        charStart: 300,
        charEnd: 400,
      },
    ];

    const span: RelevantSpan = {
      documentId: "doc-1",
      charStart: 150,
      charEnd: 250,
    };

    expect(getRelevantChunkIds(span, chunks)).toEqual(["B", "C"]);
  });

});
