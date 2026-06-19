<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { GetLanguages } from '$lib/language.js';
	import { m } from '$lib/paraglide/messages.js';
	import { Logout } from '$lib/services/auth.service';
	import { PreferencesService } from '$lib/services/preferences.service.js';
	import type { Preferences } from '$lib/types';
	import { DollarSign, LogOut } from '@lucide/svelte';
	import { fly } from 'svelte/transition';

	const { data } = $props();
	const preferenes = $derived(data.preferences);
	const user = $derived(data.currentUser);
	const languages = $state(GetLanguages());

	let formData = $state<Preferences>({
		// svelte-ignore state_referenced_locally
		hourlyRate: preferenes?.hourlyRate || 0,
		// svelte-ignore state_referenced_locally
		language: preferenes?.language || 'en',
	});

	const HandleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		await PreferencesService.SavePreferences(formData, {
			userId: user.uid,
		});
		await invalidate('app:preferences');
		await invalidate('app:root');
	};

	const HandleLogout = async () => {
		Logout();
		await goto('/login');
	};
</script>

<div in:fly={{ y: 20, duration: 200 }}>
	<h1 class="text-3xl font-bold text-white">{m.preferences_title()}</h1>

	<div
		class="mt-6 max-w-2xl rounded-2xl border border-neutral-700 bg-neutral-700/30 p-6 shadow-lg shadow-black/10 backdrop-blur-sm"
	>
		<div class="border-b border-neutral-700 pb-4">
			<h2 class="text-lg font-semibold text-white">
				{m.app_settings()}
			</h2>
			<p class="mt-1 text-sm text-neutral-400">
				{m.app_settings_description()}
			</p>
		</div>

		<form onsubmit={HandleSubmit} class="mt-6 space-y-6">
			<div class="space-y-2">
				<label
					for="hourlyRate"
					class="block text-sm font-medium text-neutral-200"
				>
					{m.hourly_rate()}
				</label>
				<div class="relative">
					<span
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-neutral-400"
					>
						<DollarSign class="size-4" />
					</span>
					<input
						type="number"
						id="hourlyRate"
						bind:value={formData.hourlyRate}
						min="0"
						step="0.01"
						placeholder="0.00"
						class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 pl-9 text-neutral-100 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30"
					/>
				</div>
				<p class="text-sm text-neutral-400">
					{m.hourly_rate_help()}
				</p>
			</div>

			<div class="space-y-2">
				<label
					for="hourlyRate"
					class="block text-sm font-medium text-neutral-200"
				>
					{m.language()}
				</label>
				<select
					bind:value={formData.language}
					class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-neutral-100 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30"
				>
					{#each languages as language}
						<option value={language.code}>{language.name}</option>
					{/each}
				</select>
				<p class="text-sm text-neutral-400">
					{m.language_help()}
				</p>
			</div>

			<div
				class="flex items-center justify-end gap-3 border-t border-neutral-700 pt-4"
			>
				<button
					type="submit"
					class="rounded-lg cursor-pointer bg-amber-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
				>
					{m.save_preferences()}
				</button>
			</div>
		</form>
	</div>

	<div
		class="flex items-center gap-4 bg-neutral-700/30 max-w-2xl rounded-2xl border border-neutral-700/50 p-6 shadow-lg shadow-black/10 backdrop-blur-sm mt-6"
	>
		<div
			class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10"
		>
			{#if user.photoURL}
				<img
					src={user.photoURL}
					alt={user.displayName}
					class="h-full w-full object-cover"
				/>
			{/if}
		</div>

		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-2">
				<h2 class="truncate text-lg font-semibold text-white">
					{user.displayName}
				</h2>
				<span
					class="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-neutral-300"
				>
					{m.active()}
				</span>
			</div>
			<p class="truncate text-sm text-neutral-400">{user.email}</p>
		</div>

		<button
			type="button"
			onclick={HandleLogout}
			class="bg-red-700 hover:bg-red-800 text-white py-2 px-4 text-sm rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold"
		>
			<LogOut strokeWidth="2.5" class="size-3.5" />
			{m.logout()}
		</button>
	</div>
</div>
