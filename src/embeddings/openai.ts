import type { Embedder } from "../types";
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })


export class OpenAIEmbedder implements Embedder {
  readonly name: string
  constructor() {
    if (!process.env.OPENAI_KEY) throw new Error("OpenAI API Key Missing")
    this.name = "OpenAI"
  }
  async embed(texts: string[]): Promise<number[][]> {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
      encoding_format: "float"
    })
    return embedding.data.map(item => item.embedding)
  }
}

