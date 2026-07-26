import OpenAI from "openai"
import { buildJudgePrompt } from "./prompt"
import type { ContextChunk, Judge } from "../types"
import { judgeResultSchema, type JudgeResult } from "./schema";
import { zodResponseFormat } from "openai/helpers/zod"

export interface JudgeInput {
  query: string;
  expectedAnswer: string;
  generatedAnswer: string;
  context: ContextChunk[];
}


export class OpenAIJudge implements Judge {
  readonly name = "openai-judge";

  private client = new OpenAI({ apiKey: process.env.OPENAI_KEY })

  async judge({
    query,
    expectedAnswer,
    generatedAnswer,
    context,
  }: JudgeInput): Promise<JudgeResult> {

    const messages = buildJudgePrompt({
      query,
      expectedAnswer,
      generatedAnswer,
      context
    })


    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0,
      response_format: zodResponseFormat(
        judgeResultSchema,
        "judge_result"
      )
    })

    const content = response.choices[0]?.message.content

    if (!content) {
      throw new Error("Judge returned an empty response.")
    }

    const parsedContent = JSON.parse(content)

    return judgeResultSchema.parse(parsedContent)
  }
}








