export interface Document {
  id: string;
  source: string;
  content: string;
}

export interface Chunk {
  id: string;
  documentId: string;
  content: string;
  strategy: string;
  charStart: number;
  charEnd: number;
  tokenCount: number;
}

export interface Chunker {
  readonly name: string;
  chunk(doc: Document): Chunk[]
}



