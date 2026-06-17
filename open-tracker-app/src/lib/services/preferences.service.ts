import type { Preferences } from '$lib/types';

export class PreferencesService {
	public static async GetPreferences(userId: string): Promise<Preferences> {
		// Implementation for fetching preferences

		return {
			hourlyRate: 0,
		};
	}

	public static async SavePreferences(
		userId: string,
		preferences: Preferences,
	): Promise<void> {
		// Implementation for saving preferences
	}
}
