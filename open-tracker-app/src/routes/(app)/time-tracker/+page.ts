import { ProjectService } from '$lib/services/project.service';
import type { Task } from '$lib/types';

export const load = async ({ depends, parent }) => {
	depends('app:time-tracker');

	const { currentUser } = await parent();

	if (!currentUser) {
		return { projects: [] };
	}

	const projects = await ProjectService.GetProjects(currentUser.uid);

	const tasks: Task[] = [];

	return {
		tasks,
		projects,
	};
};
