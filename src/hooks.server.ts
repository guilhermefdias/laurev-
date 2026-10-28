import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { SESSION_COOKIE, verifySessionToken } from '#lib/server/auth.ts';
import { appEnv } from '#lib/server/env.ts';

export const handle: Handle = async ({ event, resolve }) => {
	const secret = appEnv().SESSION_SECRET;
	event.locals.isAdmin = await verifySessionToken(event.cookies.get(SESSION_COOKIE), secret);

	const { pathname } = event.url;
	const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/');
	const isLoginPage = pathname === '/admin/login';

	if (isAdminArea && !isLoginPage && !event.locals.isAdmin) {
		redirect(303, '/admin/login');
	}

	const response = await resolve(event);
	if (isAdminArea) {
		response.headers.set('Cache-Control', 'no-store');
		response.headers.set('X-Robots-Tag', 'noindex');
	}
	return response;
};
