<script lang="ts">
	import { invalidate } from '$app/navigation';
	import CreateProjectModal from '$lib/components/modals/CreateProjectModal.svelte';
	import UpdateProjectModal from '$lib/components/modals/UpdateProjectModal.svelte';
	import { ProjectService } from '$lib/services/project.service.js';
	import type { Project } from '$lib/types.js';
	import {
		BadgeDollarSign,
		Building2,
		CircleOff,
		FolderOpen,
		Plus,
		SquarePen,
		Trash,
	} from '@lucide/svelte';
	import { flip } from 'svelte/animate';
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

		await ProjectService.DeleteProject(project_id, {
			userId: data.currentUser.uid,
		});
		await invalidate('app:projects');
	};
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-white">Projects</h1>
			<p class="mt-1 text-sm text-neutral-400">
				{projects.length}
				{projects.length === 1 ? 'project' : 'projects'}
			</p>
		</div>
		<button
			class="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
			onclick={() => {
				showCreateModal = true;
			}}
		>
			<Plus class="size-4" /> New Project
		</button>
	</div>

	<div class="mt-6 flex flex-col gap-3">
		{#if projects.length > 0}
			{#each projects as project (project.id)}
				<div
					animate:flip={{ duration: 200 }}
					class="group flex items-center justify-between gap-4 rounded-2xl border border-neutral-700 bg-neutral-700/30 px-5 py-4 text-neutral-100 shadow-sm shadow-black/10 transition-colors hover:border-neutral-600 hover:bg-neutral-700/50 max-md:flex-col max-md:items-stretch"
				>
					<div class="flex min-w-0 items-center gap-4">
						<div
							class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-neutral-600 bg-neutral-800/70"
							style="color: {project.hexColor};"
						>
							<FolderOpen class="size-5" />
						</div>

						<div class="min-w-0">
							<h2
								class="truncate text-lg font-semibold text-white"
								title={project.title}
							>
								{project.title}
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
										>{project.hourlyRate ?? 0}/h</span
									>
								</span>
								{#if project.client}
									<span
										class="inline-flex items-center gap-1.5 rounded-full border border-neutral-600 bg-neutral-700/70 px-3 py-1"
									>
										<Building2
											class="size-3.5 text-neutral-400"
										/>
										<span
											class="font-medium"
											style="color: {project.client
												.hexColor};"
										>
											{project.client.name}
										</span>
									</span>
								{:else}
									<span
										class="inline-flex items-center gap-1.5 rounded-full border border-dashed border-neutral-600 bg-neutral-700/40 px-3 py-1 text-neutral-400"
									>
										<CircleOff class="size-3.5" />
										No client
									</span>
								{/if}
								<span
									class="inline-flex items-center gap-2 rounded-full border border-neutral-600 bg-neutral-700/70 px-3 py-1 text-neutral-400"
								>
									<span
										class="size-2.5 rounded-full"
										style="background-color: {project.hexColor};"
									></span>
									{project.hexColor}
								</span>
							</div>
						</div>
					</div>

					<div class="flex items-center justify-end gap-2">
						<button
							class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-600 hover:bg-neutral-700/60 hover:text-white"
							onclick={() => HandleEditProject(project.id)}
						>
							<SquarePen class="size-4" /> Edit
						</button>
						<button
							class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-200"
							onclick={() => HandleDeleteProject(project.id)}
						>
							<Trash class="size-4" /> Delete
						</button>
					</div>
				</div>
			{/each}
		{:else}
			<div
				class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-700 bg-neutral-700/20 px-6 py-12 text-center text-neutral-300"
			>
				<FolderOpen class="size-10 text-neutral-500" />
				<h2 class="mt-4 text-lg font-semibold text-white">
					No projects yet
				</h2>
				<p class="mt-1 max-w-md text-sm text-neutral-400">
					Create a project to organize tracked work by client and
					rate.
				</p>
				<button
					class="mt-5 flex cursor-pointer items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
					onclick={() => {
						showCreateModal = true;
					}}
				>
					<Plus class="size-4" /> New Project
				</button>
			</div>
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
	{#if selectedProject}
		<UpdateProjectModal
			clients={data.clients}
			onClose={OnCloseUpdateModal}
			{selectedProject}
		/>
	{/if}
{/if}
