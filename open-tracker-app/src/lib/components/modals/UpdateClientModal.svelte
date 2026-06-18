<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { GetCurrentUser } from '$lib/services/auth.service';
	import { ClientService } from '$lib/services/client.service';
	import ModalBase from './ModalBase.svelte';

	const { client, onClose } = $props();

	const HandleCreate = async (event: SubmitEvent) => {
		event.preventDefault();

		const currentUser = await GetCurrentUser();

		if (!currentUser) {
			return;
		}

		await ClientService.UpdateClient(currentUser.uid, {
			id: client.id,
			name: client.name,
			hourlyRate: client.hourlyRate,
			hexColor: client.hexColor,
		});

		await invalidate('app:clients');

		onClose();
	};
</script>

<ModalBase title="Update client" {onClose}>
	<form class="flex flex-col gap-4" onsubmit={HandleCreate}>
		<div>
			<label for="name" class="block text-sm font-medium text-white mb-1"
				>Name <span class="text-red-500">*</span></label
			>
			<input
				type="text"
				id="name"
				required
				bind:value={client.name}
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
				bind:value={client.hourlyRate}
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
				bind:value={client.hexColor}
				class="w-full p-1 h-10 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
			/>
		</div>

		<button
			class="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors"
			type="submit"
		>
			Update
		</button>
	</form>
</ModalBase>
