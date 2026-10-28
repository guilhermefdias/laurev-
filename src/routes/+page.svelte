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
			active: 'bg-slate-700 text-white',
			idle: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
		},
		dourado: {
			active: 'bg-amber-600 text-white',
			idle: 'bg-amber-50 text-amber-800 hover:bg-amber-100'
		}
	};
	const neutral = {
		active: 'bg-neutral-900 text-white',
		idle: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
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
	<title>Catálogo de Semi-Joias</title>
</svelte:head>

<main class="min-h-screen bg-neutral-50/50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl space-y-8">
		<!-- Cabeçalho -->
		<header class="space-y-2 text-center">
			<span class="text-xs font-semibold tracking-widest text-amber-600 uppercase">
				Coleção Exclusiva
			</span>
			<h1 class="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
				Catálogo de Semi-Joias
			</h1>
			<p class="mx-auto max-w-md text-sm text-neutral-500">
				Explore nossas peças banhadas e tire dúvidas diretamente com nossa equipe pelo Instagram.
			</p>
		</header>

		<!-- Barra de Filtros -->
		<section
			class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row"
		>
			<!-- Filtro Categoria -->
			<div class="flex flex-wrap items-center gap-2">
				<span class="mr-2 text-xs font-medium text-neutral-400">Tipo:</span>
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
				<span class="mr-2 text-xs font-medium text-neutral-400">Banho:</span>
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
					class="col-span-full rounded-2xl border border-dashed border-neutral-300 bg-white py-12 text-center text-neutral-400"
				>
					{data.products.length === 0
						? 'Em breve, novas peças por aqui.'
						: 'Nenhuma peça encontrada com os filtros selecionados.'}
				</div>
			{/each}
		</section>
	</div>
</main>
