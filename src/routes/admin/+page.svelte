<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { CATEGORIES, FINISHES } from '#lib/types.ts';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const MAX_SIDE = 1000;

	let previewUrl = $state<string | null>(null);
	let imageError = $state<string | null>(null);
	let processing = $state(false);
	let saving = $state(false);

	const editing = $derived(data.editing);
	const values = $derived({
		id: form?.values?.id ?? editing?.id ?? '',
		nome: form?.values?.nome ?? editing?.name ?? '',
		descricao: form?.values?.descricao ?? editing?.description ?? '',
		categoria: form?.values?.categoria ?? editing?.category ?? 'brincos',
		banho: form?.values?.banho ?? editing?.finish ?? 'dourado',
		preco: form?.values?.preco ?? (editing ? editing.price.toFixed(2).replace('.', ',') : '')
	});
	const currentImage = $derived(previewUrl ?? editing?.imageUrl ?? null);

	function formatPrice(value: number): string {
		return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}

	// Redimensiona e comprime no navegador para caber no banco gratuito.
	async function handleFile(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		imageError = null;
		if (!file) return;

		processing = true;
		try {
			const bitmap = await createImageBitmap(file);
			const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
			const canvas = document.createElement('canvas');
			canvas.width = Math.round(bitmap.width * scale);
			canvas.height = Math.round(bitmap.height * scale);
			canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

			let blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.82));
			if (!blob || blob.type !== 'image/webp') {
				blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
			}
			if (!blob) throw new Error('falha ao converter');

			const extension = blob.type === 'image/webp' ? 'webp' : 'jpg';
			const resized = new File([blob], `peca.${extension}`, { type: blob.type });
			const transfer = new DataTransfer();
			transfer.items.add(resized);
			input.files = transfer.files;

			if (previewUrl) URL.revokeObjectURL(previewUrl);
			previewUrl = URL.createObjectURL(resized);
		} catch {
			input.value = '';
			imageError = 'Não foi possível ler essa imagem. Tente outro arquivo (JPG, PNG ou WebP).';
		} finally {
			processing = false;
		}
	}

	function resetPreview() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = null;
		imageError = null;
	}
</script>

