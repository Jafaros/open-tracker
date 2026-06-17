import { PreferencesService } from '$lib/services/preferences.service';

export const load = async () => {
	const preferences = await PreferencesService.GetPreferences('0');

	return {
		preferences,
	};
};
