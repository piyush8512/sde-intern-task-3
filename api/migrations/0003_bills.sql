CREATE UNIQUE INDEX members_id_home_unique ON members (id, home_id);

CREATE TABLE bills (
  seq         INTEGER PRIMARY KEY AUTOINCREMENT,
  id          TEXT    NOT NULL,
  home_id     TEXT    NOT NULL,
  title       TEXT    NOT NULL,
  total_cents INTEGER NOT NULL,

  CONSTRAINT bills_id_unique UNIQUE (id),
  CONSTRAINT bills_id_home_unique UNIQUE (id, home_id),
  CONSTRAINT bills_title_not_blank CHECK (length(trim(title)) > 0),
  CONSTRAINT bills_total_positive_integer
    CHECK (typeof(total_cents) = 'integer' AND total_cents > 0),
  CONSTRAINT bills_home_fk FOREIGN KEY (home_id) REFERENCES homes (id)
);

CREATE INDEX bills_home_order_idx ON bills (home_id, seq);