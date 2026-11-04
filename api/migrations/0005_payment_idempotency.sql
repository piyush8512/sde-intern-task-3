ALTER TABLE shares ADD COLUMN idempotency_key TEXT;

CREATE INDEX shares_payment_lookup_idx ON shares (bill_id, id);
