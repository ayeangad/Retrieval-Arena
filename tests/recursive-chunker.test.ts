import { test, expect } from "bun:test"
import { RecursiveChunker } from "../src/ingestion/chunkers/recursive"


test("Recursive chunker keeps code blocks intact and respects word budget", async () => {
  const doc = {
    id: "doc1",
    source: "test",
    content:
      `# Building a Simple Document Chunker

When working on document processing systems, it is surprisingly easy to convince yourself that an algorithm is correct by testing it against unrealistic input. A few repeated sentences or a giant wall of text might produce output that looks reasonable, but those examples rarely expose the kinds of edge cases that appear in real documentation. Technical guides, blog posts, and internal documentation usually alternate between explanation, examples, code, and summaries. A good test fixture should resemble those documents closely enough that you can tell whether the chunker is preserving logical boundaries instead of simply cutting at arbitrary positions.

One useful property of realistic documentation is that ideas flow from one paragraph to the next. An introduction establishes context, the following section expands on the problem, and later sections demonstrate a solution before wrapping everything up. This progression gives your chunking logic something meaningful to preserve. If two paragraphs discuss the same concept, keeping them together is often preferable to separating them. On the other hand, if adding another paragraph would make a chunk excessively large, creating a new chunk is usually the better trade-off. These are exactly the kinds of decisions a size-aware chunker should make.

Sometimes documentation includes executable examples that should remain intact even when surrounding text is split into multiple chunks. A code sample often loses much of its value if half of it appears in one chunk and the rest appears somewhere else. Many chunking strategies therefore treat fenced code blocks as indivisible units. The algorithm may move the entire block into a new chunk if necessary, but it should avoid splitting the block itself whenever possible.

\`\`\`ts
  interface Chunk {
    content: string;
wordCount: number;
  }

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

const chunk: Chunk = {
  content: "Example content",
  wordCount: countWords("Example content"),
};

console.log(chunk);
\`\`\`

After the implementation appears to work, it is worth experimenting with different chunk size limits and observing how the output changes. A larger target size should naturally produce fewer chunks, while a smaller limit should increase the number of chunks without disrupting the overall structure of the document. Reading the generated chunks manually is often the fastest way to spot mistakes because abrupt topic changes or incomplete examples stand out immediately. This type of realistic fixture is much more effective than placeholder text because it resembles the material your application is likely to process in production.


Bananas are a good source of potassium. They also contain fiber and vitamin B6. Many people eat them before exercise for quick energy. Unlike apples, they don't need refrigeration to stay fresh for a few days and HNSW indexes trade build time for faster approximate nearest neighbor queries. IVFFlat is cheaper to build but has lower recall at the same speed. The choice between them depends on whether you can tolerate slower ingestion for better query-time performance. Most production RAG systems favor HNSW once the corpus is large enough to justify it.
Images have power, I hope. Normally we try to be pretty private, but in this case I am sharing a photo in the hopes that it might dissuade the next person from throwing a Molotov cocktail at our house, no matter what they think about me and The first person did it last night, at 3:45 am in the morning. Thankfully it bounced off the house and no one got hurt wow and Words have power too. There was an incendiary article about me a few days ago. Someone said to me yesterday they thought it was coming at a time of great anxiety about AI and that it made things more dangerous for me. I brushed it aside.

Now I am awake in the middle of the night and pissed, and thinking that I have underestimated the power of words and narratives. This seems like as good of a time as any to address a few things. 

First, what I believe and *Working towards prosperity for everyone, empowering all people, and advancing science and technology are moral obligations for me and *AI will be the most powerful tool for expanding human capability and potential that anyone has ever seen. Demand for this tool will be essentially uncapped, and people will do incredible things with it. The world deserves huge amounts of AI and we must figure out how to make it happen and *It will not all go well. The fear and anxiety about AI is justified; we are in the process of witnessing the largest change to society in a long time, and perhaps ever. We have to get safety right, which is not just about aligning a model—we urgently need a society-wide response to be resilient to new threats. This includes things like new policy to help navigate through a difficult economic transition in order to get to a much better futurewhile *AI has to be democratized; power cannot be too concentrated. Control of the future belongs to all people and their institutions. AI needs to empower people individually, and we need to make decisions about our future and the new rules collectively. I do not think it is right that a few AI labs would make the most consequential decisions about the shape of our future and *Adaptability is critical. We are all learning about something new very quickly; some of our beliefs will be right and some will be wrong, and sometimes we will need to change our mind quickly as the technology develops and society evolves. No one understands the impacts of superintelligence yet, but they will be immense.

Second, some personal reflections.

As I reflect on my own work in the first decade of OpenAI, I can point to a lot of things I’m proud of and a bunch of mistakes also I was thinking about our upcoming trial with Elon and remembering how much I held the line on not being willing to agree to the unilateral control he wanted over OpenAI. I’m proud of that, and the narrow path we navigated then to allow the continued existence of OpenAI, and all the achievements that followed and I am not proud of being conflict-averse, which has caused great pain for me and OpenAI. I am not proud of handling myself badly in a conflict with our previous board that led to a huge mess for the company. I have made many other mistakes throughout the insane trajectory of OpenAI; I am a flawed person in the center of an exceptionally complex situation, trying to get a little better each year, always working for the mission. We knew going into this how huge the stakes of AI were, and that the personal disagreements between well-meaning people I cared about would be amplified greatly. But it’s another thing to live through these bitter conflicts and often to have to arbitrate them, and the costs have been serious. I am sorry to people I’ve hurt and wish I had learned more faster and I am also very aware that OpenAI is now a major platform, not a scrappy startup, and we need to operate in a more predictable way now. It has been an extremely intense, chaotic, and high-pressure few years. 

Mostly though, I am extremely proud that we are delivering on our mission, which seemed incredibly unlikely when we started. Against all odds, we figured out how to build very powerful AI, figured out how to amass enough capital to build the infrastructure to deliver it, figured out how to build a product company and business, figured out how to deliver reasonably safe and robust services at a massive scale, and much more and A lot of companies say they are going to change the world; we actually did also Third, some thoughts about the industry with My personal takeaway from the last several years, and take on why there has been so much Shakespearean drama between the companies in our field, comes down to this: “Once you see AGI you can’t unsee it.” It has a real "ring of power” dynamic to it, and makes people do crazy things. I don’t mean that AGI is the ring itself, but instead the totalizing philosophy of “being the one to control AGI” and The only solution I can come up with is to orient towards sharing the technology with people broadly, and for no one to have the ring. The two obvious ways to do this are individual empowerment and making sure democratic system stays in control and It is important that the democratic process remains more powerful than companies. Laws and norms are going to change, but we have to work within the democratic process, even though it will be messy and slower than we’d like. We want to be a voice and a stakeholder, but not to have all the power. A lot of the criticism of our industry comes from sincere concern about the incredibly high stakes of this technology. This is quite valid, and we welcome good-faith criticism and debate. I empathize with anti-technology sentiments and clearly technology isn’t always good for everyone. But overall, I believe technological progress can make the future unbelievably good, for your family and mine. 


Finally, remember that a successful chunker is not judged solely by the number of chunks it produces. The quality of the resulting chunks matters just as much. Ideally, each chunk should contain a coherent idea that makes sense when read on its own, while remaining close to the configured size limit. If your implementation consistently produces chunks around three to four hundred words, keeps the fenced code block together, and avoids awkward breaks between related paragraphs, it is probably behaving as intended. From there, you can expand your test suite with lists, tables, block quotes, and other formatting commonly found in real-world Markdown documents.`

  }


  function wordCount(text: string): number {
    return text.split(/\s+/).filter(w => w.length > 0).length
  }

  const chunker = new RecursiveChunker()
  const chunks = await chunker.chunk(doc)


  expect(chunks[0]?.content.includes("function countWords")).toBe(true)

  expect(wordCount(chunks[0]?.content ?? "")).toBeGreaterThanOrEqual(200)
  expect(wordCount(chunks[1]?.content ?? "")).toBeGreaterThanOrEqual(200)


})


