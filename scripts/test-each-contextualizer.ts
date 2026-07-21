import fs from "node:fs/promises";
import path from "node:path";

import { RecursiveChunker } from "../src/ingestion/chunkers/recursive";
import { NoContextualizer } from "../src/ingestion/contextualizer/NoContextualizer";
import { FullDocumentContextualizer } from "../src/ingestion/contextualizer/FullDocument.ts"
import { WindowSummaryContextualizer } from "../src/ingestion/contextualizer/WindowSummary.ts";

import type { Document, Contextualizer } from "../src/types";

const DOCS_DIR = "data/";

const contextualizers: Contextualizer[] = [
  new NoContextualizer(),
  new FullDocumentContextualizer(),
  new WindowSummaryContextualizer(1),
];

async function main() {
  const chunker = new RecursiveChunker();

  const files = await fs.readdir(DOCS_DIR);

  for (const file of files) {
    const content = await fs.readFile(path.join(DOCS_DIR, file), "utf8");

    const document: Document = {
      id: file,
      source: "test",
      content,
    };

    console.log(`\n==============================`);
    console.log(`Document: ${file}`);
    console.log(`==============================`);

    const chunks = await chunker.chunk(document);

    console.log(`Original chunks: ${chunks.length}`);

    for (const contextualizer of contextualizers) {
      console.log(`\n--- ${contextualizer.constructor.name} ---`);

      const contextualized = await contextualizer.contextualize(
        chunks,
        document
      );

      contextualized.slice(0, 3).forEach((chunk, i) => {
        console.log(`\nChunk ${i + 1}`);

        console.log("Context:");
        console.log(chunk.originalContext ?? "<none>");

        console.log("\nContent:");
        console.log(chunk.content.slice(0, 200));

        console.log("\n-----------------------------");
      });
    }
  }
}

main().catch(console.error);
