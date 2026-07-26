import { ContextBuilder } from "../generation/context-builder";
import { buildPrompt } from "../generation/prompt-builder";
import type { Chunk, GoldenExample, Judge, LLMGenerator, PipelineEvaluation, Retrieval } from "../types";
import { evaluateRetrieval } from "./evaluator";


export async function evaluatePipeline(
  example: GoldenExample,
  retriever: Retrieval,
  generator: LLMGenerator,
  judge: Judge,
  corpusChunks: Chunk[],
  k: number,
): Promise<PipelineEvaluation> {

  const start = performance.now();
  const retrievalStart = performance.now();
  const retrievalResults = await retriever.retrieve({ query: example.query, k });
  console.log("Retrieval:", performance.now() - retrievalStart);

  const latencyMs = performance.now() - start;

  const retrieval = evaluateRetrieval(example, retrievalResults, latencyMs, corpusChunks, k);

  const contextBuilder = new ContextBuilder();
  const context = contextBuilder.build(retrievalResults);

  const messages = buildPrompt(example.query, context);
  const generationStart = performance.now()
  const generation = await generator.generate({ messages });
  console.log("Generation:", performance.now() - generationStart);

  const judgeStart = performance.now();
  const judgeResult = await judge.judge({
    query: example.query,
    expectedAnswer: example.expectedAnswer,
    generatedAnswer: generation.answer,
    context,
  });
  console.log("Judge:", performance.now() - judgeStart);


  return {
    id: example.id,
    query: example.query,
    retrieval,
    context,
    generation,
    judge: judgeResult,
  };
}
