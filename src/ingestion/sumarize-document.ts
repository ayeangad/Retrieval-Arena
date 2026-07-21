import { OpenAI } from "openai";
import type { Document } from "../types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })

export async function summarizeDocument(document: Document): Promise<string> {
  const prompt = `
    You are an expert search indexing system.
    Your task is to generate a dense, factual summary of the following document. This summary will be reused to provide global context when contextualizing individual document chunks for semantic search.
    <document>
    ${document.content}
    </document>
    Generate a concise summary (3-6 sentences) that captures the document's overall context while maximizing retrieval value.
    Requirements:
    1. Capture the document's primary purpose, major topics, and scope.
    2. Explicitly name all important entities, including people, organizations, products, frameworks, APIs, standards, technical terms, dates, and locations when relevant.
    3. Resolve ambiguity by always using specific proper nouns instead of pronouns or generic references such as "the company," "the library," or "the framework."
    4. Preserve terminology that users are likely to search for, but do not invent facts, entities, capabilities, or synonyms that are not supported by the document.
    5. Include document-level context that may not appear in every chunk but is important for understanding the document as a whole, such as its subject, domain, audience, or major sections.
    6. Maximize information density. Every sentence should add searchable semantic information.
    7. Do not summarize stylistically or narratively. Do not include opinions, conversational filler, introductions, or conclusions.
    Forbidden phrases include:
    - "This document is about..."
    - "In summary..."
    - "The author states..."
    - "This article discusses..."
    - "Overall..."
    Output only the summary and nothing else.
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  })

  console.log({
    promptTokens: response.usage?.prompt_tokens,
    completionTokens: response.usage?.completion_tokens,
    totalTokens: response.usage?.total_tokens,
    promptDetails: response.usage?.prompt_tokens_details,
  });


  const summary = response.choices[0]?.message.content?.trim()
  if (!summary) {
    throw new Error("Failed to generate summary")
  }

  return summary
}

