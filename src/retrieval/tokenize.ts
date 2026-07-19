
export function tokenize(text: string): string[] {
  const lowerCase = text.toLowerCase()
  const splitText = lowerCase.trim().split(/\s+/)

  const cleanUp = splitText.map((a) => a.replace(/[^a-zA-Z0-9]/g, ""))
  const freeupSpace = cleanUp.filter(i => i.length !== 0)

  return freeupSpace
}


export function countTermFrequencies(tokens: string[]): Map<string, number> {
  const counts = new Map()

  for (const word of tokens) {
    if (counts.has(word)) {
      const currentCount = counts.get(word)
      counts.set(word, currentCount + 1)
    } else {
      counts.set(word, 1)
    }
  }

  return counts
}




