import type { Chunk, PipelineEvaluation } from "../../types";

export function printFailures(
  evaluations: PipelineEvaluation[],
  chunks: Chunk[],
) {
  const failures = evaluations.filter((e) => e.retrieval.recallAtK < 1);

  if (failures.length === 0) {
    console.log("✓ No retrieval failures.");
    return;
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(" Retrieval Failures");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log();

  for (const failure of failures) {
    const { retrieval } = failure;

    console.log(`${failure.id}`);
    console.log(failure.query);
    console.log();
    console.log(`Recall : ${retrieval.recallAtK.toFixed(2)}`);
    console.log(`MRR    : ${retrieval.reciprocalRank.toFixed(2)}`);
    console.log();

    const missing = retrieval.relevantChunkIds.filter(
      (id) => !retrieval.retrievedChunkIds.includes(id),
    );

    if (missing.length > 0) {
      console.log("Missing Chunks");
      console.log("────────────────────────────");
      for (const id of missing) {
        const chunk = chunks.find((c) => c.id === id);
        if (!chunk) continue;
        const preview = chunk.content.replace(/\s+/g, " ").slice(0, 180) + "...";
        console.log(`• ${id}`);
        console.log(preview);
        console.log();
      }
    }

    console.log("--------------------------------------------");
    console.log();
  }
}
