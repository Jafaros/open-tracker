<script lang="ts">
	import { GetTrackerState } from '$lib/services/tracker.service.svelte';
	import TrackingButton from './TrackingButton.svelte';
	import { formatTime } from '$lib/utils/date-utils';
	import { Activity, CircleOff, Clock3, FolderOpen } from '@lucide/svelte';
	import type { Project } from '$lib/types';
	import { invalidate } from '$app/navigation';

	const trackerState = GetTrackerState();
	const isTracking = $derived<boolean>(trackerState.IsTracking());

	const startTime = $derived<number | null>(trackerState.GetStart());
	let duration = $state<number | null>(null);
	let taskName = $state<string>('');

	$effect(() => {
		if (startTime !== null) {
			const interval = setInterval(() => {
				duration = Date.now() - startTime;
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}

		if (!isTracking) {
			duration = null;
		}
	});

	$effect(() => {
		if (!isTracking) return;

		const currentTask = trackerState.GetTrackedTask();

		taskName = currentTask?.title ?? '';

		selectedProject =
			projects.find((p: Project) => p.id === currentTask?.projectId) ??
			null;
	});

	let projectsVisible = $state<boolean>(false);
	let selectedProject = $state<Project | null>(null);

	const projectId = $derived<string>(
		selectedProject ? selectedProject.id : '',
	);

	const { projects } = $props();

	const DisplayProjects = () => {
		projectsVisible = !projectsVisible;
	};

	const StartTracking = async () => {
		await trackerState.StartTracking(taskName, projectId);
	};

	const StopTracking = async () => {
		await trackerState.StopTracking();
		await invalidate('app:time-tracker');

		taskName = '';
		duration = null;
		selectedProject = null;
	};
</script>

<div
	class="group flex flex-col gap-4 rounded-2xl border border-neutral-700 bg-neutral-700/30 px-5 py-4 text-neutral-100 shadow-sm shadow-black/10 transition-colors hover:border-neutral-600 hover:bg-neutral-700/50"
>
	<div class="flex items-start justify-between gap-4 max-lg:flex-col">
		<div class="min-w-0 flex-1 space-y-3">
			<div>
				<input
					type="text"
					disabled={isTracking}
					bind:value={taskName}
					placeholder="What are you working on?"
					class="w-full rounded-xl border border-neutral-600 bg-neutral-700/70 px-4 py-3 text-base text-neutral-100 placeholder:text-neutral-500 ring-0 outline-none transition-colors focus:border-neutral-500 focus:bg-neutral-700 disabled:cursor-not-allowed disabled:border-neutral-700 disabled:bg-neutral-800/70 disabled:text-neutral-400"
				/>
			</div>

			<div
				class="flex flex-wrap items-center gap-2 text-sm text-neutral-300"
			>
				<div
					class="inline-flex items-center gap-2 rounded-full border px-3 py-1 {isTracking
						? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
						: 'border-neutral-600 bg-neutral-700/60 text-neutral-300'}"
				>
					<Activity class="size-3.5" />
					<span
						>{isTracking
							? 'Tracking in progress'
							: 'Ready to start'}</span
					>
				</div>

				{#if isTracking && startTime}
					<div
						class="inline-flex items-center gap-2 rounded-full border border-neutral-600 bg-neutral-700/60 px-3 py-1 text-neutral-300"
					>
						<Clock3 class="size-3.5 text-neutral-400" />
						<span>
							Started at
							{new Date(startTime).toLocaleTimeString([], {
								hour: 'numeric',
								minute: '2-digit',
							})}
						</span>
					</div>
				{/if}
			</div>
		</div>

		<div class="text-sm text-neutral-300 relative">
			<button
				disabled={isTracking}
				class="bg-neutral-600/60 w-64 rounded-md p-3 hover:bg-neutral-600/80 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
				onclick={DisplayProjects}
			>
				<span class="flex items-center text-left gap-2 shrink-0">
					<FolderOpen class="size-3.5 min-w-3.5" />
					{#if selectedProject}
						<span style="color: {selectedProject.hexColor}"
							>{selectedProject.title}</span
						>
					{:else}
						Select project
					{/if}
				</span>
			</button>

			{#if projectsVisible}
				<div
					class="absolute right-0 top-full z-10 mt-2 min-w-32 rounded-xl border border-neutral-700 bg-neutral-900 p-2 text-white shadow-lg shadow-black/30"
				>
					{#each projects as project}
						<!-- svelte-ignore node_invalid_placement_ssr -->
						<button
							class="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/10"
							style="color: {project.hexColor}"
							onclick={() => {
								selectedProject = project;
								projectsVisible = false;
							}}
						>
							{project.title}
						</button>
					{/each}
					<hr class="border-neutral-500/50 my-2" />
					<button
						class="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/10"
						onclick={() => {
							selectedProject = null;
							projectsVisible = false;
						}}
					>
						<CircleOff class="size-3" /> None
					</button>
				</div>
			{/if}
		</div>

		<div
			class="flex items-start gap-3 max-lg:w-full max-lg:justify-between max-sm:flex-col max-sm:items-stretch"
		>
			<div
				class="min-w-36 rounded-xl border border-neutral-600 bg-neutral-700/70 px-4 py-3 text-center max-sm:min-w-0"
			>
				<div
					class="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide text-neutral-400"
				>
					<Clock3 class="size-3.5" />
					<span>Duration</span>
				</div>
				<div class="mt-1 text-lg font-semibold text-white">
					{isTracking && duration ? formatTime(duration) : '00:00:00'}
				</div>
			</div>

			<div class="max-sm:w-full">
				<TrackingButton
					startTracking={StartTracking}
					stopTracking={StopTracking}
				/>
			</div>
		</div>
	</div>
</div>
