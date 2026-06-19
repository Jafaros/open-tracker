<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { ProjectService } from '$lib/services/project.service';
	import type { Client } from '$lib/types';
	import ModalBase from './ModalBase.svelte';
	import { ChevronDown, CircleOff } from '@lucide/svelte';

	const { onClose, selectedProject, clients } = $props();

	let loaded = $state<boolean>(false);
	$effect(() => {
		selectedClient =
			clients.find((c: Client) => c.id === selectedProject.clientId) ||
			null;
		loaded = true;
	});

	let selectedClient = $state<Client | null>(null);
	const clientId = $derived<string>(selectedClient?.id || '');
	let clientDropdownOpen = $state<boolean>(false);

	const HandleCreate = async (event: SubmitEvent) => {
		event.preventDefault();

		await ProjectService.UpdateProject({
			id: selectedProject.id,
			title: selectedProject.title,
			hourlyRate: selectedProject.hourlyRate,
			hexColor: selectedProject.hexColor,
			clientId: clientId,
		});

		await invalidate('app:projects');

		onClose();
	};
</script>

{#if loaded}
	<ModalBase title="Update project" {onClose}>
		<form class="flex flex-col gap-5" onsubmit={HandleCreate}>
			<div class="space-y-2">
				<label
					for="title"
					class="block text-sm font-medium text-neutral-200"
					>Title <span class="text-amber-500">*</span></label
				>
				<input
					type="text"
					id="title"
					required
					bind:value={selectedProject.title}
					class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-neutral-100 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30"
				/>
			</div>

			<div class="space-y-2">
				<label
					for="hourlyRate"
					class="block text-sm font-medium text-neutral-200"
					>Hourly Rate</label
				>
				<input
					type="number"
					id="hourlyRate"
					required
					min="0"
					step="0.01"
					bind:value={selectedProject.hourlyRate}
					class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-neutral-100 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30"
				/>
			</div>

			<div class="space-y-2">
				<label
					for="hexColor"
					class="block text-sm font-medium text-neutral-200"
					>Color <span class="text-amber-500">*</span></label
				>
				<div
					class="flex items-center gap-3 rounded-xl border border-neutral-600 bg-neutral-700 px-3 py-2"
				>
					<input
						type="color"
						id="hexColor"
						required
						bind:value={selectedProject.hexColor}
						class="size-10 cursor-pointer rounded-lg border border-neutral-600 bg-neutral-800 p-1"
					/>
					<span class="font-mono text-sm text-neutral-300"
						>{selectedProject.hexColor}</span
					>
				</div>
			</div>

			<div class="relative space-y-2">
				<span class="block text-sm font-medium text-neutral-200"
					>Client</span
				>
				<button
					type="button"
					onclick={() => {
						clientDropdownOpen = !clientDropdownOpen;
					}}
					class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-left text-sm text-neutral-100 shadow-sm transition-colors hover:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-neutral-500/30"
				>
					<span>
						{#if selectedClient}
							<span style="color: {selectedClient.hexColor}"
								>{selectedClient.name}</span
							>
						{:else}
							<span class="text-neutral-400"
								>No client selected</span
							>
						{/if}
					</span>
					<ChevronDown class="size-4 text-neutral-400" />
				</button>

				{#if clientDropdownOpen}
					<div
						class="absolute top-full z-10 mt-2 flex max-h-64 w-full flex-col overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 p-2 text-white shadow-lg shadow-black/30"
					>
						{#each clients as client (client.id)}
							<button
								type="button"
								class="cursor-pointer rounded-lg px-4 py-2 text-left transition-colors hover:bg-neutral-800"
								style="color: {client.hexColor}"
								onclick={() => {
									selectedClient = client;
									clientDropdownOpen = false;
								}}
							>
								{client.name}
							</button>
						{/each}
						<hr class="border-neutral-500/50 my-2" />
						<button
							type="button"
							class="flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 text-white/50 transition-colors hover:bg-neutral-800"
							onclick={() => {
								selectedClient = null;
								clientDropdownOpen = false;
							}}
						>
							<CircleOff class="size-3" /> None
						</button>
					</div>
				{/if}
			</div>

			<div class="flex justify-end border-t border-neutral-700 pt-5">
				<button
					class="cursor-pointer rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
					type="submit"
				>
					Update
				</button>
			</div>
		</form>
	</ModalBase>
{/if}
