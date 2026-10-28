import { error } from '@sveltejs/kit';
import { appEnv } from '#lib/server/env.ts';
import { getImage } from '#lib/server/products.ts';
import { fromBase64 } from '#lib/server/images.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const image = await getImage(appEnv().DB, params.id);
	if (!image) error(404, 'Imagem não encontrada');

	return new Response(fromBase64(image.data_base64), {
		headers: {
			'Content-Type': image.mime,
			// O id muda sempre que a imagem é trocada, então o cache pode ser permanente.
			'Cache-Control': 'public, max-age=31536000, immutable',
			'X-Content-Type-Options': 'nosniff'
		}
	});
};
