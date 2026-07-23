
export function ndcgAtK(retrievedChunkIds: string[], relevantChunkIds: string[], k: number): number {

  const relevantSet = new Set(relevantChunkIds);
  const retrievedTopK = retrievedChunkIds.slice(0, k);

  let dcg = 0;

  for (let i = 0; i < retrievedTopK.length; i++) {
    if (relevantSet.has(retrievedTopK[i]!)) {
      dcg += 1 / Math.log2(i + 2);
    }
  }

  const m = Math.min(relevantChunkIds.length, k);

  let idcg = 0;

  for (let i = 0; i < m; i++) {
    idcg += 1 / Math.log2(i + 2);
  }

  if (idcg === 0) {
    return 0;
  }

  return dcg / idcg;
}


