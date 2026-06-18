import { db } from '$lib/firebase';
import type { Client, CreateClient, UpdateClient } from '$lib/types';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
} from 'firebase/firestore';

export class ClientService {
	public static async GetClients(user_id: string): Promise<Client[]> {
		const clientsCollection = collection(db, 'users', user_id, 'clients');

		const snapshot = await getDocs(clientsCollection);

		const clients: Client[] = snapshot.docs.map((doc) => {
			return doc.data() as Client;
		});

		return clients;
	}

	public static async CreateClient(
		user_id: string,
		client_data: CreateClient,
	): Promise<Client> {
		const newClient: Client = {
			id: crypto.randomUUID(),
			name: client_data.name,
			hourlyRate: client_data.hourlyRate,
			hexColor: client_data.hexColor,
		};

		const clientRef = doc(
			collection(db, 'users', user_id, 'clients'),
			newClient.id,
		);

		await setDoc(clientRef, newClient);

		return await Promise.resolve(newClient);
	}

	public static async UpdateClient(
		user_id: string,
		client_data: UpdateClient,
	): Promise<Client> {
		const updatedClient: Client = {
			id: client_data.id,
			name: client_data.name || 'Existing Client Name',
			hourlyRate: client_data.hourlyRate || 0,
			hexColor: client_data.hexColor || '#FFFFFF',
		};

		const clientRef = doc(
			collection(db, 'users', user_id, 'clients'),
			updatedClient.id,
		);

		await setDoc(clientRef, updatedClient);

		return await Promise.resolve(updatedClient);
	}

	public static async DeleteClient(
		user_id: string,
		client_id: string,
	): Promise<void> {
		const clientRef = doc(
			collection(db, 'users', user_id, 'clients'),
			client_id,
		);

		await deleteDoc(clientRef);

		return await Promise.resolve();
	}
}
