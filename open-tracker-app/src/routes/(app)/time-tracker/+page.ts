import type { Task } from '$lib/types';

export const load = async ({ fetch }) => {
	const tasks: Task[] = [
		{
			id: '1',
			title: 'Task 1',
			startTime: new Date('2024-06-01T09:00:00').getTime(),
			endTime: new Date('2024-06-01T10:00:00').getTime(),
			duration: 3600000,
			project: {
				id: '1',
				title: 'Project 1',
				hexColor: '#6ffc03',
				hourlyRate: 300,
				tasks: [],
				client: {
					id: '1',
					name: 'Client 1',
					hexColor: '#00ff00',
					hourlyRate: 300,
					projects: [],
				},
			},
		},
		{
			id: '2',
			title: 'Task 2',
			startTime: new Date('2024-06-01T11:00:00').getTime(),
			endTime: new Date('2024-06-01T12:00:00').getTime(),
			duration: 3600000,
		},
		{
			id: '3',
			title: 'Task 3',
			startTime: new Date('2024-06-01T13:00:00').getTime(),
			endTime: new Date('2024-06-01T14:00:00').getTime(),
			duration: 3600000,
		},
	];

	return {
		tasks,
	};
};
