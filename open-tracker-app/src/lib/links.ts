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
import { m } from '$lib/paraglide/messages';

type Link = {
	title: () => string;
	href: string;
	icon: LucideIcon;
};

export const links: Link[] = [
	{
		title: m.nav_home,
		href: '/',
		icon: House,
	},
	{
		title: m.nav_time_tracker,
		href: '/time-tracker',
		icon: Timer,
	},
	{
		title: m.nav_dashboard,
		href: '/dashboard',
		icon: Grid2x2,
	},
	{
		title: m.nav_statistics,
		href: '/statistics',
		icon: ChartColumn,
	},
	{
		title: m.nav_projects,
		href: '/projects',
		icon: FolderBookmark,
	},
	{
		title: m.nav_clients,
		href: '/clients',
		icon: Users,
	},
	{
		title: m.nav_preferences,
		href: '/preferences',
		icon: Settings,
	},
];
