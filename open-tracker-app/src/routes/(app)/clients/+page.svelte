<script lang="ts">
	import { invalidate } from '$app/navigation';
	import CreateClientModal from '$lib/components/modals/CreateClientModal.svelte';
	import UpdateClientModal from '$lib/components/modals/UpdateClientModal.svelte';
	import { m } from '$lib/paraglide/messages';
	import { ClientService } from '$lib/services/client.service.js';
	import type { Client } from '$lib/types.js';
	import {
		BadgeDollarSign,
		Building2,
		Plus,
		SquarePen,
		Trash,
		Users,
	} from '@lucide/svelte';
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
		if (!confirm(m.confirm_delete_client())) {
			return;
		}

		await ClientService.DeleteClient(client_id, {
			userId: data.currentUser.uid,
		});
		await invalidate('app:clients');
	};
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-white">{m.clients_title()}</h1>
			<p class="mt-1 text-sm text-neutral-400">
				{clients.length}
				{clients.length === 1
					? m.client_count_singular()
					: m.client_count_plural()}
			</p>
		</div>
		<button
			class="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
			onclick={() => {
				showCreateModal = true;
			}}
		>
			<Plus class="size-4" /> {m.new_client()}
		</button>
	</div>

	<div class="mt-6 flex flex-col gap-3">
		{#if clients.length > 0}
			{#each clients as client (client.id)}
				<div
					animate:flip={{ duration: 200 }}
					class="group flex items-center justify-between gap-4 rounded-2xl border border-neutral-700 bg-neutral-700/30 px-5 py-4 text-neutral-100 shadow-sm shadow-black/10 transition-colors hover:border-neutral-600 hover:bg-neutral-700/50 max-md:flex-col max-md:items-stretch"
				>
					<div class="flex min-w-0 items-center gap-4">
						<div
							class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-neutral-600 bg-neutral-800/70"
							style="color: {client.hexColor};"
						>
							<Building2 class="size-5" />
						</div>

						<div class="min-w-0">
							<h2
								class="truncate text-lg font-semibold text-white"
								title={client.name}
							>
								{client.name}
							</h2>
							<div
								class="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-300"
							>
								<span
									class="inline-flex items-center gap-1.5 rounded-full border border-neutral-600 bg-neutral-700/70 px-3 py-1"
								>
									<BadgeDollarSign
										class="size-3.5 text-neutral-400"
									/>
									<span class="font-medium text-neutral-100"
										>{client.hourlyRate ?? 0}/h</span
									>
								</span>
								<span
									class="inline-flex items-center gap-2 rounded-full border border-neutral-600 bg-neutral-700/70 px-3 py-1 text-neutral-400"
								>
									<span
										class="size-2.5 rounded-full"
										style="background-color: {client.hexColor};"
									></span>
									{client.hexColor}
								</span>
							</div>
						</div>
					</div>

					<div class="flex items-center justify-end gap-2">
						<button
							class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-600 hover:bg-neutral-700/60 hover:text-white"
							onclick={() => HandleEditClient(client.id)}
						>
							<SquarePen class="size-4" /> {m.edit()}
						</button>
						<button
							class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-200"
							onclick={() => HandleDeleteClient(client.id)}
						>
							<Trash class="size-4" /> {m.delete()}
						</button>
					</div>
				</div>
			{/each}
		{:else}
			<div
				class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-700 bg-neutral-700/20 px-6 py-12 text-center text-neutral-300"
			>
				<Users class="size-10 text-neutral-500" />
				<h2 class="mt-4 text-lg font-semibold text-white">
					{m.no_clients_yet()}
				</h2>
				<p class="mt-1 max-w-md text-sm text-neutral-400">
					{m.no_clients_description()}
				</p>
				<button
					class="mt-5 flex cursor-pointer items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
					onclick={() => {
						showCreateModal = true;
					}}
				>
					<Plus class="size-4" /> {m.new_client()}
				</button>
			</div>
		{/if}
	</div>
</div>

{#if showCreateModal}
	<CreateClientModal onClose={OnCloseCreateModal} />
{/if}

{#if showUpdateModal && selectedClient}
	<UpdateClientModal client={selectedClient} onClose={OnCloseUpdateModal} />
{/if}
