<script lang="ts">
  import type { Product } from '$lib/types';

  // No Svelte 5, desestruturamos as props a partir de $props()
  let { product }: { product: Product } = $props();

  const instagramUsername = "sua_loja_semijoias";

  function getInstagramLink(productName: string): string {
    const message = encodeURIComponent(`Olá! Vi o produto "${productName}" no catálogo e gostaria de tirar algumas dúvidas.`);
    return `https://ig.me/m/${instagramUsername}?text=${message}`;
  }
</script>

<div class="group border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
  <!-- Imagem do Produto -->
  <div class="relative aspect-square overflow-hidden bg-neutral-100">
    <img 
      src={product.imageUrl} 
      alt={product.name} 
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />
    <span class="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md capitalize 
      {product.finish === 'dourado' ? 'bg-amber-100/90 text-amber-900 border border-amber-200' : 'bg-slate-100/90 text-slate-800 border border-slate-200'}"
    >
      {product.finish}
    </span>
  </div>

  <!-- Conteúdo -->
  <div class="p-5 flex flex-col flex-grow">
    <span class="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
      {product.category}
    </span>
    
    <h3 class="font-semibold text-neutral-800 text-lg group-hover:text-amber-700 transition-colors">
      {product.name}
    </h3>

    <p class="text-sm text-neutral-500 mt-1 line-clamp-2 flex-grow">
      {product.description}
    </p>

    <div class="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
      <div>
        <span class="text-xs text-neutral-400 block">Preço</span>
        <span class="text-xl font-bold text-neutral-900">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </span>
      </div>

      <a 
        href={getInstagramLink(product.name)}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl transition-all shadow-sm active:scale-95"
      >
        <span>Perguntar</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </a>
    </div>
  </div>
</div>