import { env } from 'cloudflare:workers';

interface AppEnv {
	/** Banco D1 (binding "DB" no wrangler.jsonc) */
	DB: D1Database;
	/** Secrets: ficam no .dev.vars (local) e em `wrangler secret put` (produção) */
	ADMIN_PASSWORD?: string;
	SESSION_SECRET?: string;
}

/** Bindings e secrets do Cloudflare Workers. */
export function appEnv(): AppEnv {
	return env as unknown as AppEnv;
}
