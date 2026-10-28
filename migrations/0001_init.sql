-- Imagens ficam no próprio D1 (já redimensionadas no navegador), em base64.
CREATE TABLE images (
	id TEXT PRIMARY KEY,
	mime TEXT NOT NULL,
	data_base64 TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE products (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT NOT NULL DEFAULT '',
	category TEXT NOT NULL CHECK (category IN ('brincos', 'pulseiras', 'colares', 'aneis')),
	finish TEXT NOT NULL CHECK (finish IN ('prata', 'dourado')),
	price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
	image_id TEXT REFERENCES images(id),
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_products_created ON products(created_at DESC);
