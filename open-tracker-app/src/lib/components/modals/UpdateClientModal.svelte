<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import { ClientService } from '$lib/services/client.service';
	import ModalBase from './ModalBase.svelte';

	const { client, onClose } = $props();

	const HandleCreate = async (event: SubmitEvent) => {
		event.preventDefault();

		await ClientService.UpdateClient({
			id: client.id,
			name: client.name,
			hourlyRate: client.hourlyRate,
			hexColor: client.hexColor,
		});

		await invalidate('app:clients');

		onClose();
	};
</script>

<ModalBase title={m.update_client()} {onClose}>
	<form class="flex flex-col gap-5" onsubmit={HandleCreate}>
		<div class="space-y-2">
			<label for="name" class="block text-sm font-medium text-neutral-200"
				>{m.name()} <span class="text-amber-500">{m.required_marker()}</span></label
			>
			<input
				type="text"
				id="name"
				required
				bind:value={client.name}
				class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-neutral-100 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30"
			/>
		</div>

		<div class="space-y-2">
			<label
				for="hourlyRate"
				class="block text-sm font-medium text-neutral-200"
				>{m.hourly_rate()}</label
			>
			<input
				type="number"
				id="hourlyRate"
				required
				min="0"
				step="0.01"
				bind:value={client.hourlyRate}
				class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-neutral-100 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30"
			/>
		</div>

		<div class="space-y-2">
			<label
				for="hexColor"
				class="block text-sm font-medium text-neutral-200"
				>{m.color()} <span class="text-amber-500">{m.required_marker()}</span></label
			>
			<div
				class="flex items-center gap-3 rounded-xl border border-neutral-600 bg-neutral-700 px-3 py-2"
			>
				<input
					type="color"
					id="hexColor"
					bind:value={client.hexColor}
					class="size-10 cursor-pointer rounded-lg border border-neutral-600 bg-neutral-800 p-1"
				/>
				<span class="font-mono text-sm text-neutral-300"
					>{client.hexColor}</span
				>
			</div>
		</div>

		<div class="flex justify-end border-t border-neutral-700 pt-5">
			<button
				class="cursor-pointer rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
				type="submit"
			>
				{m.update()}
			</button>
		</div>
	</form>
</ModalBase>
