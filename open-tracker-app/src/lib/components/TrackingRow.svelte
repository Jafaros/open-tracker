<script lang="ts">
	import { GetTrackerState } from '$lib/services/tracker.service.svelte';
	import TrackingButton from './TrackingButton.svelte';
	import { formatTime } from '$lib/utils/date-utils';

	let taskName = $state<string>('');

	const trackerState = GetTrackerState();
	const isTracking = $derived<boolean>(trackerState.isTracking);

	const startTime = $derived<number | null>(trackerState.GetStart());
	let duration = $state<number | null>(null);

	$effect(() => {
		if (startTime !== null) {
			const interval = setInterval(() => {
				duration = Date.now() - startTime;
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}

		if (!isTracking) {
			duration = null;
		}
	});
</script>

<div class="flex w-full gap-2 item-stretch">
	<input
		type="text"
		disabled={isTracking}
		bind:value={taskName}
		placeholder="Enter task name..."
		class="flex-1 disabled:text-neutral-400 select-none rounded-lg px-4 py-2 text-neutral-200 placeholder:text-neutral-400 bg-neutral-600 border-neutral-500 ring:neutral-500 focus:ring-0 focus:outline-none"
	/>
	{#if isTracking && startTime && duration}
		<div
			class="flex items-center gap-2 w-32 justify-center text-white bg-neutral-600 rounded-lg px-4 py-2"
		>
			<span>{formatTime(duration)}</span>
		</div>
	{/if}
	<TrackingButton />
</div>
