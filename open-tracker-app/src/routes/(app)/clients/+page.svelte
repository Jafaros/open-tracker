<script lang="ts">
	import { invalidate } from '$app/navigation';
	import CreateClientModal from '$lib/components/modals/CreateClientModal.svelte';
	import UpdateClientModal from '$lib/components/modals/UpdateClientModal.svelte';
	import { ClientService } from '$lib/services/client.service.js';
	import type { Client } from '$lib/types.js';
	import { Plus, SquarePen, Trash } from '@lucide/svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	const { data } = $props();
	const clients = $derived(data.clients);

	let showCreateModal = $state<boolean>(false);
	const OnCloseCreateModal = () => {
		showCreateModal = false;
	};

	let showUpdateModal = $state<boolean>(false);
	let selectedClient = $state<Client | null>(null);
	const HandleEditClient = (client_id: string) => {
		showUpdateModal = true;
		selectedClient = clients.find((c) => c.id === client_id) || null;
	};

	const OnCloseUpdateModal = () => {
		showUpdateModal = false;
		selectedClient = null;
	};

	const HandleDeleteClient = async (client_id: string) => {
		await ClientService.DeleteClient(data.currentUser.uid, client_id);
		await invalidate('app:clients');
	};
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<div class="flex items-center justify-between gap-4">
		<h1 class="text-3xl font-bold text-white">Clients</h1>
		<button
			class="px-4 py-2 flex items-center gap-1 font-semibold bg-amber-700 text-white rounded transition-colors hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800"
			onclick={() => {
				showCreateModal = true;
			}}
		>
			<Plus /> New Client
		</button>
	</div>

	<div class="flex flex-col gap-4 mt-4">
		{#each clients as client (client.id)}
			<div
				animate:flip={{ duration: 200 }}
				class="p-4 bg-neutral-700 rounded-md text-white flex items-center gap-4 justify-between"
			>
				<div class="flex items-center justify-between gap-2">
					<h2
						class="text-xl font-semibold"
						style="color: {client.hexColor};"
					>
						{client.name}
					</h2>
					<span
						class="px-2 py-1 font-medium text-white rounded bg-neutral-800 text-sm"
						>{client.hourlyRate}/h</span
					>
				</div>
				<div class="flex items-center gap-2">
					<button
						class="flex items-center gap-1 hover:bg-black/50 p-2 rounded-md transition-colors"
						onclick={() => HandleEditClient(client.id)}
					>
						<SquarePen /> Edit
					</button>
					<button
						class="flex items-center gap-1 hover:bg-red-500/50 p-2 rounded-md transition-colors"
						onclick={() => HandleDeleteClient(client.id)}
					>
						<Trash /> Delete
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

{#if showCreateModal}
	<CreateClientModal onClose={OnCloseCreateModal} />
{/if}

{#if showUpdateModal && selectedClient}
	<UpdateClientModal client={selectedClient} onClose={OnCloseUpdateModal} />
{/if}
