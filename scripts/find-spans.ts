
import { sql } from "../src/db/client";
import { buildSearchRegex } from "../src/utils/search";

interface Document {
  id: string;
  content: string;
}

function printUsage(): never {
  console.error(`
Usage:
  bun run scripts/find-span.ts --doc <documentId> --contains <phrase>

Example:
  bun run scripts/find-spans.ts \
    --doc doc-2-stripe-3.md \
    --contains "you can’t refund a total greater than the original charge amount"
`);

  process.exit(1);
}

function getArg(name: string): string {
  const index = process.argv.indexOf(name);

  if (index === -1 || index === process.argv.length - 1) {
    printUsage();
  }

  return process.argv[index + 1]!
}

function printMatch(
  document: Document,
  start: number,
  end: number,
  index?: number
) {
  const previewStart = Math.max(0, start - 100);
  const previewEnd = Math.min(document.content.length, end + 100);

  const preview = document.content
    .slice(previewStart, previewEnd)
    .replace(/\s+/g, " ");

  if (index !== undefined) {
    console.log("────────────────────────────────────────────");
    console.log(`[${index + 1}]`);
  }

  console.log(`charStart: ${start}`);
  console.log(`charEnd:   ${end}`);
  console.log();

  console.log(preview);
  console.log();

  if (index === undefined) {
    console.log("RelevantSpan\n");

    console.log(`{
  documentId: "${document.id}",
  charStart: ${start},
  charEnd: ${end},
}`);
  }
}

const documentId = getArg("--doc");
const phrase = getArg("--contains");

const documents = await sql<Document[]>`
  SELECT id, content
  FROM documents
  WHERE id = ${documentId}
`;

if (documents.length === 0) {
  console.error(`Document "${documentId}" not found.`);
  process.exit(1);
}

const document = documents[0]!;

const searchRegex = buildSearchRegex(phrase);

const globalFlags = searchRegex.flags.includes("g")
  ? searchRegex.flags
  : `${searchRegex.flags}g`

const globalRegex = new RegExp(
  searchRegex.source,
  globalFlags
)

const matches = [...document.content.matchAll(globalRegex)];

console.log(document.content.slice(0, 200));

if (matches.length === 0) {
  console.error(`
No matches found.

Try a more distinctive phrase from the document.
`);

  process.exit(1);
}

if (matches.length > 1) {
  console.log(`Found ${matches.length} matches.\n`);

  matches.forEach((match, index) => {
    const start = match.index!;
    const end = start + match[0].length;

    printMatch(document, start, end, index);
  });

  console.log(
    "Multiple matches found. Use a more specific search phrase."
  );

  process.exit(1);
}

const match = matches[0]!;

const charStart = match.index!;
const charEnd = charStart + match[0].length;

console.log("Match found\n");

printMatch(document, charStart, charEnd);
