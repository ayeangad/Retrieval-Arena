import { describe, expect, test } from "bun:test";
import { SemanticChunker } from "../src/ingestion/chunkers/semantic";
import type { Document } from "../src/types";

describe("SemanticChunker - protected ranges", () => {
  test("does not split sentences inside markdown links", async () => {
    const doc: Document = {
      id: "test-doc",
      source: "test",
      content: "See the [docs](https://docs.stripe.com/api/events.md?utm_source=chatgpt.com) for details. This is a second sentence.",
    };
    const chunker = new SemanticChunker();
    const chunks = await chunker.chunk(doc);
    const allText = chunks.map(c => c.content).join(" ");

    expect(allText).toContain("[docs](https://docs.stripe.com/api/events.md?utm_source=chatgpt.com)");
  });

  test("does not split sentences inside inline code spans", async () => {
    const doc: Document = {
      id: "test-doc-2",
      source: "test",
      content: "Call `client.parse_event_notification(payload, sig)` to verify. Then handle the result.",
    };
    const chunker = new SemanticChunker();
    const chunks = await chunker.chunk(doc);
    const allText = chunks.map(c => c.content).join(" ");

    expect(allText).toContain("`client.parse_event_notification(payload, sig)`");
  });
});
