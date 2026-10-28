const SESSION_DAYS = 7;
export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
	return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmac(secret: string, message: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

/** Comparação em tempo constante de duas strings hexadecimais de mesmo tamanho. */
function safeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

/** Compara senhas sem vazar informação pelo tempo (compara os hashes SHA-256). */
export async function passwordMatches(input: string, expected: string): Promise<boolean> {
	if (!expected) return false;
	const [a, b] = await Promise.all([
		crypto.subtle.digest('SHA-256', encoder.encode(input)),
		crypto.subtle.digest('SHA-256', encoder.encode(expected))
	]);
	return safeEqual(toHex(a), toHex(b));
}

export async function createSessionToken(secret: string): Promise<string> {
	const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
	const signature = await hmac(secret, `admin.${expires}`);
	return `${expires}.${signature}`;
}

export async function verifySessionToken(
	token: string | undefined,
	secret: string | undefined
): Promise<boolean> {
	if (!token || !secret) return false;
	const [expires, signature] = token.split('.');
	if (!expires || !signature) return false;
	if (!/^\d+$/.test(expires) || Number(expires) < Math.floor(Date.now() / 1000)) return false;
	const expected = await hmac(secret, `admin.${expires}`);
	return safeEqual(signature, expected);
}
