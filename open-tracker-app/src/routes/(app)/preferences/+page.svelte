<script lang="ts">
	import type { Preferences } from '$lib/types';
	import { DollarSign } from '@lucide/svelte';
	import { fly } from 'svelte/transition';

	const { data } = $props();
	const preferenes = $derived(data.preferences);

	let formData = $state<Preferences>({
		// svelte-ignore state_referenced_locally
		hourlyRate: preferenes.hourlyRate,
	});

	const HandleSubmit = (event: SubmitEvent) => {
		event.preventDefault();

		console.log('Form submitted:', formData);
	};
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<h1 class="text-3xl font-bold text-white">Preferences</h1>

	<div
		class="mt-6 max-w-2xl rounded-2xl border border-neutral-700 bg-neutral-700/30 p-6 shadow-lg shadow-black/10 backdrop-blur-sm"
	>
		<div class="border-b border-neutral-700 pb-4">
			<h2 class="text-lg font-semibold text-white">Billing settings</h2>
			<p class="mt-1 text-sm text-neutral-400">
				Set your default hourly rate used across the tracker.
			</p>
		</div>

		<form onsubmit={HandleSubmit} class="mt-6 space-y-6">
			<div class="space-y-2">
				<label
					for="hourlyRate"
					class="block text-sm font-medium text-neutral-200"
				>
					Hourly Rate
				</label>
				<div class="relative">
					<span
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-neutral-400"
					>
						<DollarSign class="size-4" />
					</span>
					<input
						type="number"
						id="hourlyRate"
						bind:value={formData.hourlyRate}
						min="0"
						step="0.01"
						placeholder="0.00"
						class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 pl-9 text-neutral-100 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30"
					/>
				</div>
				<p class="text-sm text-neutral-400">
					Use your standard rate so earnings can be calculated
					consistently.
				</p>
			</div>

			<div
				class="flex items-center justify-end gap-3 border-t border-neutral-700 pt-4"
			>
				<button
					type="submit"
					class="rounded-lg cursor-pointer bg-amber-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
				>
					Save Preferences
				</button>
			</div>
		</form>
	</div>
</div>
