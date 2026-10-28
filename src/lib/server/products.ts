import type { Product, ProductCategory, ProductFinish } from '#lib/types.ts';

interface ProductRow {
	id: string;
	name: string;
	description: string;
	category: ProductCategory;
	finish: ProductFinish;
	price_cents: number;
	image_id: string | null;
}

const COLUMNS = 'id, name, description, category, finish, price_cents, image_id';

function toProduct(row: ProductRow): Product {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		category: row.category,
		finish: row.finish,
		price: row.price_cents / 100,
		imageUrl: row.image_id ? `/imagens/${row.image_id}` : null
	};
}

export async function listProducts(db: D1Database): Promise<Product[]> {
	const { results } = await db
		.prepare(`SELECT ${COLUMNS} FROM products ORDER BY created_at DESC, rowid DESC`)
		.all<ProductRow>();
	return results.map(toProduct);
}

export async function getProduct(db: D1Database, id: string): Promise<Product | null> {
	const row = await db
		.prepare(`SELECT ${COLUMNS} FROM products WHERE id = ?`)
		.bind(id)
		.first<ProductRow>();
	return row ? toProduct(row) : null;
}

export interface ProductInput {
	name: string;
	description: string;
	category: ProductCategory;
	finish: ProductFinish;
	priceCents: number;
}

export interface StoredImage {
	mime: string;
	base64: string;
}

function insertImage(db: D1Database, id: string, image: StoredImage) {
	return db
		.prepare('INSERT INTO images (id, mime, data_base64) VALUES (?, ?, ?)')
		.bind(id, image.mime, image.base64);
}

export async function createProduct(
	db: D1Database,
	input: ProductInput,
	image: StoredImage | null
): Promise<void> {
	const id = crypto.randomUUID();
	const imageId = image ? crypto.randomUUID() : null;
	const statements = [];
	if (image && imageId) statements.push(insertImage(db, imageId, image));
	statements.push(
		db
			.prepare(
				'INSERT INTO products (id, name, description, category, finish, price_cents, image_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
			)
			.bind(
				id,
				input.name,
				input.description,
				input.category,
				input.finish,
				input.priceCents,
				imageId
			)
	);
	await db.batch(statements);
}

export async function updateProduct(
	db: D1Database,
	id: string,
	input: ProductInput,
	image: StoredImage | null
): Promise<boolean> {
	const current = await db
		.prepare('SELECT image_id FROM products WHERE id = ?')
		.bind(id)
		.first<{ image_id: string | null }>();
	if (!current) return false;

	const newImageId = image ? crypto.randomUUID() : null;
	const statements = [];
	if (image && newImageId) statements.push(insertImage(db, newImageId, image));
	statements.push(
		db
			.prepare(
				'UPDATE products SET name = ?, description = ?, category = ?, finish = ?, price_cents = ?, image_id = COALESCE(?, image_id) WHERE id = ?'
			)
			.bind(
				input.name,
				input.description,
				input.category,
				input.finish,
				input.priceCents,
				newImageId,
				id
			)
	);
	if (newImageId && current.image_id) {
		statements.push(db.prepare('DELETE FROM images WHERE id = ?').bind(current.image_id));
	}
	await db.batch(statements);
	return true;
}

export async function deleteProduct(db: D1Database, id: string): Promise<void> {
	const current = await db
		.prepare('SELECT image_id FROM products WHERE id = ?')
		.bind(id)
		.first<{ image_id: string | null }>();
	if (!current) return;
	const statements = [db.prepare('DELETE FROM products WHERE id = ?').bind(id)];
	if (current.image_id) {
		statements.push(db.prepare('DELETE FROM images WHERE id = ?').bind(current.image_id));
	}
	await db.batch(statements);
}

export async function getImage(db: D1Database, id: string) {
	return db
		.prepare('SELECT mime, data_base64 FROM images WHERE id = ?')
		.bind(id)
		.first<{ mime: string; data_base64: string }>();
}
