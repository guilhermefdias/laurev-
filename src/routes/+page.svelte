<script lang="ts">
  import type { Product } from '$lib/types';
  import ProductCard from '$lib/components/ProductCard.svelte';

  // Dados mockados de teste
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Brinco Argola Ponto de Luz',
      description: 'Brinco banhado a ouro 18k com zircônias cravadas à mão.',
      category: 'brincos',
      finish: 'dourado',
      price: 89.90,
      imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      name: 'Pulseira Elos Prata 925',
      description: 'Pulseira em prata de lei com fecho boia ajustável.',
      category: 'pulseiras',
      finish: 'prata',
      price: 129.00,
      imageUrl: 'https://images.unsplash.com/photo-1611591475193-4a11b6217df8?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: '3',
      name: 'Brinco Gota Minimalista',
      description: 'Design moderno com acabamento em prata polida.',
      category: 'brincos',
      finish: 'prata',
      price: 65.00,
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // Estados reativos (Runes do Svelte 5)
  let selectedCategory = $state('todas');
  let selectedFinish = $state('todos');

  // Estado derivado reativo
  let filteredProducts = $derived(
    mockProducts.filter((product) => {
      const matchCategory = selectedCategory === 'todas' || product.category === selectedCategory;
      const matchFinish = selectedFinish === 'todos' || product.finish === selectedFinish;
      return matchCategory && matchFinish;
    })
  );
</script>

<main class="min-h-screen bg-neutral-50/50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Cabeçalho -->
    <header class="text-center space-y-2">
      <span class="text-xs font-semibold tracking-widest text-amber-600 uppercase">Coleção Exclusiva</span>
      <h1 class="text-4xl font-extrabold text-neutral-900 tracking-tight sm:text-5xl">Catálogo de Semi-Joias</h1>
      <p class="text-neutral-500 max-w-md mx-auto text-sm">
        Explore nossas peças banhadas e tire dúvidas diretamente com nossa equipe pelo Instagram.
      </p>
    </header>

    <!-- Barra de Filtros -->
    <section class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm">
      <!-- Filtro Categoria -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium text-neutral-400 mr-2">Tipo:</span>
        <button 
          onclick={() => selectedCategory = 'todas'}
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors {selectedCategory === 'todas' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}"
        >
          Todas
        </button>
        <button 
          onclick={() => selectedCategory = 'brincos'}
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors {selectedCategory === 'brincos' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}"
        >
          Brincos
        </button>
        <button 
          onclick={() => selectedCategory = 'pulseiras'}
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors {selectedCategory === 'pulseiras' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}"
        >
          Pulseiras
        </button>
      </div>

      <!-- Filtro Banho -->
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium text-neutral-400 mr-2">Banho:</span>
        <button 
          onclick={() => selectedFinish = 'todos'}
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors {selectedFinish === 'todos' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}"
        >
          Todos
        </button>
        <button 
          onclick={() => selectedFinish = 'prata'}
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors {selectedFinish === 'prata' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
        >
          Prata
        </button>
        <button 
          onclick={() => selectedFinish = 'dourado'}
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors {selectedFinish === 'dourado' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'}"
        >
          Dourado
        </button>
      </div>
    </section>

    <!-- Grid de Produtos -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredProducts as product (product.id)}
        <ProductCard {product} />
      {:else}
        <div class="col-span-full py-12 text-center text-neutral-400 bg-white rounded-2xl border border-dashed border-neutral-300">
          Nenhuma peça encontrada com os filtros selecionados.
        </div>
      {/each}
    </section>
  </div>
</main>