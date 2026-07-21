import type { Chunk, Contextualizer, Document, } from "../../types";

export class NoContextualizer implements Contextualizer {
  async contextualize(
    chunks: Chunk[],
    _document: Document
  ): Promise<Chunk[]> {
    return chunks;
  }
}
