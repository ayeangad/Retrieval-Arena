import pLimit from "p-limit"
import { OpenAI } from "openai"
import type { Chunk, Contextualizer, Document, GenerateContextInput } from "../../types"
import { summarizeDocument } from "../sumarize-document";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })
const CONCURRENCY_LIMIT = 1
const limit = pLimit(CONCURRENCY_LIMIT)

async function generateContext({ chunk, summary, neighbors }: GenerateContextInput): Promise<string> {
  const prompt = `
    You are an expert search and retrieval system. Your task is to generate a highly dense, search-optimized context string for a specific text chunk.
    To help you understand the broader scope, here is the overarching summary of the source document:
    <document_summary>
    ${summary}
    </document_summary>
    <neighboring_text>
    ${neighbors.map((c) => c.content).join("\n\n")}
    </neighboring_text>
    <target_chunk>
    ${chunk.content}
    </target_chunk>
    Generate a concise contextual description (1-3 sentences).
    Focus on:
    1. Resolving ambiguous references using the document summary and neighboring text.
    2. Adding important document-level context that the chunk implies but does not explicitly state.
    3. Improving semantic search retrieval.
    Answer ONLY with the succinct context string and nothing else.
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  })

  console.log({
    promptTokens: response.usage?.prompt_tokens,
    completionTokens: response.usage?.completion_tokens,
    totalTokens: response.usage?.total_tokens,
    promptDetails: response.usage?.prompt_tokens_details,
  });

  const context = response.choices[0]?.message.content?.trim()
  if (!context) {
    throw new Error("Failed to generate context")
  }

  return context
}


export class WindowSummaryContextualizer implements Contextualizer {
  constructor(private windowSize: number = 1) { }

  async contextualize(chunks: Chunk[], document: Document): Promise<Chunk[]> {
    console.log(`Contextualizing ${chunks.length} chunks for document: ${document.id}`);

    const summary = await summarizeDocument(document)

    if (chunks.length === 0) return []

    // prompt caching
    const firstChunk = chunks[0]
    try {
      const firstContext = await generateContext({
        chunk: firstChunk!,
        summary,
        neighbors: getNeighbors(chunks, 0, this.windowSize)
      })

      firstChunk!.originalContext = firstContext
    } catch (error: any) {
      console.error(`Failed on cache-warming chunk ${firstChunk!.id}:`, error?.message || error)
    }

    const remainingChunks = chunks.slice(1)
    const enrichedChunks = await Promise.all(
      remainingChunks.map(chunk =>
        limit(async () => {
          let attempts = 0
          const maxAttempts = 3

          while (attempts < maxAttempts) {
            try {
              const index = chunks.findIndex(c => c.id === chunk.id)

              const context = await generateContext({
                chunk,
                summary,
                neighbors: getNeighbors(chunks, index, this.windowSize)
              })

              return {
                ...chunk,
                originalContext: context
              }
            } catch (error: any) {
              const errorMessage = error?.message || String(error);

              if (errorMessage.includes("429") || errorMessage.includes("Rate limit")) {
                attempts++;
                console.warn(`Rate limited on chunk ${chunk.id}. Sleeping for 30s... (Attempt ${attempts}/${maxAttempts})`);
                await sleep(30000);
              } else {
                console.error(`Failed chunk ${chunk.id}:`, errorMessage);
                return chunk;
              }

            }
          }
          console.error(`Giving up on chunk ${chunk.id} after ${maxAttempts} rate limit retries.`);
          return chunk;
        })
      )
    )

    return [firstChunk!, ...enrichedChunks]
  }

}

function getNeighbors(chunks: Chunk[], index: number, windowSize: number): Chunk[] {
  return chunks.filter((_, i) => i >= index - windowSize && i <= index + windowSize && i !== index);
}




