import { ClientService } from '$lib/services/client.service';
import { ProjectService } from '$lib/services/project.service';

export const load = async ({ depends, parent }) => {
	depends('app:projects');

	const { currentUser } = await parent();

	if (!currentUser) {
		return { projects: [] };
	}

	const projects = await ProjectService.GetProjects(currentUser.uid);
	const clients = await ClientService.GetClients(currentUser.uid);

	// Map client data to projects
	projects.forEach((project) => {
		if (project.clientId) {
			const client = clients.find((c) => c.id === project.clientId);

			if (client) {
				project.clientId = client.id;
				project.client = client;
			}
		}
	});

	return { projects, clients };
};
