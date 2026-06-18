<script lang="ts">
	import { X } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';

	const { title, onClose, children } = $props();
</script>

<div
	class="fixed inset-0 flex items-center justify-center bg-black/60 w-screen h-screen z-100"
	in:fade={{ duration: 200 }}
>
	<div
		class="bg-neutral-700 rounded-lg p-6 w-full max-w-md relative"
		transition:fly={{ y: 20, duration: 200 }}
	>
		<h2 class="text-2xl font-bold text-white mb-4">{title}</h2>

		<button
			onclick={onClose}
			class="absolute top-4 right-4 text-white hover:text-gray-300 cursor-pointer"
		>
			<X />
		</button>

		<div>
			{@render children()}
		</div>
	</div>
</div>
