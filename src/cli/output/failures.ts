import type {
  Chunk,
  DatasetEvaluation,
} from "../../types";

export function printFailures(
  evaluation: DatasetEvaluation,
  chunks: Chunk[],
) {
  const failures = evaluation.evaluations.filter(
    (e) => e.recallAtK < 1
  );

  if (failures.length === 0) {
    console.log("✓ No retrieval failures.");
    return;
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(" Retrieval Failures");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log();

  for (const failure of failures) {
    console.log(`${failure.id}`);
    console.log(failure.query);

    console.log();

    console.log(
      `Recall : ${failure.recallAtK.toFixed(2)}`
    );

    console.log(
      `MRR    : ${failure.reciprocalRank.toFixed(2)}`
    );

    console.log();

    const missing = failure.relevantChunkIds.filter(
      (id) => !failure.retrievedChunkIds.includes(id)
    );

    if (missing.length > 0) {
      console.log("Missing Chunks");
      console.log("────────────────────────────");

      for (const id of missing) {
        const chunk = chunks.find((c) => c.id === id);

        if (!chunk) continue;

        const preview =
          chunk.content
            .replace(/\s+/g, " ")
            .slice(0, 180) + "...";

        console.log(`• ${id}`);
        console.log(preview);
        console.log();
      }
    }

    console.log("--------------------------------------------");
    console.log();
  }
}
