import { z } from "zod"

export const judgeResultSchema = z.object({
  correctness: z.enum([
    "correct",
    "partially-correct",
    "incorrect"
  ]),

  faithfulness: z.enum([
    "faithful",
    "partially-faithful",
    "unfaithful"
  ]),

  explanation: z.string()
})


export type JudgeResult = z.infer<typeof judgeResultSchema>

