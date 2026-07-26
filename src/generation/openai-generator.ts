import OpenAi from "openai"
import type { LLMGenerator, GenerationResult, PromptMessage } from "../types"


export class OpenAIGenerator implements LLMGenerator {
  readonly name = "openai"
  private client = new OpenAi({ apiKey: process.env.OPENAI_KEY })

  async generate({
    messages,
  }: {
    messages: PromptMessage[]
  }): Promise<GenerationResult> {
    const start = performance.now()

    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0
    })

    const latencyMs = performance.now() - start

    return {
      answer: response.choices[0]?.message.content ?? "",

      usage: {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0
      },

      latencyMs,

      model: "gpt-4o-mini"
    }

  }


}



