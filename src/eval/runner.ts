import type { Chunk, GoldenExample, Judge, LLMGenerator, PipelineConfig, PipelineEvaluation, PipelineSummary, Retrieval } from "../types";
import { summarizePipelineResults } from "./summary";
import { evaluatePipeline } from "./pipeline";

export async function evaluateDataset(
  dataset: GoldenExample[],
  chunkerName: string,
  retriever: Retrieval,
  generator: LLMGenerator,
  judge: Judge,
  corpusChunks: Chunk[],
  k: number,
): Promise<{ evaluations: PipelineEvaluation[]; summary: PipelineSummary }> {
  const evaluations: PipelineEvaluation[] = [];

  for (const example of dataset) {
    console.log(`[${evaluations.length + 1}/${dataset.length}] ${example.id}`);
    evaluations.push(
      await evaluatePipeline(example, retriever, generator, judge, corpusChunks, k),
    );
  }

  const config: PipelineConfig = {
    chunker: chunkerName,
    retriever: retriever.name,
    generator: generator.name,
    judge: judge.name,
    k,
  };

  const summary = summarizePipelineResults(config, evaluations);

  return { evaluations, summary };
}
