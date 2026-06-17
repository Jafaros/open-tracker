<script lang="ts">
	import TrackingRow from '$lib/components/TrackingRow.svelte';
	import { fly } from 'svelte/transition';
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<h1 class="text-3xl font-bold text-white">Home</h1>

	<div class="mt-4">
		<TrackingRow />
	</div>
</div>
