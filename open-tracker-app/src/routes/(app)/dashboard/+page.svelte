<script lang="ts">
	import { fly } from 'svelte/transition';
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<h1 class="text-3xl font-bold text-white">Dashboard</h1>
</div>
