<script lang="ts">
	import { invalidate } from '$app/navigation';
	import CreateProjectModal from '$lib/components/modals/CreateProjectModal.svelte';
	import UpdateProjectModal from '$lib/components/modals/UpdateProjectModal.svelte';
	import { ProjectService } from '$lib/services/project.service.js';
	import type { Project } from '$lib/types.js';
	import { Plus, SquarePen, Trash } from '@lucide/svelte';
	import { fly } from 'svelte/transition';

	const { data } = $props();
	const projects = $derived(data.projects);

	let showCreateModal = $state<boolean>(false);

	let showUpdateModal = $state<boolean>(false);
	let selectedProject = $state<Project | null>(null);
	const HandleEditProject = (project_id: string) => {
		showUpdateModal = true;
		selectedProject = projects.find((p) => p.id === project_id) || null;
	};

	const OnCloseUpdateModal = () => {
		showUpdateModal = false;
		selectedProject = null;
	};

	const HandleDeleteProject = async (project_id: string) => {
		if (!confirm('Are you sure you want to delete this project?')) {
			return;
		}

		await ProjectService.DeleteProject(data.currentUser.uid, project_id);
		await invalidate('app:projects');
	};
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<div class="flex items-center justify-between gap-4">
		<h1 class="text-3xl font-bold text-white">Projects</h1>
		<button
			class="px-4 py-2 flex items-center gap-1 font-semibold bg-amber-700 text-white rounded transition-colors hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800"
			onclick={() => {
				showCreateModal = true;
			}}
		>
			<Plus /> New Project
		</button>
	</div>

	<div class="flex flex-col gap-4 mt-6">
		{#if projects.length > 0}
			{#each projects as project (project.id)}
				<div
					class="p-4 bg-neutral-700 rounded-md text-white flex items-center gap-4 justify-between"
				>
					<div class="flex items-center justify-between gap-2">
						<h2
							class="text-lg font-semibold flex items-center gap-2"
							style="color: {project.hexColor}"
						>
							{project.title}

							{#if project.clientId}
								<span class="text-sm font-light text-white/50">
									({project.client?.name})
								</span>
							{/if}
						</h2>
						<span
							class="px-2 py-1 font-medium text-white rounded bg-neutral-800 text-sm"
							>{project.hourlyRate}/h</span
						>
					</div>
					<div class="flex items-center gap-2">
						<button
							class="flex items-center gap-1 hover:bg-black/50 p-2 rounded-md transition-colors"
							onclick={() => HandleEditProject(project.id)}
						>
							<SquarePen /> Edit
						</button>
						<button
							class="flex items-center gap-1 hover:bg-red-500/50 p-2 rounded-md transition-colors"
							onclick={() => HandleDeleteProject(project.id)}
						>
							<Trash /> Delete
						</button>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-white/50">
				No projects found. Create a new project to get started.
			</p>
		{/if}
	</div>
</div>

{#if showCreateModal}
	<CreateProjectModal
		clients={data.clients}
		onClose={() => {
			showCreateModal = false;
		}}
	/>
{/if}

{#if showUpdateModal}
	<UpdateProjectModal
		clients={data.clients}
		onClose={OnCloseUpdateModal}
		{selectedProject}
	/>
{/if}
