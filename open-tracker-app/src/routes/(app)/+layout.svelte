<script lang="ts">
	import SideBar from '$lib/components/SideBar.svelte';
	import { SetTrackerState } from '$lib/services/tracker.service.svelte.js';

	const { children, data } = $props();

	SetTrackerState();
</script>

<div class="flex h-screen">
	<div class="w-74 h-full">
		<SideBar />
	</div>

	<main class="w-full bg-neutral-800 z-0 p-8 overflow-y-auto">
		{@render children()}
	</main>
</div>
