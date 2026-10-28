<script lang="ts">
	import ProductCard from '#lib/components/ProductCard.svelte';
	import { CATEGORIES, FINISHES } from '#lib/types.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Estados reativos (Runes do Svelte 5)
	let selectedCategory = $state<string>('todas');
	let selectedFinish = $state<string>('todos');

	const finishStyles: Record<string, { active: string; idle: string }> = {
		prata: {
			active: 'bg-slate-400 text-slate-950',
			idle: 'bg-slate-800 text-slate-200 hover:bg-slate-700'
		},
		dourado: {
			active: 'bg-amber-400 text-slate-950',
			idle: 'bg-amber-950/60 text-amber-200 hover:bg-amber-900'
		}
	};
	const neutral = {
		active: 'bg-amber-400 text-slate-950',
		idle: 'bg-slate-800 text-slate-200 hover:bg-slate-700'
	};

	// Só mostra filtros de categorias que realmente têm peças cadastradas
	const availableCategories = $derived(
		Object.entries(CATEGORIES).filter(([key]) => data.products.some((p) => p.category === key))
	);

	// Estado derivado reativo
	let filteredProducts = $derived(
		data.products.filter((product) => {
			const matchCategory = selectedCategory === 'todas' || product.category === selectedCategory;
			const matchFinish = selectedFinish === 'todos' || product.finish === selectedFinish;
			return matchCategory && matchFinish;
		})
	);
</script>

<svelte:head>
	<title>Catálogo Laureví</title>
</svelte:head>

<main
	class="min-h-screen bg-linear-to-b from-slate-950 via-blue-950 to-slate-900 px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="mx-auto max-w-7xl space-y-8">
		<!-- Cabeçalho -->
		<header class="space-y-2 text-center">
			<span class="text-xs font-semibold tracking-widest text-amber-300 uppercase">
				Coleção Exclusiva
			</span>
			<h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
				Catálogo Laureví
			</h1>
			<p class="mx-auto max-w-md text-sm text-slate-300">
				Explore nossas peças e tire dúvidas diretamente com nossa equipe pelo Instagram.
			</p>
		</header>

		<!-- Barra de Filtros -->
		<section
			class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/20 sm:flex-row"
		>
			<!-- Filtro Categoria -->
			<div class="flex flex-wrap items-center gap-2">
				<span class="mr-2 text-xs font-medium text-slate-300">Tipo:</span>
				<button
					onclick={() => (selectedCategory = 'todas')}
					class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {selectedCategory ===
					'todas'
						? neutral.active
						: neutral.idle}"
				>
					Todas
				</button>
				{#each availableCategories as [key, label] (key)}
					<button
						onclick={() => (selectedCategory = key)}
						class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {selectedCategory ===
						key
							? neutral.active
							: neutral.idle}"
					>
						{label}
					</button>
				{/each}
			</div>

			<!-- Filtro Banho -->
			<div class="flex items-center gap-2">
				<span class="mr-2 text-xs font-medium text-slate-300">Banho:</span>
				<button
					onclick={() => (selectedFinish = 'todos')}
					class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {selectedFinish ===
					'todos'
						? neutral.active
						: neutral.idle}"
				>
					Todos
				</button>
				{#each Object.entries(FINISHES) as [key, label] (key)}
					<button
						onclick={() => (selectedFinish = key)}
						class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {selectedFinish ===
						key
							? finishStyles[key].active
							: finishStyles[key].idle}"
					>
						{label}
					</button>
				{/each}
			</div>
		</section>

		<!-- Grid de Produtos -->
		<section class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredProducts as product (product.id)}
				<ProductCard {product} />
			{:else}
				<div
					class="col-span-full rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 py-12 text-center text-slate-300"
				>
					{data.products.length === 0
						? 'Em breve, novas peças por aqui.'
						: 'Nenhuma peça encontrada com os filtros selecionados.'}
				</div>
			{/each}
		</section>
	</div>
</main>
