export type TrackedTask = {
	id?: string;
	title: string;
	startTime: number;
	endTime?: number;
	projectId?: string;
};

export type Task = {
	id: string;
	title: string;
	startTime: number;
	endTime?: number;
	duration?: number;
	projectId?: string;
	project?: Project;
};

export type CreateTask = Omit<Task, 'id' | 'duration'>;
export type UpdateTask = Omit<Task, 'duration'>;

export type Project = {
	id: string;
	title: string;
	hourlyRate?: number;
	hexColor: string;
	clientId?: string;
	client?: Client;
};

export type CreateProject = Omit<Project, 'id'>;
export type UpdateProject = Project;

export type Client = {
	id: string;
	name: string;
	hourlyRate?: number;
	hexColor: string;
};

export type CreateClient = Omit<Client, 'id'>;
export type UpdateClient = Client;

export type Preferences = {
	hourlyRate: number;
};
