import { encoding_for_model, type TiktokenModel } from "tiktoken"

const encoderCache = new Map<string, ReturnType<typeof encoding_for_model>>()


function getEncoder(model: TiktokenModel) {
  let encoder = encoderCache.get(model)
  if (!encoder) {
    encoder = encoding_for_model(model)
    encoderCache.set(model, encoder)
  }
  return encoder
}

export function countTokens(text: string, model: TiktokenModel = "text-embedding-3-small"): number {
  const encoder = getEncoder(model)
  return encoder.encode(text).length
}

