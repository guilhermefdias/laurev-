# Catálogo de Semijoias

Uma vitrine digital para apresentar peças de semijoias, explorar o catálogo por categoria e acabamento e iniciar uma conversa sobre um produto pelo Instagram.

> **Estado do projeto:** primeira versão em desenvolvimento. O catálogo usa produtos de demonstração definidos no código; ainda não há integração com banco de dados ou painel de administração.

## Funcionalidades

- Exibição de produtos com imagem, descrição, categoria, acabamento e preço.
- Filtros por categoria (brincos e pulseiras) e acabamento (prata e dourado), que podem ser combinados.
- Ação para perguntar sobre uma peça pelo Instagram.
- Layout responsivo para diferentes tamanhos de tela.

## Tecnologias

- [SvelteKit](https://svelte.dev/docs/kit) com Svelte 5
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Vite](https://vite.dev/)

## Como executar

Você precisa ter o [Node.js](https://nodejs.org/) e o npm instalados.

```sh
# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Abra no navegador o endereço informado pelo Vite (por padrão, `http://localhost:5173`).

## Comandos disponíveis

| Comando           | Descrição                                     |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento.         |
| `npm run check`   | Verifica os tipos e o código Svelte.          |
| `npm run lint`    | Verifica a formatação e executa o ESLint.     |
| `npm run build`   | Gera a versão de produção.                    |
| `npm run preview` | Serve localmente a versão de produção gerada. |
| `npm run format`  | Formata os arquivos com Prettier.             |

## Produtos e contato

Os produtos de demonstração e os filtros ficam em [`src/routes/+page.svelte`](src/routes/+page.svelte). O formato esperado para cada produto está definido em [`src/lib/types.ts`](src/lib/types.ts), e a apresentação de cada peça está em [`src/lib/components/ProductCard.svelte`](src/lib/components/ProductCard.svelte).

Antes de publicar, substitua o usuário de exemplo `sua_loja_semijoias` no componente de produto pelo perfil do Instagram da loja. As imagens atuais também são URLs externas de demonstração; troque-as por imagens autorizadas e estáveis para produção.

## Estrutura principal

```text
src/
├── lib/
│   ├── components/
│   │   └── ProductCard.svelte
│   └── types.ts
└── routes/
    ├── +layout.svelte
    ├── +page.svelte
    └── layout.css
static/
```

## Próximos passos

- Conectar o catálogo a uma fonte de dados real.
- Completar as categorias e os acabamentos disponíveis conforme o catálogo da loja.
- Configurar o perfil e o fluxo de atendimento da loja antes de publicar.
- Escolher e configurar um adaptador do SvelteKit para a plataforma de hospedagem.
