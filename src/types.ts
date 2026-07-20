export type TextUnitType = "paragraph" | "codeblock" | "sentence"
export type MatchingTerm = { term: string, count: number }


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
  chunk(doc: Document): Promise<Chunk[]>
}

export interface TextUnit {
  type: TextUnitType
  content: string;
  charStart: number;
  charEnd: number;
  tokenCount: number;
}


export interface Embedder {
  readonly name: string;
  embed(texts: string[]): Promise<number[][]>;
}

export interface RetrievalResult {
  documentId: string;
  content: string;
  charStart: number;
  charEnd: number;
  score: number;
}


export interface Retrieval {
  readonly name: string;
  retrieve(
    parameteres: {
      query: string;
      k: number;
    }
  ): Promise<RetrievalResult[]>
}



