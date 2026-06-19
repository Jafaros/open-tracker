import type { Client, CreateClient, UpdateClient } from '$lib/types';
import { deleteDoc, getDocs, setDoc } from 'firebase/firestore';
import {
	UserCollectionRef,
	UserDocumentRef,
	type UserScopedServiceContext,
} from './firestore.service';

export class ClientService {
	public static async GetClients(
		context?: UserScopedServiceContext,
	): Promise<Client[]> {
		const clientsCollection = await UserCollectionRef<Client>(
			'clients',
			context,
		);

		const snapshot = await getDocs(clientsCollection);

		return snapshot.docs.map((doc) => {
			return doc.data() as Client;
		});
	}

	public static async CreateClient(
		client_data: CreateClient,
		context?: UserScopedServiceContext,
	): Promise<Client> {
		const newClient: Client = {
			id: crypto.randomUUID(),
			name: client_data.name,
			hourlyRate: client_data.hourlyRate,
			hexColor: client_data.hexColor,
		};

		const clientRef = await UserDocumentRef<Client>(
			'clients',
			newClient.id,
			context,
		);

		await setDoc(clientRef, newClient);

		return newClient;
	}

	public static async UpdateClient(
		client_data: UpdateClient,
		context?: UserScopedServiceContext,
	): Promise<Client> {
		const updatedClient: Client = {
			id: client_data.id,
			name: client_data.name,
			hourlyRate: client_data.hourlyRate,
			hexColor: client_data.hexColor,
		};

		const clientRef = await UserDocumentRef<Client>(
			'clients',
			updatedClient.id,
			context,
		);

		await setDoc(clientRef, updatedClient);

		return updatedClient;
	}

	public static async DeleteClient(
		client_id: string,
		context?: UserScopedServiceContext,
	): Promise<void> {
		const clientRef = await UserDocumentRef<Client>(
			'clients',
			client_id,
			context,
		);

		await deleteDoc(clientRef);
	}
}
