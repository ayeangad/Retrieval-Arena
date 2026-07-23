export type TextUnitType = "paragraph" | "codeblock" | "sentence"
export type QueryType = "factual" | "multihop" | "keyword" | "semantic"
export type MatchingTerm = { term: string, count: number }

export interface RelevantSpan {
  documentId: string;
  charStart: number;
  charEnd: number;
}

export interface GoldenExample {
  id: string;
  documentId: string;
  query: string;
  queryType: QueryType;
  relevantSpans: RelevantSpan[];
  expectedAnswer: string;
}

export interface Contextualizer {
  contextualize(
    chunks: Chunk[],
    document: Document
  ): Promise<Chunk[]>
}

export interface RerankResult {
  chunk: Chunk;
  score: number;
}

export interface GenerateContextInput {
  chunk: Chunk;
  summary: string;
  neighbors: Chunk[];
}


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
  originalContext?: string;
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
  chunkId: string;
  documentId: string;
  content: string;
  charStart: number;
  charEnd: number;
  score: number;
  retrieverName: string;
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



