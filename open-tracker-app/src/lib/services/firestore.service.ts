import { db } from '$lib/firebase';
import { collection, doc } from 'firebase/firestore';
import type { CollectionReference, DocumentReference } from 'firebase/firestore';
import { GetCurrentUser } from './auth.service';

export type UserScopedServiceContext = {
	userId?: string;
};

type UserCollection = 'clients' | 'preferences' | 'projects' | 'tasks';

export async function ResolveUserId(
	context: UserScopedServiceContext = {},
): Promise<string> {
	if (context.userId) {
		return context.userId;
	}

	const currentUser = await GetCurrentUser();

	if (!currentUser) {
		throw new Error('User not authenticated');
	}

	return currentUser.uid;
}

export async function UserCollectionRef<T>(
	collectionName: UserCollection,
	context?: UserScopedServiceContext,
): Promise<CollectionReference<T>> {
	const userId = await ResolveUserId(context);
	return collection(
		db,
		'users',
		userId,
		collectionName,
	) as CollectionReference<T>;
}

export async function UserDocumentRef<T>(
	collectionName: UserCollection,
	documentId: string,
	context?: UserScopedServiceContext,
): Promise<DocumentReference<T>> {
	const collectionRef = await UserCollectionRef<T>(collectionName, context);
	return doc(collectionRef, documentId) as DocumentReference<T>;
}
