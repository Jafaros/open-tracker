import { auth } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const load = async () => {
	let authState = get(auth);
	if (!authState.initialized) {
		// Wait for initialization to complete
		await new Promise<void>((resolve) => {
			const unsubscribe = auth.subscribe((state) => {
				if (state.initialized) {
					unsubscribe();
					resolve();
				}
			});
		});
		authState = get(auth);
	}

	const currentUser = authState.user;
	if (!currentUser) {
		throw redirect(302, '/login');
	}

	return { currentUser };
};
