import { defineCommand } from "citty";
import { readdir } from "fs/promises";
import path from "path";
import type { BenchmarkConfig, PipelineSummary } from "../../types";

interface BenchmarkResult {
  config: BenchmarkConfig;
  summary: PipelineSummary;
}

export default defineCommand({
  meta: {
    name: "compare",
    description: "Compare benchmark runs.",
  },

  args: {
    directory: {
      type: "positional",
      required: false,
      default: "results",
    },
  },

  async run({ args }) {
    const resultsDir = args.directory;

    const folders = await readdir(resultsDir, {
      withFileTypes: true,
    });

    const results: BenchmarkResult[] = [];

    for (const folder of folders) {
      if (!folder.isDirectory()) continue;

      const folderPath = path.join(resultsDir, folder.name);

      try {
        const config = await Bun.file(
          path.join(folderPath, "config.json")
        ).json() as BenchmarkConfig;

        const summary = await Bun.file(
          path.join(folderPath, "summary.json")
        ).json() as PipelineSummary;

        results.push({
          config,
          summary,
        });
      } catch {
        console.warn(`Skipping ${folder.name}`);
      }
    }

    results.sort(
      (a, b) =>
        b.summary.averageCorrectness -
        a.summary.averageCorrectness
    );

    console.log("\n🏆 Retrieval Arena Leaderboard\n");

    console.table(
      results.map((r, index) => ({
        Rank: index + 1,
        Chunker: r.config.chunker,
        Retriever: r.config.retriever,
        Reranker: r.config.reranker ?? "-",
        Correctness: r.summary.averageCorrectness.toFixed(3),
        Faithfulness: r.summary.averageFaithfulness.toFixed(3),
        Recall: r.summary.retrieval.averageRecallAtK.toFixed(3),
        Precision: r.summary.retrieval.averagePrecisionAtK.toFixed(3),
        MRR: r.summary.retrieval.averageReciprocalRank.toFixed(3),
        nDCG: r.summary.retrieval.averageNdcgAtK.toFixed(3),
        "Retrieval Latency (ms)":
          r.summary.retrieval.averageLatencyMs.toFixed(2),
        "Generation Latency (ms)":
          r.summary.averageGenerationLatencyMs.toFixed(2),
      }))
    );
  },
});
