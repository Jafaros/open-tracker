import { ProjectService } from '$lib/services/project.service';
import { TaskService } from '$lib/services/task.service';
import type { Task } from '$lib/types';

export const load = async ({ depends, parent }) => {
	depends('app:time-tracker');

	const { currentUser } = await parent();

	if (!currentUser) {
		return { projects: [] };
	}

	const serviceContext = { userId: currentUser.uid };
	const projects = await ProjectService.GetProjects(serviceContext);
	const tasks = await TaskService.GetTasks(serviceContext);

	tasks.forEach((task: Task) => {
		if (task.startTime && task.endTime) {
			task.duration = task.endTime - task.startTime;
		}

		task.project = projects.find(
			(project) => project.id === task.projectId,
		);
	});

	return {
		tasks: tasks.filter((task) => task.startTime && task.endTime),
		projects,
	};
};
