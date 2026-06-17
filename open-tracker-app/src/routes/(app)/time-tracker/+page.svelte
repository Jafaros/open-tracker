<script lang="ts">
	import Row from '$lib/components/Row.svelte';
	import TrackingRow from '$lib/components/TrackingRow.svelte';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { fly } from 'svelte/transition';

	const { data } = $props();

	const pageSizeOptions = [10, 25, 50];
	let selectedPageSize = $state<number>(10);
	let currentPage = $state<number>(1);
	const maxPages = $derived(5);
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<h1 class="text-3xl font-bold text-white">Time Tracker</h1>

	<div class="mt-4">
		<TrackingRow />
	</div>

	<div class="flex flex-col gap-2 mt-4">
		{#each data.tasks as task (`task-${task.id}`)}
			<Row {task} />
		{/each}
	</div>

	<div class="text-sm text-gray-400 mt-4">
		Items per page
		<select
			bind:value={selectedPageSize}
			class="ml-1 bg-neutral-700/30 text-neutral-200 border border-neutral-600/50 rounded focus:ring-neutral-600"
		>
			{#each pageSizeOptions as pageSize}
				<option
					value={pageSize}
					class="bg-neutral-700 text-neutral-200"
				>
					{pageSize}
				</option>
			{/each}
		</select>
	</div>
	<div class="flex items-center mt-4">
		<button
			class="bg-neutral-700/30 text-neutral-200 border border-neutral-700/15 rounded-l px-4 py-2 cursor-pointer hover:bg-neutral-700 transition-colors"
		>
			<ChevronLeft />
		</button>
		<div
			class="bg-neutral-700/30 text-neutral-200 border border-neutral-700/15 px-4 py-2"
		>
			{currentPage} of {maxPages}
		</div>
		<button
			class="bg-neutral-700/30 text-neutral-200 border border-neutral-700/15 rounded-r px-4 py-2 cursor-pointer hover:bg-neutral-700 transition-colors"
		>
			<ChevronRight />
		</button>
	</div>
</div>
