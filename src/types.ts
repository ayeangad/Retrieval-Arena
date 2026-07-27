import type { JudgeResult } from "./judge/schema"

export type TextUnitType = "paragraph" | "codeblock" | "sentence"
export type QueryType = "factual" | "multi-hop" | "keyword" | "semantic"
export type ContextRole = "retrieved" | "neighbor-before" | "neighbor-after"
export type Correctness = "incorrect" | "partially-correct" | "correct"
export type Faithfulness = "unfaithful" | "partially-faithful" | "faithful"
export type MatchingTerm = { term: string, count: number }

export interface RelevantSpan {
  documentId: string;
  charStart: number;
  charEnd: number;
}

export interface DraftGoldenExample {
  id: string;
  documentId: string;
  query: string;
  queryType: QueryType;
  expectedAnswer: string;
  evidenceTexts: string[];
  notes: string;
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
  retrievalRank: number;
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


export interface RetrievalEvaluation {
  id: string;
  query: string;
  k: number;
  retrievedChunkIds: string[];
  relevantChunkIds: string[];
  precisionAtK: number;
  recallAtK: number;
  reciprocalRank: number;
  ndcgAtK: number;
  latencyMs: number;
}

export interface RetrievalSummary {
  retrieverName: string;
  k: number;
  totalExamples: number;
  averagePrecisionAtK: number;
  averageRecallAtK: number;
  averageReciprocalRank: number;
  averageNdcgAtK: number;
  averageLatencyMs: number;
}


export interface GenerationResult {
  answer: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  }
  latencyMs: number;
  model: string;
}

export interface LLMGenerator {
  readonly name: string;
  generate(parameters: {
    messages: PromptMessage[]
  }): Promise<GenerationResult>;
}


export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface PromptMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerationResult {
  answer: string;
  usage: TokenUsage;
  latencyMs: number;
  model: string;
}

export interface ContextChunk {
  retrieval: RetrievalResult;
  role: ContextRole;
}


export interface Judge {
  readonly name: string;
  judge(parameteres: {
    query: string;
    expectedAnswer: string;
    generatedAnswer: string;
    context: ContextChunk[];
  }): Promise<JudgeResult>;
}


export interface PipelineEvaluation {
  id: string;
  query: string;
  retrieval: RetrievalEvaluation;
  context: ContextChunk[];
  generation: GenerationResult;
  judge: JudgeResult;
}


export interface PipelineConfig {
  chunker: string;
  retriever: string;
  reranker: Reranker | null;
  generator: string;
  judge: string;
  k: number;
}

export interface PipelineSummary {
  config: PipelineConfig;
  totalExamples: number;
  retrieval: RetrievalSummary;
  averageCorrectness: number;
  averageFaithfulness: number;
  averagePromptTokens: number;
  averageCompletionTokens: number;
  averageTotalTokens: number;
  averageGenerationLatencyMs: number;
}

export interface BenchmarkConfig {
  chunker: string;
  retriever: string;
  reranker: string | null;
  generator: string;
  judge: string;
  topK: number;
  dataset: string;
  timestamp: string;
}

export interface BenchmarkResult {
  config: BenchmarkConfig;
  summary: PipelineSummary;
}

export interface Reranker {
  readonly name: string;
  rerank(
    query: string,
    results: RetrievalResult[],
    k: number
  ): Promise<RetrievalResult[]>;
}


