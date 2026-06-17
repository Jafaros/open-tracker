<script lang="ts">
	import type { Task } from '$lib/types';
	import { formatTime } from '$lib/utils/date-utils';
	import { Clock3, EllipsisVertical, FolderOpen } from '@lucide/svelte';

	type Props = {
		task: Task;
	};

	const { task }: Props = $props();

	const startTime = $derived(() => {
		return new Date(task.startTime).toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit',
		});
	});

	const endTime = $derived(() => {
		return new Date(task.endTime).toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit',
		});
	});

	let optionsVisible = $state<boolean>(false);

	const options = [
		{ label: 'Edit', action: () => console.log('Edit clicked') },
		{ label: 'Delete', action: () => console.log('Delete clicked') },
	];

	const DisplayOptions = () => {
		optionsVisible = !optionsVisible;
	};
</script>

<div
	class="group flex flex-col gap-4 rounded-2xl border border-neutral-700 bg-neutral-700/30 px-5 py-4 text-neutral-100 shadow-sm shadow-black/10 transition-colors hover:border-neutral-600 hover:bg-neutral-700/50"
>
	<div class="flex items-start justify-between gap-4 max-md:flex-col">
		<div class="min-w-0 flex-1 space-y-2">
			<div
				class="truncate text-lg font-semibold text-white"
				title={task.title}
			>
				{task.title}
			</div>

			<div
				class="flex flex-wrap items-center gap-2 text-sm text-neutral-300"
			>
				{#if task.project}
					<div
						class="inline-flex items-center gap-2 rounded-full border border-neutral-600 bg-neutral-700/70 px-3 py-1"
					>
						<FolderOpen class="size-3.5 text-neutral-400" />
						<span
							class="font-medium"
							style="color: {task.project.hexColor};"
						>
							{task.project.title}
						</span>
						{#if task.project.client}
							<span class="text-neutral-500">•</span>
							<span class="text-neutral-300"
								>{task.project.client.name}</span
							>
						{/if}
					</div>
				{:else}
					<div
						class="inline-flex items-center gap-2 rounded-full border border-dashed border-neutral-600 bg-neutral-700/40 px-3 py-1 text-neutral-400"
					>
						<FolderOpen class="size-3.5" />
						<span>No project</span>
					</div>
				{/if}
			</div>
		</div>

		<div
			class="flex items-start gap-3 max-md:w-full max-md:justify-between"
		>
			<div class="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
				<div
					class="rounded-xl border border-neutral-600 bg-neutral-700/70 px-3 py-2 text-center"
				>
					<div
						class="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide text-neutral-400"
					>
						<Clock3 class="size-3.5" />
						<span>Time</span>
					</div>
					<div class="mt-1 text-sm font-medium text-neutral-100">
						{startTime()} - {endTime()}
					</div>
				</div>

				<div
					class="rounded-xl border border-neutral-600 bg-neutral-700/70 px-3 py-2 text-center"
				>
					<div
						class="text-xs uppercase tracking-wide text-neutral-400"
					>
						Duration
					</div>
					<div class="mt-1 text-sm font-semibold text-white">
						{formatTime(task.duration)}
					</div>
				</div>
			</div>

			<div class="relative">
				<button
					onclick={DisplayOptions}
					class="cursor-pointer rounded-xl border border-transparent p-2 text-neutral-300 transition-colors hover:border-neutral-600 hover:bg-neutral-700/60 hover:text-white"
					title="More options"
				>
					<EllipsisVertical class="size-4" />
					{#if optionsVisible}
						<div
							class="absolute right-0 top-full z-10 mt-2 min-w-32 rounded-xl border border-neutral-700 bg-neutral-900 p-2 text-white shadow-lg shadow-black/30"
						>
							{#each options as option}
								<!-- svelte-ignore node_invalid_placement_ssr -->
								<button
									class="block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/10"
									onclick={option.action}
								>
									{option.label}
								</button>
							{/each}
						</div>
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>
