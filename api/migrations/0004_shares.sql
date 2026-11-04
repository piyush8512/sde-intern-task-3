CREATE TABLE shares (
  id          TEXT    PRIMARY KEY,
  bill_id     TEXT    NOT NULL,
  member_id   TEXT    NOT NULL,
  home_id     TEXT    NOT NULL,
  amount_cents INTEGER NOT NULL,
  paid_at     TEXT,

  CONSTRAINT shares_amount_positive_integer
    CHECK (typeof(amount_cents) = 'integer' AND amount_cents > 0),
  CONSTRAINT shares_bill_fk FOREIGN KEY (bill_id) REFERENCES bills (id),
  CONSTRAINT shares_member_fk FOREIGN KEY (member_id, home_id)
    REFERENCES members (id, home_id)
);

CREATE INDEX shares_bill_idx ON shares (bill_id);
CREATE INDEX shares_home_member_idx ON shares (home_id, member_id);
