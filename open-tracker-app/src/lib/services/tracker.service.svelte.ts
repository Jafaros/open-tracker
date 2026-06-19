import type { TrackedTask } from '$lib/types';
import { formatTime } from '$lib/utils/date-utils';
import { getContext, setContext } from 'svelte';
import { TaskService } from './task.service';

export class TrackerService {
	private trackedTask = $state<TrackedTask | null>(null);

	constructor() {
		(async () => {
			this.trackedTask = await TaskService.GetCurrentlyTrackedTask();
		})();
	}

	public async StartTracking(
		title: string,
		projectId?: string | undefined,
	): Promise<void> {
		if (this.trackedTask !== null) {
			return;
		}

		this.trackedTask = {
			id: undefined,
			title: title || 'Unnamed Task',
			startTime: Date.now(),
			projectId: projectId,
		};

		this.trackedTask.id = (
			await TaskService.CreateTask(this.trackedTask)
		).id;
	}

	public async StopTracking(): Promise<void> {
		if (this.trackedTask === null) {
			return;
		}

		this.trackedTask.endTime = Date.now();

		// Update the tracker document in Firestore with the end time
		const duration = this.trackedTask.endTime - this.trackedTask.startTime;
		console.log(`Tracking stopped. Duration: ${formatTime(duration)}`);

		if (!this.trackedTask.id) {
			throw new Error('Tracked task has not been saved yet');
		}

		await TaskService.UpdateTask({
			id: this.trackedTask.id,
			...this.trackedTask,
			endTime: this.trackedTask.endTime,
		});

		// Reset the start and end times after stopping tracking
		this.ResetTracking();
	}

	public GetStart(): number | null {
		return this.trackedTask?.startTime || null;
	}

	public async ResetTracking(): Promise<void> {
		this.trackedTask = null;
	}

	public GetTrackedTask = $derived(() => {
		return this.trackedTask;
	});

	public IsTracking(): boolean {
		return this.trackedTask !== null;
	}
}

const KEY = Symbol('tracker-key');

export function SetTrackerState() {
	return setContext(KEY, new TrackerService());
}

export function GetTrackerState() {
	return getContext<ReturnType<typeof SetTrackerState>>(KEY);
}
