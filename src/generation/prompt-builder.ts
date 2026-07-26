import type { ContextChunk, PromptMessage } from "../types";



export function buildPrompt(
  query: string,
  context: ContextChunk[]
): PromptMessage[] {
  const formattedContext = context.map(({ retrieval }, index) => {
    return [
      `=== Chunk ${index + 1} === `,
      `Document: ${retrieval.documentId}`,
      `Chunk ID: ${retrieval.chunkId}`,
      `Retrieval Rank: ${retrieval.retrievalRank}`,
      "",
      retrieval.content.trim(),
    ].join("\n")
  })
    .join("\n\n")


  return [
    {
      role: "system",
      content: `
        You are a helpful assistant.

        Answer ONLY using the provided context.

        If the answer cannot be found in the context, say that you don't know.

        Do not use outside knowledge.
      `.trim(),
    }, {
      role: "user",
      content: `
      Context: 
      ${formattedContext}
  
      Question:
      ${query}
      `.trim()
    },
  ];
}



