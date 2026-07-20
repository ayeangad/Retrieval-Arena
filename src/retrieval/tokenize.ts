const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by",
  "for", "if", "in", "into", "is", "it",
  "no", "not", "of", "on", "or", "such",
  "that", "the", "their", "then", "there", "these",
  "they", "this", "to", "was", "will", "with",
  "what", "would", "happen", "my", "configured", "through"
]);

export function tokenize(text: string): string[] {
  const lowerCase = text.toLowerCase()
  const splitText = lowerCase.trim().split(/\s+/)

  const cleanUp = splitText.map((a) => a.replace(/[^a-zA-Z0-9]/g, ""))
  const freeupSpace = cleanUp.filter(i => i.length !== 0)

  const stopWords = freeupSpace.filter(token => token.length > 0 && !STOP_WORDS.has(token));

  return stopWords
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




