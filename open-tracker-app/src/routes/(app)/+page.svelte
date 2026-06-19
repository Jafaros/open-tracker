<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { fly } from 'svelte/transition';

	const { data } = $props();
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<h1 class="text-3xl font-bold text-white">{m.home_title()}</h1>
	<p class="mt-4 text-white/50 max-w-2xl">
		{m.home_intro()}
	</p>
</div>
