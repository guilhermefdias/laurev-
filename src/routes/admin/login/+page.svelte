<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let enviando = $state(false);
</script>

<svelte:head>
	<title>Entrar | Administração</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-neutral-50/50 px-4">
	<form
		method="POST"
		use:enhance={() => {
			enviando = true;
			return async ({ update }) => {
				await update();
				enviando = false;
			};
		}}
		class="w-full max-w-sm space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
	>
		<div class="space-y-1 text-center">
			<span class="text-xs font-semibold tracking-widest text-amber-600 uppercase"
				>Área restrita</span
			>
			<h1 class="text-2xl font-bold text-neutral-900">Administração</h1>
		</div>

		<div class="space-y-1.5">
			<label for="senha" class="text-sm font-medium text-neutral-700">Senha</label>
			<input
				id="senha"
				name="senha"
				type="password"
				required
				autocomplete="current-password"
				class="w-full rounded-lg border-neutral-300 text-sm focus:border-neutral-900 focus:ring-neutral-900"
			/>
		</div>

		{#if form?.message}
			<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{form.message}</p>
		{/if}

		<button
			type="submit"
			disabled={enviando}
			class="w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
		>
			{enviando ? 'Entrando…' : 'Entrar'}
		</button>
		<a
			href={resolve('/')}
			class="block text-center text-xs text-neutral-400 hover:text-neutral-600"
		>
			← Voltar ao catálogo
		</a>
	</form>
</main>
