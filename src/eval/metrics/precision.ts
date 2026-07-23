
export function precisionAtK(retrievedChunkIds: string[], relevantChunkIds: string[], k: number): number {

  const retrievedTopK = retrievedChunkIds.slice(0, k);

  if (retrievedTopK.length === 0) {
    return 0;
  }

  const relevantSet = new Set(relevantChunkIds);
  const hits = retrievedTopK.filter((id) => relevantSet.has(id)).length;

  return hits / retrievedTopK.length;
}

