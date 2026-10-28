import { fail, redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '#lib/server/auth.ts';
import { appEnv } from '#lib/server/env.ts';
import { readUploadedImage } from '#lib/server/images.ts';
import {
	createProduct,
	deleteProduct,
	getProduct,
	listProducts,
	updateProduct,
	type ProductInput
} from '#lib/server/products.ts';
import { CATEGORIES, FINISHES, type ProductCategory, type ProductFinish } from '#lib/types.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const db = appEnv().DB;
	const editId = url.searchParams.get('editar');
	const [products, editing] = await Promise.all([
		listProducts(db),
		editId ? getProduct(db, editId) : Promise.resolve(null)
	]);
	return { products, editing };
};

function parsePriceCents(raw: string): number | null {
	// Aceita "89,90", "1.250,00" e "89.90".
	let normalized = raw.trim().replace(/[^\d.,]/g, '');
	if (normalized.includes(',')) normalized = normalized.replace(/\./g, '').replace(',', '.');
	const value = Number(normalized);
	if (!normalized || !Number.isFinite(value) || value < 0 || value > 1_000_000) return null;
	return Math.round(value * 100);
}

export const actions: Actions = {
	salvar: async ({ request }) => {
		const db = appEnv().DB;
		const form = await request.formData();

		const id = String(form.get('id') ?? '');
		const name = String(form.get('nome') ?? '').trim();
		const description = String(form.get('descricao') ?? '').trim();
		const category = String(form.get('categoria') ?? '');
		const finish = String(form.get('banho') ?? '');
		const priceCents = parsePriceCents(String(form.get('preco') ?? ''));

		const values = {
			id,
			nome: name,
			descricao: description,
			categoria: category,
			banho: finish,
			preco: String(form.get('preco') ?? '')
		};

		if (!name || name.length > 120) {
			return fail(400, { message: 'Informe um nome de até 120 caracteres.', values });
		}
		if (description.length > 500) {
			return fail(400, { message: 'A descrição pode ter no máximo 500 caracteres.', values });
		}
		if (!(category in CATEGORIES) || !(finish in FINISHES)) {
			return fail(400, { message: 'Escolha uma categoria e um banho válidos.', values });
		}
		if (priceCents === null) {
			return fail(400, { message: 'Informe um preço válido (ex.: 89,90).', values });
		}

		const upload = await readUploadedImage(form.get('imagem'));
		if (!upload.ok) return fail(400, { message: upload.message, values });

		const input: ProductInput = {
			name,
			description,
			category: category as ProductCategory,
			finish: finish as ProductFinish,
			priceCents
		};

		if (id) {
			const updated = await updateProduct(db, id, input, upload.image);
			if (!updated) return fail(404, { message: 'Peça não encontrada.', values });
		} else {
			await createProduct(db, input, upload.image);
		}

		redirect(303, '/admin?salvo=1');
	},

	excluir: async ({ request }) => {
		const db = appEnv().DB;
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (id) await deleteProduct(db, id);
		redirect(303, '/admin?excluido=1');
	},

	sair: async ({ cookies }) => {
		cookies.delete(SESSION_COOKIE, { path: '/' });
		redirect(303, '/admin/login');
	}
};
