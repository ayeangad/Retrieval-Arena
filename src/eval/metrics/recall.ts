
export function recallAtK(retrievedChunkIds: string[], relevantChunkIds: string[], k: number): number {

  if (relevantChunkIds.length === 0) {
    return 0;
  }

  const retrievedTopK = retrievedChunkIds.slice(0, k);
  const relevantSet = new Set(relevantChunkIds);

  const hits = retrievedTopK.filter((id) => relevantSet.has(id)).length;

  return hits / relevantChunkIds.length;
}

