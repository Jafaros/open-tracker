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
		: 'bg-amber-700 hover:bg-amber-800'} text-white rounded-lg px-6 py-3 transition-colors"
>
	{isTracking ? 'Stop Tracking' : 'Start Tracking'}
</button>
