import type { TrackedTask } from '$lib/types';
import { formatTime } from '$lib/utils/date-utils';
import { getContext, setContext } from 'svelte';

export class TrackerService {
	private taskName = $state<string | null>(null);
	private startTime = $state<number | null>(null);
	private endTime = $state<number | null>(null);
	public isTracking = $state(false);

	constructor() {
		// Initialize the tracker service
	}

	public async StartTracking(task_name?: string): Promise<void> {
		if (this.startTime !== null) {
			return;
		}

		this.taskName = task_name || 'Unnamed Task';
		this.startTime = Date.now();
		this.isTracking = true;

		// Create a new tracker document in Firestore
	}

	public async StopTracking(): Promise<void> {
		if (this.startTime === null) {
			return;
		}

		this.endTime = Date.now();
		this.isTracking = false;

		// Update the tracker document in Firestore with the end time
		console.log(
			`Tracking stopped. Duration: ${formatTime(this.endTime - this.startTime)}`,
		);

		// Reset the start and end times after stopping tracking
		this.ResetTracking();
	}

	public GetStart(): number | null {
		return this.startTime;
	}

	public async ResetTracking(): Promise<void> {
		this.taskName = null;
		this.startTime = null;
		this.endTime = null;
		this.isTracking = false;
	}

	public async GetTrackedTask(): Promise<TrackedTask | null> {
		if (this.startTime !== null) {
			return {
				title: this.taskName || 'Unnamed Task',
				startTime: this.startTime,
				endTime: this.endTime,
			};
		}

		return null;
	}
}

const KEY = Symbol('tracker-key');

export function SetTrackerState() {
	return setContext(KEY, new TrackerService());
}

export function GetTrackerState() {
	return getContext<ReturnType<typeof SetTrackerState>>(KEY);
}
