
CREATE TABLE IF NOT EXISTS term_frequencies (
  term TEXT NOT NULL,
  chunk_id TEXT NOT NULL REFERENCES chunks(id) ON DELETE CASCADE,
  strategy TEXT NOT NULL,
  term_count INTEGER NOT NULL,
  PRIMARY KEY (term, chunk_id)
);

CREATE INDEX IF NOT EXISTS idx_term_frequencies_term ON term_frequencies(term);

CREATE INDEX IF NOT EXISTS idx_term_frequencies_strategy ON term_frequencies(strategy);
