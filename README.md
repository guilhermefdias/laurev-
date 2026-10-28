🚀 **Link do projeto online:** (https://catalogo-semijoias.laurevi.workers.dev)

# Catálogo de Semijoias

Vitrine digital da loja laureví para apresentar peças de semijoias, explorar o catálogo por categoria e acabamento e iniciar uma conversa sobre uma peça pelo Instagram. Inclui uma área de administração protegida por senha para cadastrar, editar e excluir peças (com upload de foto e preço).

## Funcionalidades

- Vitrine pública com imagem, descrição, categoria, acabamento e preço, com filtros combináveis.
- Botão para perguntar sobre uma peça pelo Instagram.
- Área do administrador em `/admin`: login por senha, cadastro/edição/exclusão de peças e upload de foto.
- As fotos são reduzidas automaticamente no navegador (máx. 1000 px, WebP) e guardadas no banco D1, sem precisar de cartão de crédito na Cloudflare.

## Tecnologias

- [SvelteKit](https://svelte.dev/docs/kit) 3 com Svelte 5 e TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) + [D1](https://developers.cloudflare.com/d1/) (SQLite)

## Rodando localmente

```sh
npm install
cp .dev.vars.example .dev.vars   # edite e defina sua senha e um segredo longo
npm run db:migrate:local         # cria as tabelas no D1 local
npm run dev
```

Abra `http://localhost:5173`. O painel fica em `http://localhost:5173/admin`.

## Publicando na Cloudflare (conta gratuita)

1. Entre na sua conta: `npx wrangler login`
2. Crie o banco: `npx wrangler d1 create catalogo-semijoias`
   Copie o `database_id` exibido para `d1_databases[0].database_id` no `wrangler.jsonc`.
3. Crie as tabelas em produção: `npm run db:migrate:remote`
4. Defina os segredos (não ficam no código):
   ```sh
   npx wrangler secret put ADMIN_PASSWORD   # senha do painel
   npx wrangler secret put SESSION_SECRET   # sequência longa e aleatória
   ```
   Para gerar o segredo: `node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"`
5. Publique: `npm run deploy`

Se preferir publicar pelo painel da Cloudflare conectando o GitHub, use o comando de build `npm run build` e o de deploy `npx wrangler deploy`, e cadastre os dois segredos em _Settings → Variables and Secrets_.

## Comandos

| Comando                     | Descrição                                           |
| --------------------------- | --------------------------------------------------- |
| `npm run dev`               | Servidor de desenvolvimento.                        |
| `npm run check`             | Verifica tipos e código Svelte.                     |
| `npm run lint`              | Prettier + ESLint.                                  |
| `npm run build`             | Gera a versão de produção.                          |
| `npm run preview`           | Roda o build localmente no ambiente da Cloudflare.  |
| `npm run db:migrate:local`  | Aplica as migrações no D1 local.                    |
| `npm run db:migrate:remote` | Aplica as migrações no D1 de produção.              |
| `npm run cf-typegen`        | Regenera os tipos do Cloudflare (`wrangler types`). |
| `npm run deploy`            | Build + publicação.                                 |

## Onde está cada coisa

- `src/routes/+page.svelte` — vitrine pública; `src/lib/components/ProductCard.svelte` — card da peça.
- `src/routes/admin/` — painel (`+page.svelte`, `+page.server.ts`) e login (`login/`).
- `src/routes/imagens/[id]/+server.ts` — entrega as fotos guardadas no banco.
- `src/hooks.server.ts` — protege tudo em `/admin` exigindo sessão válida.
- `src/lib/server/` — senha/sessão (`auth.ts`), acesso ao banco (`products.ts`), validação de imagem (`images.ts`).
- `src/lib/config.ts` — **troque o usuário do Instagram da loja aqui** (`INSTAGRAM_USERNAME`).
- `migrations/` — esquema do banco.

## Segurança

- A senha e o segredo da sessão ficam só em variáveis secretas (`.dev.vars` local, `wrangler secret` em produção). O `.dev.vars` está no `.gitignore`.
- A sessão é um cookie `HttpOnly`, `SameSite=Strict` assinado com HMAC (validade de 7 dias).
- O tipo da imagem é verificado pelos bytes do arquivo (JPG, PNG ou WebP), não pelo que o navegador informa.
- Para bloquear tentativas em massa de senha, crie uma regra de _Rate limiting_ na Cloudflare para `/admin/login`.

## Limites do plano gratuito

As imagens ocupam espaço no D1 (5 GB no plano gratuito; cada foto reduzida fica em torno de 50–150 KB). Para um catálogo grande, vale migrar as fotos para o Cloudflare R2.
