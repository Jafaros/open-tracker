import type { SupportedLanguage } from '$lib/language';
import { setLocale } from '$lib/paraglide/runtime';
import { PreferencesService } from '$lib/services/preferences.service';
import { auth } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const load = async ({ depends }) => {
	depends('app:root');

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

	const preferences = await PreferencesService.GetPreferences({
		userId: currentUser.uid,
	});

	setLocale((preferences.language as SupportedLanguage) ?? 'en');

	return { currentUser };
};
