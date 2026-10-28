import { appEnv } from '#lib/server/env.ts';
import { listProducts } from '#lib/server/products.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const products = await listProducts(appEnv().DB);
	setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=60' });
	return { products };
};
