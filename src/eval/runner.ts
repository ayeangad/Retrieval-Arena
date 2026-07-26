import { evaluateRetrieval } from "./evaluator";
import type { Chunk, DatasetEvaluation, GoldenExample, Retrieval, RetrievalEvaluation } from "../types";
import { summarizeResults } from "./summary";


export async function evaluateDataset(
  dataset: GoldenExample[],
  retriever: Retrieval,
  chunks: Chunk[],
  k: number,
): Promise<DatasetEvaluation> {
  const results: RetrievalEvaluation[] = []

  for (const example of dataset) {
    console.log(
      `[${results.length + 1}/${dataset.length}] ${example.id}`
    );

    const result = await evaluateRetrieval(example, retriever, chunks, k)
    results.push(result)
  }

  const summary = summarizeResults(retriever.name, k, results)

  return {
    summary,
    evaluations: results
  }
}

