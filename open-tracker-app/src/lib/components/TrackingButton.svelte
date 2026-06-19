<script lang="ts">
	import { GetTrackerState } from '$lib/services/tracker.service.svelte';

	const { startTracking, stopTracking } = $props();

	const trackerState = GetTrackerState();
	const isTracking = $derived<boolean>(trackerState.IsTracking());

	const ToggleTracking = async () => {
		if (isTracking) {
			await stopTracking();
		} else {
			await startTracking();
		}
	};
</script>

<button
	onclick={ToggleTracking}
	class="cursor-pointer {isTracking
		? 'bg-red-500 hover:bg-red-600'
		: 'bg-amber-700 hover:bg-amber-800'} flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-base font-semibold text-white transition-colors focus:outline-none focus:ring-2"
>
	{isTracking ? 'Stop Tracking' : 'Start Tracking'}
</button>
