import { FixedSizeChunker } from "../src/ingestion/chunkers/fixed-size";

const fakeDoc = { id: "doc1", source: "test", content: "a".repeat(1200) }
const chunker = new FixedSizeChunker(500, 50)
const chunks = await chunker.chunk(fakeDoc)

for (const chunk of chunks) {
  console.log(`chunk start= ${chunk.charStart}  chunk end=${chunk.charEnd}  length=${chunk.content.length}  `)
}

