<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { ProjectService } from '$lib/services/project.service';
	import type { Project } from '$lib/types';
	import { onMount } from 'svelte';
	import ModalBase from './ModalBase.svelte';
	import { ChevronDown, CircleOff } from '@lucide/svelte';
	import { TaskService } from '$lib/services/task.service';
	import { toDatetimeLocal } from '$lib/utils/date-utils';

	const { onClose, selectedTask } = $props();

	let projects = $state<Project[]>([]);

	let loaded = $state<boolean>(false);
	onMount(async () => {
		projects = await ProjectService.GetProjects();
		selectedProject =
			projects.find((p: Project) => p.id === selectedTask.projectId) ||
			null;
		loaded = true;
	});

	let selectedProject = $state<Project | null>(null);
	const projectId = $derived<string>(selectedProject?.id || '');
	let projectDropdownOpen = $state<boolean>(false);

	let startTime = $state<string>('');
	let endTime = $state<string>('');

	$effect(() => {
		startTime = toDatetimeLocal(selectedTask.startTime);
		endTime = toDatetimeLocal(selectedTask.endTime);
	});

	const HandleCreate = async (event: SubmitEvent) => {
		event.preventDefault();

		await TaskService.UpdateTask({
			id: selectedTask.id,
			title: selectedTask.title,
			startTime: new Date(startTime).getTime(),
			endTime: new Date(endTime).getTime(),
			projectId: projectId,
		});

		await invalidate('app:time-tracker');

		onClose();
	};
</script>

{#if loaded}
	<ModalBase title="Update task" {onClose}>
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
					bind:value={selectedTask.title}
					class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-neutral-100 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30"
				/>
			</div>

			<div class="relative space-y-2">
				<span class="block text-sm font-medium text-neutral-200"
					>Project</span
				>
				<button
					type="button"
					onclick={() => {
						projectDropdownOpen = !projectDropdownOpen;
					}}
					class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-left text-sm text-neutral-100 shadow-sm transition-colors hover:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-neutral-500/30"
				>
					<span>
						{#if selectedProject}
							<span style="color: {selectedProject.hexColor}"
								>{selectedProject.title}</span
							>
						{:else}
							<span class="text-neutral-400"
								>No project selected</span
							>
						{/if}
					</span>
					<ChevronDown class="size-4 text-neutral-400" />
				</button>

				{#if projectDropdownOpen}
					<div
						class="absolute top-full z-10 mt-2 flex max-h-64 w-full flex-col overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 p-2 text-white shadow-lg shadow-black/30"
					>
						{#each projects as project (project.id)}
							<button
								type="button"
								class="cursor-pointer rounded-lg px-4 py-2 text-left transition-colors hover:bg-neutral-800"
								style="color: {project.hexColor}"
								onclick={() => {
									selectedProject = project;
									projectDropdownOpen = false;
								}}
							>
								{project.title}
							</button>
						{/each}
						<hr class="border-neutral-500/50 my-2" />
						<button
							type="button"
							class="flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 text-white/50 transition-colors hover:bg-neutral-800"
							onclick={() => {
								selectedProject = null;
								projectDropdownOpen = false;
							}}
						>
							<CircleOff class="size-3" /> None
						</button>
					</div>
				{/if}
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				<div class="space-y-2">
					<label
						for="startTime"
						class="block text-sm font-medium text-neutral-200"
						>Start time <span class="text-amber-500">*</span></label
					>
					<input
						type="datetime-local"
						step="1"
						id="startTime"
						required
						bind:value={startTime}
						class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-neutral-100 shadow-sm outline-none transition-colors focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30"
					/>
				</div>
				<div class="space-y-2">
					<label
						for="endTime"
						class="block text-sm font-medium text-neutral-200"
						>End time <span class="text-amber-500">*</span></label
					>
					<input
						type="datetime-local"
						id="endTime"
						step="1"
						required
						bind:value={endTime}
						class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-neutral-100 shadow-sm outline-none transition-colors focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30"
					/>
				</div>
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
