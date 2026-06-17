export type TrackedTask = {
	title: string;
	startTime: number;
	endTime: number | null;
};

export type Task = {
	id: string;
	title: string;
	startTime: number;
	endTime: number;
	duration: number;

	projectId?: string;
	project?: Project;
};

export type Project = {
	id: string;
	title: string;
	hourlyRate?: number;
	hexColor: string;
	tasks: Task[];

	clientId?: string;
	client?: Client;
};

export type Client = {
	id: string;
	name: string;
	hourlyRate?: number;
	hexColor: string;
	projects: Project[];
};

export type Preferences = {
	hourlyRate: number;
};
