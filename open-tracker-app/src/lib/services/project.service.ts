import type { CreateProject, Project, UpdateProject } from '$lib/types';
import { deleteDoc, getDocs, setDoc } from '@firebase/firestore';
import {
	UserCollectionRef,
	UserDocumentRef,
	type UserScopedServiceContext,
} from './firestore.service';

export class ProjectService {
	public static async GetProjects(
		context?: UserScopedServiceContext,
	): Promise<Project[]> {
		const projectsCollection = await UserCollectionRef<Project>(
			'projects',
			context,
		);

		const snapshot = await getDocs(projectsCollection);

		return snapshot.docs.map((doc) => {
			return doc.data() as Project;
		});
	}

	public static async CreateProject(
		project_data: CreateProject,
		context?: UserScopedServiceContext,
	): Promise<Project> {
		const newProject: Project = {
			id: crypto.randomUUID(),
			title: project_data.title,
			hourlyRate: project_data.hourlyRate,
			hexColor: project_data.hexColor,
			clientId: project_data.clientId,
		};

		const projectRef = await UserDocumentRef<Project>(
			'projects',
			newProject.id,
			context,
		);

		await setDoc(projectRef, newProject);

		return newProject;
	}

	public static async UpdateProject(
		project_data: UpdateProject,
		context?: UserScopedServiceContext,
	): Promise<Project> {
		const updatedProject: Project = {
			id: project_data.id,
			title: project_data.title,
			hourlyRate: project_data.hourlyRate,
			hexColor: project_data.hexColor,
			clientId: project_data.clientId,
		};

		const projectRef = await UserDocumentRef<Project>(
			'projects',
			updatedProject.id,
			context,
		);

		await setDoc(projectRef, updatedProject);

		return updatedProject;
	}

	public static async DeleteProject(
		project_id: string,
		context?: UserScopedServiceContext,
	): Promise<void> {
		const projectRef = await UserDocumentRef<Project>(
			'projects',
			project_id,
			context,
		);

		await deleteDoc(projectRef);
	}

	public static async GetProject(
		project_id: string,
		context?: UserScopedServiceContext,
	): Promise<Project> {
		const projects = await this.GetProjects(context);

		const project = projects.find((p) => p.id === project_id);

		if (!project) {
			throw new Error(`Project with ID ${project_id} not found`);
		}

		return project;
	}
}
