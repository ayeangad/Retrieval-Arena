
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildSearchRegex(phrase: string): RegExp {
  const escaped = escapeRegex(phrase);

  const tokens = escaped
    .trim()
    .split(/\s+/)
    .map((token) => `[*_\`]*${token}[*_\`]*`);

  const pattern = tokens.join("\\s+");

  return new RegExp(pattern, "i");
}
