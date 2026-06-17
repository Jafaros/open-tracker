<script lang="ts">
	import './layout.css';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.png" />
</svelte:head>

{@render children()}
