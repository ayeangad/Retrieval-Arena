
export function reciprocalRank(retrievedChunkIds: string[], relevantChunkIds: string[]): number {
  const relevantSet = new Set(relevantChunkIds);

  const firstRelevantIndex = retrievedChunkIds.findIndex((id) =>
    relevantSet.has(id)
  )

  if (firstRelevantIndex === -1) {
    return 0
  }

  return 1 / (firstRelevantIndex + 1);
}



