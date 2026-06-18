import {
	ChartColumn,
	FolderBookmark,
	Grid2x2,
	House,
	Settings,
	Timer,
	Users,
	type LucideIcon,
} from '@lucide/svelte';

type Link = {
	title: string;
	href: string;
	icon: LucideIcon;
};

export const links: Link[] = [
	{
		title: 'Home',
		href: '/',
		icon: House,
	},
	{
		title: 'Time Tracker',
		href: '/time-tracker',
		icon: Timer,
	},
	{
		title: 'Dashboard',
		href: '/dashboard',
		icon: Grid2x2,
	},
	{
		title: 'Statistics',
		href: '/statistics',
		icon: ChartColumn,
	},
	{
		title: 'Projects',
		href: '/projects',
		icon: FolderBookmark,
	},
	{
		title: 'Clients',
		href: '/clients',
		icon: Users,
	},
	{
		title: 'Preferences',
		href: '/preferences',
		icon: Settings,
	},
];
