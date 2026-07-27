import type { BenchmarkConfig, PipelineEvaluation, PipelineSummary } from "../types";

export async function saveResults(
  config: BenchmarkConfig,
  summary: PipelineSummary,
  evaluations: PipelineEvaluation[],
): Promise<string> {

  const timestamp = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\..+/, "");

  const folder = `results/${config.chunker}-${config.retriever}-${timestamp}`;

  await Promise.all([
    Bun.write(
      `${folder}/config.json`,
      JSON.stringify(config, null, 2)
    ),
    Bun.write(
      `${folder}/summary.json`,
      JSON.stringify(summary, null, 2)
    ),
    Bun.write(
      `${folder}/evaluations.json`,
      JSON.stringify(evaluations, null, 2)
    ),
  ]);

  return folder;
}
