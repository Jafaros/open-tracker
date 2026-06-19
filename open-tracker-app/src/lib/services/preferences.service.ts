import { db } from '$lib/firebase';
import type { Preferences } from '$lib/types';
import { doc, getDoc, setDoc } from '@firebase/firestore';

export class PreferencesService {
	public static async GetPreferences(user_id: string): Promise<Preferences> {
		const preferenceRef = doc(
			db,
			'users',
			user_id,
			'preferences',
			'default',
		);

		const snapshot = await getDoc(preferenceRef);

		if (!snapshot.exists()) {
			return { hourlyRate: 0 };
		}

		return snapshot.data() as Preferences;
	}

	public static async SavePreferences(
		user_id: string,
		preferences: Preferences,
	): Promise<void> {
		const preferenceRef = doc(
			db,
			'users',
			user_id,
			'preferences',
			'default',
		);

		await setDoc(preferenceRef, preferences);
	}
}
