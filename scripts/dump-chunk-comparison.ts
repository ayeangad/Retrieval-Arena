import { readFileSync, readdirSync } from "fs";
import path from "path";

import { FixedSizeChunker } from "../src/ingestion/chunkers/fixed-size";
import { RecursiveChunker } from "../src/ingestion/chunkers/recursive";
import { SemanticChunker } from "../src/ingestion/chunkers/semantic";
import type { Chunker, Document } from "../src/types.ts";

const CORPUS_DIR = "./data";
const SAMPLE_COUNT = 4;

function loadSampleDocs(dir: string, count: number): Document[] {
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  const sample = files.slice(0, count);

  return sample.map((filename, i) => {
    const content = readFileSync(path.join(dir, filename), "utf-8");
    return {
      id: `sample-${i}-${filename}`,
      source: "test",
      content,
      metadata: { filename },
    } as Document;
  });
}

function truncate(text: string, max = 200): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > max ? cleaned.slice(0, max) + "…" : cleaned;
}

async function dumpForDoc(doc: Document, chunkers: Chunker[]) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`DOC: ${doc.content ?? doc.id}  (${doc.content.length} chars)`);
  console.log("=".repeat(80));

  for (const chunker of chunkers) {
    const chunks = await chunker.chunk(doc);
    console.log(`\n--- ${chunker.name} (${chunks.length} chunks) ---`);
    for (const [i, chunk] of chunks.entries()) {
      console.log(
        ` ${chunk.id}
        [${i}] chars ${chunk.charStart}-${chunk.charEnd} | tokens ${chunk.tokenCount} | ${truncate(chunk.content)}`
      );
    }
  }
}

async function main() {
  const docs = loadSampleDocs(CORPUS_DIR, SAMPLE_COUNT);
  const chunkers: Chunker[] = [
    new FixedSizeChunker(500, 50),
    new RecursiveChunker(),
    new SemanticChunker(),
  ];

  for (const doc of docs) {
    await dumpForDoc(doc, chunkers);
  }
}

main().catch((err) => {
  console.error("Dump script failed:", err);
  process.exit(1);
});
