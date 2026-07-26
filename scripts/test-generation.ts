import { stripeRefunds } from "../src/eval/golden-dataset/stripeRefunds";
import { ContextBuilder } from "../src/generation/context-builder";
import { OpenAIGenerator } from "../src/generation/openai-generator";
import { buildPrompt } from "../src/generation/prompt-builder";
import { BM25Retriever } from "../src/retrieval/retrievers/bm25retriever";
import { HybridRetrieval } from "../src/retrieval/retrievers/hybridretriever";
import { VectorRetriever } from "../src/retrieval/retrievers/vector";

const vector = new VectorRetriever();
const bm25 = new BM25Retriever();
const retriever = new HybridRetrieval(vector, bm25);

const results = await retriever.retrieve({
  query: stripeRefunds[0]!.query,
  k: 5,
});

const contextBuilder = new ContextBuilder();
const context = contextBuilder.build(results);

const messages = buildPrompt(
  stripeRefunds[0]!.query,
  context
);

const generator = new OpenAIGenerator();

const generation = await generator.generate({
  messages
});

console.log(messages);
console.log(generation);
