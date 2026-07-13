import { test, expect } from "bun:test"
import { RecursiveChunker } from "../src/ingestion/chunkers/recursive"


test("Recursive chunker keeps code blocks intact and respects word budget", async () => {
  const doc = {
    id: "doc1",
    source: "test",
    content:
      `# Building a Simple Document Chunker

When working on document processing systems, it is surprisingly easy to convince yourself that an algorithm is correct by testing it against unrealistic input. A few repeated sentences or a giant wall of text might produce output that looks reasonable, but those examples rarely expose the kinds of edge cases that appear in real documentation. Technical guides, blog posts, and internal documentation usually alternate between explanation, examples, code, and summaries. A good test fixture should resemble those documents closely enough that you can tell whether the chunker is preserving logical boundaries instead of simply cutting at arbitrary positions.

One useful property of realistic documentation is that ideas flow from one paragraph to the next. An introduction establishes context, the following section expands on the problem, and later sections demonstrate a solution before wrapping everything up. This progression gives your chunking logic something meaningful to preserve. If two paragraphs discuss the same concept, keeping them together is often preferable to separating them. On the other hand, if adding another paragraph would make a chunk excessively large, creating a new chunk is usually the better trade-off. These are exactly the kinds of decisions a size-aware chunker should make.

Sometimes documentation includes executable examples that should remain intact even when surrounding text is split into multiple chunks. A code sample often loses much of its value if half of it appears in one chunk and the rest appears somewhere else. Many chunking strategies therefore treat fenced code blocks as indivisible units. The algorithm may move the entire block into a new chunk if necessary, but it should avoid splitting the block itself whenever possible.

\`\`\`ts
  interface Chunk {
    content: string;
wordCount: number;
  }

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

const chunk: Chunk = {
  content: "Example content",
  wordCount: countWords("Example content"),
};

console.log(chunk);
\`\`\`

After the implementation appears to work, it is worth experimenting with different chunk size limits and observing how the output changes. A larger target size should naturally produce fewer chunks, while a smaller limit should increase the number of chunks without disrupting the overall structure of the document. Reading the generated chunks manually is often the fastest way to spot mistakes because abrupt topic changes or incomplete examples stand out immediately. This type of realistic fixture is much more effective than placeholder text because it resembles the material your application is likely to process in production.

Finally, remember that a successful chunker is not judged solely by the number of chunks it produces. The quality of the resulting chunks matters just as much. Ideally, each chunk should contain a coherent idea that makes sense when read on its own, while remaining close to the configured size limit. If your implementation consistently produces chunks around three to four hundred words, keeps the fenced code block together, and avoids awkward breaks between related paragraphs, it is probably behaving as intended. From there, you can expand your test suite with lists, tables, block quotes, and other formatting commonly found in real-world Markdown documents.`

  }


  function wordCount(text: string): number {
    return text.split(/\s+/).filter(w => w.length > 0).length
  }

  const chunker = new RecursiveChunker()
  const chunks = await chunker.chunk(doc)

  expect(chunks.length).toBe(2)

  expect(chunks[0]?.content.includes("function countWords")).toBe(true)

  expect(wordCount(chunks[0]?.content ?? "")).toBeGreaterThanOrEqual(200)
  expect(wordCount(chunks[1]?.content ?? "")).toBeGreaterThanOrEqual(200)


})


