#!/usr/bin/env bun

import { writeFile } from "node:fs/promises";

import { sql } from "../src/db/client";
import { buildSearchRegex } from "../src/utils/search";

import { stripeRefunds } from "../src/eval/golden-dataset/stripeRefunds";

import type {
  DraftGoldenExample,
  GoldenExample,
  RelevantSpan,
} from "../src/types";

interface Document {
  id: string;
  content: string;
}

const documents = await sql<Document[]>`
  SELECT id, content
  FROM documents
`;

const documentMap = new Map(
  documents.map((doc) => [doc.id, doc])
);

const goldenDataset: GoldenExample[] = [];

for (const draft of stripeRefunds) {
  const document = documentMap.get(draft.documentId);

  if (!document) {
    throw new Error(
      `Document "${draft.documentId}" not found.`
    );
  }

  const relevantSpans: RelevantSpan[] = [];

  for (const evidence of draft.evidenceTexts) {
    const searchRegex = buildSearchRegex(evidence);

    const globalRegex = new RegExp(
      searchRegex.source,
      searchRegex.flags.includes("g")
        ? searchRegex.flags
        : `${searchRegex.flags}g`
    );

    const matches = [...document.content.matchAll(globalRegex)];

    if (matches.length === 0) {
      console.error(`
❌ ${draft.id}

No match found.

Evidence:
${evidence}
`);

      process.exit(1);
    }

    if (matches.length > 1) {
      console.error(`
❌ ${draft.id}

Multiple matches found.

Evidence:
${evidence}
`);

      matches.forEach((match, index) => {
        const start = match.index!;
        const end = start + match[0].length;

        const preview = document.content
          .slice(
            Math.max(0, start - 80),
            Math.min(document.content.length, end + 80)
          )
          .replace(/\s+/g, " ");

        console.log(`
[${index + 1}]
charStart: ${start}
charEnd:   ${end}

${preview}
`);
      });

      process.exit(1);
    }

    const match = matches[0]!;

    relevantSpans.push({
      documentId: draft.documentId,
      charStart: match.index!,
      charEnd: match.index! + match[0].length,
    });
  }

  goldenDataset.push({
    id: draft.id,
    documentId: draft.documentId,
    query: draft.query,
    queryType: draft.queryType,
    expectedAnswer: draft.expectedAnswer,
    relevantSpans,
  });

  console.log(`✓ ${draft.id}`);
}

const output = `import type { GoldenExample } from "../../types";

export const stripeRefunds: GoldenExample[] = ${JSON.stringify(
  goldenDataset,
  null,
  2
)};
`;

await writeFile(
  "src/eval/golden-dataset/stripeRefunds.ts",
  output
);

await sql.end();

console.log(`
----------------------------------------
Generated ${goldenDataset.length} examples.
Wrote src/eval/golden-dataset/stripeRefunds.ts
----------------------------------------
`);
