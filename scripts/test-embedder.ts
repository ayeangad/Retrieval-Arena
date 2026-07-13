import { OpenAIEmbedder } from "../src/embeddings/openai"

const embedder = new OpenAIEmbedder()
const vectors = await embedder.embed(["The cat sat on the mat.", "Stripe handles payment processing."])

console.log("number of vectors:", vectors.length)
console.log("length of first vector:", vectors[0]?.length)
console.log("first few numbers:", vectors[0]?.slice(0, 5))