<svelte:head>
	<title>Administração | Catálogo de Semi-Joias</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="min-h-screen bg-neutral-50/50 px-4 py-10 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl space-y-8">
		<header class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<span class="text-xs font-semibold tracking-widest text-amber-600 uppercase">
					Administração
				</span>
				<h1 class="text-2xl font-bold text-neutral-900">Peças do catálogo</h1>
			</div>
			<div class="flex items-center gap-2">
				<a
					href={resolve('/')}
					class="rounded-lg bg-white px-3 py-2 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-100"
				>
					Ver catálogo
				</a>
				<form method="POST" action="?/sair">
					<button
						class="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800"
					>
						Sair
					</button>
				</form>
			</div>
		</header>

		{#if page.url.searchParams.has('salvo')}
			<p class="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800" role="status">
				Peça salva com sucesso.
			</p>
		{:else if page.url.searchParams.has('excluido')}
			<p class="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800" role="status">
				Peça excluída.
			</p>
		{/if}

		<div class="grid gap-8 lg:grid-cols-[22rem_1fr]">
			<!-- Formulário -->
			<section class="h-fit rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-neutral-900">
					{editing ? 'Editar peça' : 'Nova peça'}
				</h2>

				{#key editing?.id ?? 'nova'}
					<form
						method="POST"
						action="?/salvar"
						enctype="multipart/form-data"
						use:enhance={() => {
							saving = true;
							return async ({ update }) => {
								await update({ reset: !editing });
								if (!editing) resetPreview();
								saving = false;
							};
						}}
						class="space-y-4"
					>
						<input type="hidden" name="id" value={values.id} />

						<div class="space-y-1.5">
							<span class="text-sm font-medium text-neutral-700">Foto</span>
							<div
								class="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-100 text-xs text-neutral-400"
							>
								{#if currentImage}
									<img
										src={currentImage}
										alt="Pré-visualização"
										class="h-full w-full object-cover"
									/>
								{:else}
									Nenhuma imagem
								{/if}
							</div>
							<input
								type="file"
								name="imagem"
								accept="image/jpeg,image/png,image/webp"
								onchange={handleFile}
								class="block w-full text-xs text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white"
							/>
							<p class="text-xs text-neutral-400">
								A imagem é reduzida automaticamente antes do envio.
								{#if editing}Deixe em branco para manter a foto atual.{/if}
							</p>
							{#if processing}<p class="text-xs text-neutral-500">Ajustando imagem…</p>{/if}
							{#if imageError}<p class="text-xs text-red-600">{imageError}</p>{/if}
						</div>

						<div class="space-y-1.5">
							<label for="nome" class="text-sm font-medium text-neutral-700">Nome</label>
							<input
								id="nome"
								name="nome"
								required
								maxlength="120"
								value={values.nome}
								class="w-full rounded-lg border-neutral-300 text-sm"
							/>
						</div>

						<div class="space-y-1.5">
							<label for="descricao" class="text-sm font-medium text-neutral-700">Descrição</label>
							<textarea
								id="descricao"
								name="descricao"
								rows="3"
								maxlength="500"
								class="w-full rounded-lg border-neutral-300 text-sm">{values.descricao}</textarea
							>
						</div>

						<div class="grid grid-cols-2 gap-3">
							<div class="space-y-1.5">
								<label for="categoria" class="text-sm font-medium text-neutral-700">Categoria</label
								>
								<select
									id="categoria"
									name="categoria"
									value={values.categoria}
									class="w-full rounded-lg border-neutral-300 text-sm"
								>
									{#each Object.entries(CATEGORIES) as [key, label] (key)}
										<option value={key}>{label}</option>
									{/each}
								</select>
							</div>
							<div class="space-y-1.5">
								<label for="banho" class="text-sm font-medium text-neutral-700">Banho</label>
								<select
									id="banho"
									name="banho"
									value={values.banho}
									class="w-full rounded-lg border-neutral-300 text-sm"
								>
									{#each Object.entries(FINISHES) as [key, label] (key)}
										<option value={key}>{label}</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="space-y-1.5">
							<label for="preco" class="text-sm font-medium text-neutral-700">Preço (R$)</label>
							<input
								id="preco"
								name="preco"
								required
								inputmode="decimal"
								placeholder="89,90"
								value={values.preco}
								class="w-full rounded-lg border-neutral-300 text-sm"
							/>
						</div>

						{#if form?.message}
							<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
								{form.message}
							</p>
						{/if}

						<div class="flex gap-2">
							<button
								type="submit"
								disabled={saving || processing}
								class="flex-1 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
							>
								{saving ? 'Salvando…' : editing ? 'Salvar alterações' : 'Adicionar peça'}
							</button>
							{#if editing}
								<a
									href={resolve('/admin')}
									class="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-100"
									onclick={resetPreview}
								>
									Cancelar
								</a>
							{/if}
						</div>
					</form>
				{/key}
			</section>

			<!-- Lista -->
			<section class="space-y-3">
				{#each data.products as product (product.id)}
					<article
						class="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
					>
						<div class="size-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
							{#if product.imageUrl}
								<img src={product.imageUrl} alt={product.name} class="h-full w-full object-cover" />
							{/if}
						</div>
						<div class="min-w-0 flex-1">
							<h3 class="truncate font-semibold text-neutral-800">{product.name}</h3>
							<p class="text-xs text-neutral-500">
								{CATEGORIES[product.category]} · {FINISHES[product.finish]}
							</p>
							<p class="text-sm font-bold text-neutral-900">{formatPrice(product.price)}</p>
						</div>
						<div class="flex shrink-0 flex-col gap-1.5 sm:flex-row">
							<a
								href="{resolve('/admin')}?editar={product.id}"
								class="rounded-lg px-3 py-1.5 text-center text-xs font-medium text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-100"
							>
								Editar
							</a>
							<form
								method="POST"
								action="?/excluir"
								use:enhance
								onsubmit={(e) => {
									if (!confirm(`Excluir "${product.name}"?`)) e.preventDefault();
								}}
							>
								<input type="hidden" name="id" value={product.id} />
								<button
									class="w-full rounded-lg px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-red-200 hover:bg-red-50"
								>
									Excluir
								</button>
							</form>
						</div>
					</article>
				{:else}
					<div
						class="rounded-2xl border border-dashed border-neutral-300 bg-white py-12 text-center text-sm text-neutral-400"
					>
						Nenhuma peça cadastrada ainda. Use o formulário para adicionar a primeira.
					</div>
				{/each}
			</section>
		</div>
	</div>
</main>
