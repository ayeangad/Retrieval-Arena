import pLimit from "p-limit"
import { OpenAI } from "openai"
import type { Chunk, Document } from "../types"

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })
const CONCURRENCY_LIMIT = 1
const limit = pLimit(CONCURRENCY_LIMIT)

async function generateContext(chunkContent: string, wholeDocument: string): Promise<string> {
  const prompt = `
  <document> 
  ${wholeDocument} 
  </document> 
  Here is the chunk we want to situate within the whole document 
  <chunk> 
  ${chunkContent} 
  </chunk> 
  Please give a short succinct context to situate this chunk within the overall document for the purposes of improving search retrieval of the chunk. Answer only with the succinct context and nothing else.;
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  })

  return response.choices[0]?.message.content?.trim() || ""
}


export async function contextualizeChunks(chunks: Chunk[], document: Document): Promise<Chunk[]> {
  console.log(`Contextualizing ${chunks.length} chunks for document: ${document.id}`)
  if (chunks.length === 0) return []

  // prompt caching
  const firstChunk = chunks[0]
  try {
    const firstContext = await generateContext(firstChunk!.content, document.content)
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
            const context = await generateContext(chunk.content, document.content)
            return {
              ...chunk,
              originalContext: context
            }
          } catch (error: any) {
            const errorMessage = error?.message || String(error);

            if (errorMessage.includes("429") || errorMessage.includes("Rate limit")) {
              attempts++;
              console.warn(`⏳ Rate limited on chunk ${chunk.id}. Sleeping for 30s... (Attempt ${attempts}/${maxAttempts})`);
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



