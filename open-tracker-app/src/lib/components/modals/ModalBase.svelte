<script lang="ts">
	import { X } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';

	const { title, onClose, children } = $props();
</script>

<div
	class="fixed inset-0 z-100 flex h-screen w-screen items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
	in:fade={{ duration: 200 }}
>
	<div
		class="relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-800 text-neutral-100 shadow-2xl shadow-black/40 ring-1 ring-white/5"
		transition:fly={{ y: 20, duration: 200 }}
	>
		<div
			class="flex items-center justify-between gap-4 border-b border-neutral-700 bg-neutral-700/30 px-6 py-5"
		>
			<div>
				<h2 class="text-xl font-semibold text-white">{title}</h2>
			</div>

			<button
				onclick={onClose}
				class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent text-neutral-400 transition-colors hover:border-neutral-600 hover:bg-neutral-700 hover:text-white"
				aria-label="Close modal"
			>
				<X class="size-4" />
			</button>
		</div>

		<div class="overflow-y-auto px-6 py-5">
			{@render children()}
		</div>
	</div>
</div>
