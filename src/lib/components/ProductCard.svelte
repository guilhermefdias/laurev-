<script lang="ts">
	import { INSTAGRAM_USERNAME } from '#lib/config.ts';
	import { CATEGORIES, FINISHES, type Product } from '#lib/types.ts';

	// No Svelte 5, desestruturamos as props a partir de $props()
	let { product }: { product: Product } = $props();

	function getInstagramLink(productName: string): string {
		const message = encodeURIComponent(
			`Olá! Vi o produto "${productName}" no catálogo e gostaria de tirar algumas dúvidas.`
		);
		return `https://ig.me/m/${INSTAGRAM_USERNAME}?text=${message}`;
	}
</script>

<div
	class="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
>
	<!-- Imagem do Produto -->
	<div class="relative aspect-square overflow-hidden bg-neutral-100">
		{#if product.imageUrl}
			<img
				src={product.imageUrl}
				alt={product.name}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				loading="lazy"
			/>
		{/if}
		<span
			class="absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md
      {product.finish === 'dourado'
				? 'border border-amber-200 bg-amber-100/90 text-amber-900'
				: 'border border-slate-200 bg-slate-100/90 text-slate-800'}"
		>
			{FINISHES[product.finish]}
		</span>
	</div>

	<!-- Conteúdo -->
	<div class="flex flex-grow flex-col p-5">
		<span class="mb-1 text-xs font-medium tracking-wider text-neutral-400 uppercase">
			{CATEGORIES[product.category]}
		</span>

		<h3 class="text-lg font-semibold text-neutral-800 transition-colors group-hover:text-amber-700">
			{product.name}
		</h3>

		<p class="mt-1 line-clamp-2 flex-grow text-sm text-neutral-500">
			{product.description}
		</p>

		<div class="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
			<div>
				<span class="block text-xs text-neutral-400">Preço</span>
				<span class="text-xl font-bold text-neutral-900">
					{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
				</span>
			</div>

			<!-- eslint-disable svelte/no-navigation-without-resolve -- link externo (Instagram) -->
			<a
				href={getInstagramLink(product.name)}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-95"
			>
				<span>Perguntar</span>
				<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3"
					/>
				</svg>
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</div>
	</div>
</div>
