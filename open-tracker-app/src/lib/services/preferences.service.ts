import type { Preferences } from '$lib/types';
import { getDoc, setDoc } from '@firebase/firestore';
import {
	UserDocumentRef,
	type UserScopedServiceContext,
} from './firestore.service';

export class PreferencesService {
	public static async GetPreferences(
		context?: UserScopedServiceContext,
	): Promise<Preferences> {
		const preferenceRef = await UserDocumentRef<Preferences>(
			'preferences',
			'default',
			context,
		);

		const snapshot = await getDoc(preferenceRef);

		if (!snapshot.exists()) {
			return { hourlyRate: 0 };
		}

		return snapshot.data() as Preferences;
	}

	public static async SavePreferences(
		preferences: Preferences,
		context?: UserScopedServiceContext,
	): Promise<void> {
		const preferenceRef = await UserDocumentRef<Preferences>(
			'preferences',
			'default',
			context,
		);

		await setDoc(preferenceRef, preferences);
	}
}
