import { formatContext } from "../format-context";
import type { ContextChunk, PromptMessage } from "../types";


interface BuildJudgePromptParams {
  query: string;
  expectedAnswer: string;
  generatedAnswer: string;
  context: ContextChunk[];
}


export function buildJudgePrompt({
  query,
  expectedAnswer,
  generatedAnswer,
  context
}: BuildJudgePromptParams): PromptMessage[] {
  const formattedContext = formatContext(context)


  return [
    {
      role: "system",
      content: `
        You are an expert RAG evaluation judge.

        Your task is to evaluate a generated answer.

        Return ONLY a valid JSON object with EXACTLY this structure:

        {
          "correctness": "correct | partially-correct | incorrect",
          "faithfulness": "faithful | partially-faithful | unfaithful",
          "explanation": "A brief explanation of the evaluation."
        }

        Requirements:
        - Use exactly these key names.
        - Use lowercase enum values exactly as shown.
        - Include all three fields.
        - Do not add extra fields.
        - Do not omit any fields.
        - Return nothing except the JSON object.

        Faithfulness determines whether every factual claim in the generated answer is supported by the retrieved context.

        Do not use outside knowledge.

        If the generated answer contains claims not supported by the retrieved context, it is not fully faithful even if those claims are true.
      `.trim(),
    },
    {
      role: "user",
      content: `
        Question:

        ${query}

        Expected Answer:

        ${expectedAnswer}

        Generated Answer:

        ${generatedAnswer}

        Retrieved Context:

        ${formattedContext}
      `.trim()
    }
  ]
}


