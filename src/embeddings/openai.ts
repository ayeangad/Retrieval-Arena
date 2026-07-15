import type { Embedder } from "../types";
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })

const MAX_SIZE = 2048


export class OpenAIEmbedder implements Embedder {
  readonly name: string
  constructor() {
    if (!process.env.OPENAI_KEY) throw new Error("OpenAI API Key Missing")
    this.name = "OpenAI"
  }
  async embed(texts: string[]): Promise<number[][]> {
    const results: number[][] = []

    for (let i = 0; i < texts.length; i += MAX_SIZE) {
      const batch = texts.slice(i, i + MAX_SIZE)
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: batch,
        encoding_format: "float"
      })
      results.push(...embedding.data.map(item => item.embedding))
    }
    return results
  }
}

