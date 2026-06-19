import type { TrackedTask } from '$lib/types';
import { formatTime } from '$lib/utils/date-utils';
import { getContext, setContext } from 'svelte';
import { TaskService } from './task.service';
import { GetCurrentUser } from './auth.service';

export class TrackerService {
	private trackedTask = $state<TrackedTask | null>(null);

	constructor() {
		(async () => {
			const currentUser = await GetCurrentUser();

			if (!currentUser) {
				throw new Error('User not authenticated');
			}

			this.trackedTask = await TaskService.GetCurrentlyTrackedTask(
				currentUser.uid,
			);
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

		const currentUser = await GetCurrentUser();

		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		// Create a new tracker document in Firestore
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

		const currentUser = await GetCurrentUser();

		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		await TaskService.UpdateTask({
			id: this.trackedTask.id,
			...this.trackedTask,
			endTime: this.trackedTask.endTime,
		} as any);

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
