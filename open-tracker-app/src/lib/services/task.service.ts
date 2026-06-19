import { db } from '$lib/firebase';
import type { CreateTask, Task, TrackedTask, UpdateTask } from '$lib/types';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
} from '@firebase/firestore';
import { GetCurrentUser } from './auth.service';

export class TaskService {
	public static async GetTasks(user_id: string): Promise<Task[]> {
		const tasksCollection = collection(db, 'users', user_id, 'tasks');

		const snapshot = await getDocs(tasksCollection);

		const tasks: Task[] = snapshot.docs.map((doc) => {
			return doc.data() as Task;
		});

		tasks.forEach((task) => {
			if (task.startTime && task.endTime) {
				task.duration = task.endTime - task.startTime;
			}
		});

		tasks.sort((a, b) => {
			if (a.startTime && b.startTime) {
				return b.startTime - a.startTime;
			}
			return 0;
		});

		return tasks;
	}

	public static async GetCurrentlyTrackedTask(
		user_id: string,
	): Promise<TrackedTask | null> {
		const tasks = await this.GetTasks(user_id);

		const trackedTask = tasks.find((task) => task.endTime === undefined);

		if (!trackedTask) {
			return null;
		}

		return trackedTask as TrackedTask;
	}

	public static async CreateTask(task: CreateTask): Promise<Task> {
		const currentUser = await GetCurrentUser();

		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const newTask: Task = {
			id: crypto.randomUUID(),
			startTime: Date.now(),
			title: task.title,
			projectId: task.projectId,
		};

		const taskRef = doc(
			collection(db, 'users', currentUser.uid, 'tasks'),
			newTask.id,
		);

		await setDoc(taskRef, newTask);

		return await Promise.resolve(newTask);
	}

	public static async UpdateTask(task: UpdateTask): Promise<Task> {
		const currentUser = await GetCurrentUser();

		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const updatedTask: Task = {
			id: task.id,
			title: task.title,
			startTime: task.startTime,
			endTime: task.endTime,
			projectId: task.projectId,
		};

		const taskRef = doc(
			collection(db, 'users', currentUser.uid, 'tasks'),
			updatedTask.id,
		);

		await setDoc(taskRef, updatedTask);
		return await Promise.resolve(updatedTask);
	}

	public static async DeleteTask(task_id: string): Promise<void> {
		const currentUser = await GetCurrentUser();

		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const taskRef = doc(
			collection(db, 'users', currentUser.uid, 'tasks'),
			task_id,
		);

		await deleteDoc(taskRef);

		return await Promise.resolve();
	}
}
