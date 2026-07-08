import { test, expect } from "bun:test"
import { FixedSizeChunker } from "../src/ingestion/chunkers/fixed-size"

test("produces correct offsets for a 1200-char document", () => {
  const doc = { id: "doc1", source: "test", content: "a".repeat(1200) }
  const chunker = new FixedSizeChunker(500, 50)
  const chunks = chunker.chunk(doc)

  expect(chunks.length).toBe(3)
  expect(chunks[0]?.charStart).toBe(0)
  expect(chunks[0]?.charEnd).toBe(500)

  expect(chunks[1]?.charStart).toBe(450)
  expect(chunks[1]?.charEnd).toBe(950)

  expect(chunks[2]?.charStart).toBe(900)
  expect(chunks[2]?.charEnd).toBe(1200)
})


test("document with no content", () => {
  const doc = { id: "doc1", source: "test", content: "" }
  const chunker = new FixedSizeChunker(500, 50)
  const chunks = chunker.chunk(doc)

  expect(chunks.length).toBe(0)
})


test("document shorter than chunk size", () => {
  const doc = { id: "doc1", source: "test", content: "a".repeat(200) }
  const chunker = new FixedSizeChunker(500, 50)
  const chunks = chunker.chunk(doc)

  expect(chunks.length).toBe(1)
  expect(chunks[0]?.charStart).toBe(0)
  expect(chunks[0]?.charEnd).toBe(200)

})
