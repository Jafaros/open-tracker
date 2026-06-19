<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { ProjectService } from '$lib/services/project.service';
	import type { Client } from '$lib/types';
	import ModalBase from './ModalBase.svelte';
	import { CircleOff } from '@lucide/svelte';

	const { clients, onClose } = $props();

	let formData = $state({
		title: '',
		hourlyRate: undefined,
		hexColor: '#ffffff',
	});

	let selectedClient = $state<Client | null>(null);
	const clientId = $derived<string>(selectedClient?.id || '');
	let clientDropdownOpen = $state<boolean>(false);

	const HandleCreate = async (event: SubmitEvent) => {
		event.preventDefault();

		await ProjectService.CreateProject({
			title: formData.title,
			hourlyRate: formData.hourlyRate,
			hexColor: formData.hexColor,
			clientId: clientId,
		});

		await invalidate('app:projects');

		onClose();
	};
</script>

<ModalBase title="Create project" {onClose}>
	<form class="flex flex-col gap-4" onsubmit={HandleCreate}>
		<div>
			<label for="title" class="block text-sm font-medium text-white mb-1"
				>Title <span class="text-red-500">*</span></label
			>
			<input
				type="text"
				id="title"
				required
				bind:value={formData.title}
				class="w-full px-3 py-2 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
			/>
		</div>

		<div>
			<label
				for="hourlyRate"
				class="block text-sm font-medium text-white mb-1"
				>Hourly Rate</label
			>
			<input
				type="number"
				id="hourlyRate"
				required
				bind:value={formData.hourlyRate}
				class="w-full px-3 py-2 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
			/>
		</div>

		<div>
			<label
				for="hexColor"
				class="block text-sm font-medium text-white mb-1"
				>Hex Color <span class="text-red-500">*</span></label
			>
			<input
				type="color"
				id="hexColor"
				required
				bind:value={formData.hexColor}
				class="w-full p-1 h-10 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
			/>
		</div>

		<div class="relative">
			<span class="block text-sm font-medium text-white mb-1"
				>Selected Client</span
			>
			<button
				type="button"
				onclick={() => {
					clientDropdownOpen = !clientDropdownOpen;
				}}
				class="cursor-pointer block text-sm font-medium text-white mb-1 bg-neutral-800 px-3 py-2 rounded-md hover:bg-neutral-900 transition-colors"
			>
				{#if selectedClient}
					<span style="color: {selectedClient.hexColor}"
						>{selectedClient.name}</span
					>
				{:else}
					Select Client
				{/if}
			</button>

			{#if clientDropdownOpen}
				<div
					class="absolute flex flex-col top-full z-10 mt-2 min-w-32 max-h-64 overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 p-2 text-white shadow-lg shadow-black/30"
				>
					{#each clients as client (client.id)}
						<button
							class="cursor-pointer px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
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
						class="cursor-pointer px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors text-white/50 flex items-center gap-1"
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

		<button
			class="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors"
			type="submit"
		>
			Create
		</button>
	</form>
</ModalBase>
