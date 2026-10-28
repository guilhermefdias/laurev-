import { fail, redirect } from '@sveltejs/kit';
import {
	SESSION_COOKIE,
	SESSION_MAX_AGE,
	createSessionToken,
	passwordMatches
} from '#lib/server/auth.ts';
import { appEnv } from '#lib/server/env.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.isAdmin) redirect(303, '/admin');
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const env = appEnv();
		if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
			return fail(500, {
				message: 'Login não configurado: defina ADMIN_PASSWORD e SESSION_SECRET.'
			});
		}

		const form = await request.formData();
		const password = String(form.get('senha') ?? '');

		if (!(await passwordMatches(password, env.ADMIN_PASSWORD))) {
			// Pequeno atraso para dificultar tentativas em massa.
			await new Promise((resolve) => setTimeout(resolve, 600));
			return fail(401, { message: 'Senha incorreta.' });
		}

		cookies.set(SESSION_COOKIE, await createSessionToken(env.SESSION_SECRET), {
			path: '/',
			httpOnly: true,
			secure: url.protocol === 'https:',
			sameSite: 'strict',
			maxAge: SESSION_MAX_AGE
		});
		redirect(303, '/admin');
	}
};
