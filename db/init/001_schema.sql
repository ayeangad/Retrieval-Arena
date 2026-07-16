
CREATE EXTENSION IF NOT EXISTS vector;

-- Source documents
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  source_path TEXT,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE IF NOT EXISTS chunks (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  strategy TEXT NOT NULL,
  content TEXT NOT NULL,
  char_start INTEGER NOT NULL,
  char_end INTEGER NOT NULL,
  token_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_strategy ON chunks(strategy);


CREATE TABLE IF NOT EXISTS chunk_embeddings (
  chunk_id TEXT NOT NULL REFERENCES chunks(id) ON DELETE CASCADE,
  embedding_model TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (chunk_id, embedding_model)
);

CREATE INDEX IF NOT EXISTS idx_chunk_embeddings_hnsw
  ON chunk_embeddings
  USING hnsw (embedding vector_cosine_ops);
