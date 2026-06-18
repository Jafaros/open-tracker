import { PreferencesService } from '$lib/services/preferences.service';

export const load = async ({ depends, parent }) => {
	depends('app:preferences');

	const { currentUser } = await parent();

	if (!currentUser) {
		return { preferences: null };
	}

	const preferences = await PreferencesService.GetPreferences(
		currentUser.uid,
	);

	return {
		preferences,
	};
};
