<script lang="ts">
	import { fly } from 'svelte/transition';

	const { data } = $props();
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<h1 class="text-3xl font-bold text-white">Home</h1>
	<p class="mt-4 text-white/50 max-w-2xl">
		Welcome to the Open Tracker app! This is a simple time tracking
		application built with SvelteKit. You can track your tasks, manage
		projects, and view your time logs. Use the navigation menu to explore
		different features of the app.
	</p>
</div>
