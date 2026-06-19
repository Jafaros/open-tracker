<script lang="ts">
	import Row from '$lib/components/Row.svelte';
	import TrackingRow from '$lib/components/TrackingRow.svelte';
	import { m } from '$lib/paraglide/messages';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { fly } from 'svelte/transition';

	const { data } = $props();

	const pageSizeOptions = [10, 25, 50];
	let selectedPageSize = $state<number>(10);
	let currentPage = $state<number>(1);

	const totalTasks = $derived(data.tasks.length);
	const maxPages = $derived(
		Math.max(1, Math.ceil(totalTasks / selectedPageSize)),
	);
	const pageStart = $derived((currentPage - 1) * selectedPageSize);
	const pageEnd = $derived(pageStart + selectedPageSize);
	const visibleTasks = $derived(data.tasks.slice(pageStart, pageEnd));
	const firstVisibleTask = $derived(totalTasks === 0 ? 0 : pageStart + 1);
	const lastVisibleTask = $derived(Math.min(pageEnd, totalTasks));

	$effect(() => {
		if (currentPage > maxPages) {
			currentPage = maxPages;
		}
	});

	const GoToPreviousPage = () => {
		currentPage = Math.max(1, currentPage - 1);
	};

	const GoToNextPage = () => {
		currentPage = Math.min(maxPages, currentPage + 1);
	};

	const HandlePageSizeChange = () => {
		currentPage = 1;
	};
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<h1 class="text-3xl font-bold text-white">{m.time_tracker_title()}</h1>

	<div class="mt-4">
		<TrackingRow projects={data.projects} />
	</div>

	<div class="flex flex-col gap-2 mt-4">
		{#if visibleTasks.length > 0}
			{#each visibleTasks as task (`task-${task.id}`)}
				<Row {task} />
			{/each}
		{:else}
			<p class="text-white/50">{m.no_tracked_tasks_found()}</p>
		{/if}
	</div>

	<div
		class="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400"
	>
		<div>
			{m.items_per_page()}
			<select
				bind:value={selectedPageSize}
				onchange={HandlePageSizeChange}
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

		<div class="text-neutral-400">
			{m.showing_items({
				start: firstVisibleTask,
				end: lastVisibleTask,
				total: totalTasks,
			})}
		</div>
	</div>

	<div class="flex items-center mt-4">
		<button
			class="bg-neutral-700/30 text-neutral-200 border border-neutral-700/15 rounded-l px-4 py-2 transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-neutral-700/30"
			disabled={currentPage === 1}
			onclick={GoToPreviousPage}
			aria-label={m.previous_page()}
		>
			<ChevronLeft />
		</button>
		<div
			class="bg-neutral-700/30 text-neutral-200 border border-neutral-700/15 px-4 py-2"
		>
			{m.page_of_pages({ page: currentPage, maxPages })}
		</div>
		<button
			class="bg-neutral-700/30 text-neutral-200 border border-neutral-700/15 rounded-r px-4 py-2 transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-neutral-700/30"
			disabled={currentPage === maxPages}
			onclick={GoToNextPage}
			aria-label={m.next_page()}
		>
			<ChevronRight />
		</button>
	</div>
</div>
