
import type { GoldenExample } from "../../types.ts";

export const goldenDataset: GoldenExample[] = [
  {
    id: "stripe-invoice-definition",
    documentId: "doc-1-stripe-1.md",
    query: "Which Stripe object represents a bill that a customer needs to pay?",
    queryType: "semantic",
    relevantSpans: [
      {
        documentId: "doc-1-stripe-1.md",
        charStart: 40,
        charEnd: 52,
      },
    ],
    expectedAnswer:
      "The Invoice object. It represents amounts owed by a customer and can be generated either as a one-off invoice or periodically from a subscription.",
  },
];
