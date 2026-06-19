import { db } from '$lib/firebase';
import type { CreateProject, Project, UpdateProject } from '$lib/types';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
} from '@firebase/firestore';
import { GetCurrentUser } from './auth.service';

export class ProjectService {
	public static async GetProjects(): Promise<Project[]> {
		const currentUser = await GetCurrentUser();

		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const projectsCollection = collection(
			db,
			'users',
			currentUser.uid,
			'projects',
		);

		const snapshot = await getDocs(projectsCollection);

		const projects: Project[] = snapshot.docs.map((doc) => {
			return doc.data() as Project;
		});

		return projects;
	}

	public static async GetProjectsForUser(
		user_id: string,
	): Promise<Project[]> {
		const projectsCollection = collection(db, 'users', user_id, 'projects');

		const snapshot = await getDocs(projectsCollection);

		const projects: Project[] = snapshot.docs.map((doc) => {
			return doc.data() as Project;
		});

		return projects;
	}

	public static async CreateProject(
		user_id: string,
		project_data: CreateProject,
	): Promise<Project> {
		// Implementation for creating a new project
		const newProject: Project = {
			id: crypto.randomUUID(),
			title: project_data.title,
			hourlyRate: project_data.hourlyRate,
			hexColor: project_data.hexColor,
			clientId: project_data.clientId,
		};

		const projectRef = doc(
			collection(db, 'users', user_id, 'projects'),
			newProject.id,
		);

		await setDoc(projectRef, newProject);

		return await Promise.resolve(newProject);
	}

	public static async UpdateProject(
		user_id: string,
		project_data: UpdateProject,
	): Promise<Project> {
		// Implementation for updating an existing project
		// In a real implementation, you would fetch the existing project from a database, update its properties, and save it back to the database
		const updatedProject: Project = {
			id: project_data.id,
			title: project_data.title || 'Existing Project Title',
			hourlyRate: project_data.hourlyRate || 0,
			hexColor: project_data.hexColor || '#FFFFFF',
			clientId: project_data.clientId,
		};

		const projectRef = doc(
			collection(db, 'users', user_id, 'projects'),
			updatedProject.id,
		);

		await setDoc(projectRef, updatedProject);

		return await Promise.resolve(updatedProject);
	}

	public static async DeleteProject(
		user_id: string,
		project_id: string,
	): Promise<void> {
		const projectRef = doc(
			collection(db, 'users', user_id, 'projects'),
			project_id,
		);

		await deleteDoc(projectRef);

		return await Promise.resolve();
	}

	public static async GetProject(project_id: string): Promise<Project> {
		const currentUser = await GetCurrentUser();

		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		const projects = await this.GetProjects();

		const project = projects.find((p) => p.id === project_id);

		if (!project) {
			throw new Error(`Project with ID ${project_id} not found`);
		}

		return project;
	}
}
