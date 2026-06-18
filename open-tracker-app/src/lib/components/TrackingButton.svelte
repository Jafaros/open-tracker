<script lang="ts">
	import { GetTrackerState } from '$lib/services/tracker.service.svelte';

	const trackerState = GetTrackerState();
	const isTracking = $derived<boolean>(trackerState.isTracking);

	const ToggleTracking = () => {
		if (trackerState.isTracking) {
			trackerState.StopTracking();
		} else {
			trackerState.StartTracking();
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
