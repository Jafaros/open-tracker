<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { ProjectService } from '$lib/services/project.service';
	import type { Project } from '$lib/types';
	import { onMount } from 'svelte';
	import ModalBase from './ModalBase.svelte';
	import { CircleOff } from '@lucide/svelte';
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
		<form class="flex flex-col gap-4" onsubmit={HandleCreate}>
			<div>
				<label
					for="title"
					class="block text-sm font-medium text-white mb-1"
					>Title <span class="text-red-500">*</span></label
				>
				<input
					type="text"
					id="title"
					required
					bind:value={selectedTask.title}
					class="w-full px-3 py-2 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
				/>
			</div>

			<div class="relative">
				<span class="block text-sm font-medium text-white mb-1"
					>Selected Project</span
				>
				<button
					type="button"
					onclick={() => {
						projectDropdownOpen = !projectDropdownOpen;
					}}
					class="cursor-pointer block text-sm font-medium text-white mb-1 bg-neutral-800 px-3 py-2 rounded-md hover:bg-neutral-900 transition-colors"
				>
					{#if selectedProject}
						<span style="color: {selectedProject.hexColor}"
							>{selectedProject.title}</span
						>
					{:else}
						Select Project
					{/if}
				</button>

				{#if projectDropdownOpen}
					<div
						class="absolute flex flex-col top-full z-10 mt-2 min-w-32 max-h-64 overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 p-2 text-white shadow-lg shadow-black/30"
					>
						{#each projects as project (project.id)}
							<button
								class="cursor-pointer px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
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
							class="cursor-pointer px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors text-white/50 flex items-center gap-1"
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

			<div class="flex flex-col gap-2">
				<div>
					<label
						for="startTime"
						class="block text-sm font-medium text-white mb-1"
						>Start time <span class="text-red-500">*</span></label
					>
					<input
						type="datetime-local"
						step="1"
						id="startTime"
						required
						bind:value={startTime}
						class="w-56 px-3 py-2 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
					/>
				</div>
				<div>
					<label
						for="endTime"
						class="block text-sm font-medium text-white mb-1"
						>End time <span class="text-red-500">*</span></label
					>
					<input
						type="datetime-local"
						id="endTime"
						step="1"
						required
						bind:value={endTime}
						class="w-56 px-3 py-2 bg-neutral-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
					/>
				</div>
			</div>

			<button
				class="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors"
				type="submit"
			>
				Update
			</button>
		</form>
	</ModalBase>
{/if}
