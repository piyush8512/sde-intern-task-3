CREATE TABLE members (
  id      TEXT PRIMARY KEY,
  home_id TEXT NOT NULL,
  name    TEXT NOT NULL,
  CONSTRAINT members_name_not_blank CHECK (length(trim(name)) > 0),
  CONSTRAINT members_home_fk FOREIGN KEY (home_id) REFERENCES homes (id)
);