import type { CreateTask, Task, TrackedTask, UpdateTask } from '$lib/types';
import { deleteDoc, getDocs, setDoc } from '@firebase/firestore';
import {
	UserCollectionRef,
	UserDocumentRef,
	type UserScopedServiceContext,
} from './firestore.service';

export class TaskService {
	public static async GetTasks(
		context?: UserScopedServiceContext,
	): Promise<Task[]> {
		const tasksCollection = await UserCollectionRef<Task>(
			'tasks',
			context,
		);

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
		context?: UserScopedServiceContext,
	): Promise<TrackedTask | null> {
		const tasks = await this.GetTasks(context);

		const trackedTask = tasks.find((task) => task.endTime === undefined);

		if (!trackedTask) {
			return null;
		}

		return trackedTask as TrackedTask;
	}

	public static async CreateTask(
		task: CreateTask,
		context?: UserScopedServiceContext,
	): Promise<Task> {
		const newTask: Task = {
			id: crypto.randomUUID(),
			startTime: task.startTime,
			title: task.title,
			projectId: task.projectId,
		};

		const taskRef = await UserDocumentRef<Task>(
			'tasks',
			newTask.id,
			context,
		);

		await setDoc(taskRef, newTask);

		return newTask;
	}

	public static async UpdateTask(
		task: UpdateTask,
		context?: UserScopedServiceContext,
	): Promise<Task> {
		const updatedTask: Task = {
			id: task.id,
			title: task.title,
			startTime: task.startTime,
			endTime: task.endTime,
			projectId: task.projectId,
		};

		const taskRef = await UserDocumentRef<Task>(
			'tasks',
			updatedTask.id,
			context,
		);

		await setDoc(taskRef, updatedTask);
		return updatedTask;
	}

	public static async DeleteTask(
		task_id: string,
		context?: UserScopedServiceContext,
	): Promise<void> {
		const taskRef = await UserDocumentRef<Task>(
			'tasks',
			task_id,
			context,
		);

		await deleteDoc(taskRef);
	}
}
