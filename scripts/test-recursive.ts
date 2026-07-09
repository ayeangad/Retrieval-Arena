import { RecursiveChunker } from "../src/ingestion/chunkers/recursive";

const fakeDoc = {
  id: "dock1",
  source: "test",
  content: `## Section One 

  ${"This is filler sentence content for testing purposes. ".repeat(30)}

  \`\`\`js
  function retry() {
    attempt();
  }
  \`\`\`

  ${"More filter content to push past the word threshold here.".repeat(30)}`
}

const chunker = new RecursiveChunker()
const chunks = chunker.chunk(fakeDoc)

for (const c of chunks) {
  const words = c.content.split(/\s+/).filter(w => w.length > 0).length
  console.log(`start=${c.charStart} end=${c.charEnd} words=${words}`)
  console.log(c.content.slice(0, 80) + "...")
  console.log("---")
}


