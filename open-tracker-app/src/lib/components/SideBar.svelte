<script lang="ts">
	import { page } from '$app/state';
	import { links } from '$lib/links';
	import { m } from '$lib/paraglide/messages';

	const currenLinkActive = $derived((pathname: string) => {
		const currentPath = page.url.pathname;
		return currentPath === pathname;
	});
</script>

<div
	class="w-full h-full flex flex-col gap-4 bg-neutral-900 text-white p-3 shadow-lg z-1"
>
	<h1 class="text-3xl font-bold text-amber-600">{m.app_name()}</h1>
	<p class="text-base text-white/50">{m.app_tagline()}</p>

	<div class="flex flex-col gap-2">
		{#each links as link}
			{@const Icon = link.icon}
			<a
				href={link.href}
				class:active={currenLinkActive(link.href)}
				class="hover:bg-white/10 hover:animate-pulse hover:text-amber-600 rounded-lg p-2 flex gap-3 items-center transition-colors duration-200"
				><Icon /> {link.title()}</a
			>
		{/each}
	</div>
</div>

<style>
	@reference "../../routes/layout.css";

	.active {
		@apply bg-white/10 text-amber-600;
	}
</style>
