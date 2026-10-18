-- Product catalogue. Managed by the owner from /admin; read by the public site through /assets/catalogue.js.
CREATE TABLE IF NOT EXISTS products (
  sku         TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  cat         TEXT NOT NULL,              -- category slug: buffetware, tableware, packaging, potspans
  mat         TEXT NOT NULL DEFAULT '',   -- material
  img         TEXT NOT NULL DEFAULT '',   -- assets/... (bundled), media/<key> (uploaded to R2) or an Unsplash id
  finish      TEXT NOT NULL DEFAULT '',
  size        TEXT NOT NULL DEFAULT '',
  variants    TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  featured    INTEGER NOT NULL DEFAULT 0,
  hidden      INTEGER NOT NULL DEFAULT 0, -- 1 = kept in the dashboard but not shown on the site
  sort        INTEGER NOT NULL DEFAULT 0,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS products_cat ON products (cat, sort);
