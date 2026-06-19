import { ClientService } from '$lib/services/client.service';

export const load = async ({ depends, parent }) => {
	depends('app:clients');

	const { currentUser } = await parent();

	if (!currentUser) {
		return { clients: [] };
	}

	const clients = await ClientService.GetClients({
		userId: currentUser.uid,
	});
	return { clients };
};
