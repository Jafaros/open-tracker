<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import {
		Login,
		LoginWithGoogle,
		Register,
	} from '$lib/services/auth.service';
	import { Lock, LogIn, Mail, TimerReset } from '@lucide/svelte';
	import { fly } from 'svelte/transition';

	let email = $state<string>('');
	let password = $state<string>('');
	let errorMessage = $state<string>('');
	let loading = $state<boolean>(false);
	let creatingAccount = $state<boolean>(false);

	const CompleteAuth = async () => {
		await goto('/');
	};

	const HandleEmailAuth = async (event: SubmitEvent) => {
		event.preventDefault();
		errorMessage = '';
		loading = true;

		try {
			const result = creatingAccount
				? await Register(email, password)
				: await Login(email, password);

			if (result.user) {
				await CompleteAuth();
			}
		} catch {
			errorMessage = m.auth_failed();
		} finally {
			loading = false;
		}
	};

	const HandleGoogleLogin = async () => {
		errorMessage = '';
		loading = true;

		try {
			const result = await LoginWithGoogle();

			if (result.user) {
				await CompleteAuth();
			}
		} catch {
			errorMessage = m.auth_failed();
		} finally {
			loading = false;
		}
	};

	const ToggleMode = () => {
		creatingAccount = !creatingAccount;
		errorMessage = '';
	};
</script>

<div
	class="flex min-h-screen items-center justify-center bg-neutral-800 px-4 py-8 text-neutral-100"
>
	<div class="w-full max-w-md" in:fly={{ y: 20, duration: 200 }}>
		<div class="mb-6 text-center">
			<div
				class="mx-auto flex size-14 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-700/50 text-amber-600 shadow-lg shadow-black/20"
			>
				<TimerReset class="size-7" />
			</div>
			<h1 class="mt-4 text-3xl font-bold text-white">{m.app_name()}</h1>
			<p class="mt-1 text-sm text-neutral-400">{m.app_tagline()}</p>
		</div>

		<div
			class="rounded-2xl border border-neutral-700 bg-neutral-700/30 p-6 shadow-2xl shadow-black/30"
		>
			<div class="border-b border-neutral-700 pb-5">
				<h2 class="text-xl font-semibold text-white">
					{creatingAccount ? m.register_title() : m.login_title()}
				</h2>
				<p class="mt-1 text-sm text-neutral-400">
					{creatingAccount
						? m.register_subtitle()
						: m.login_subtitle()}
				</p>
			</div>

			<form class="mt-5 space-y-5" onsubmit={HandleEmailAuth}>
				<div class="space-y-2">
					<label
						for="email"
						class="block text-sm font-medium text-neutral-200"
					>
						{m.email()}
					</label>
					<div class="relative">
						<span
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400"
						>
							<Mail class="size-4" />
						</span>
						<input
							id="email"
							type="email"
							autocomplete="email"
							placeholder={m.email()}
							required
							disabled={loading}
							bind:value={email}
							class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 pl-10 text-neutral-100 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30 disabled:cursor-not-allowed disabled:opacity-60"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label
						for="password"
						class="block text-sm font-medium text-neutral-200"
					>
						{m.password()}
					</label>
					<div class="relative">
						<span
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400"
						>
							<Lock class="size-4" />
						</span>
						<input
							id="password"
							type="password"
							autocomplete={creatingAccount
								? 'new-password'
								: 'current-password'}
							required
							placeholder={m.password()}
							disabled={loading}
							bind:value={password}
							class="block w-full rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 pl-10 text-neutral-100 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/30 disabled:cursor-not-allowed disabled:opacity-60"
						/>
					</div>
				</div>

				{#if errorMessage}
					<div
						class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
					>
						{errorMessage}
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="flex w-full cursor-pointer items-center justify-center rounded-lg bg-amber-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-700/40 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{creatingAccount ? m.create_account() : m.sign_in()}
				</button>
			</form>

			<div class="my-5 flex items-center gap-3 text-xs text-neutral-500">
				<div class="h-px flex-1 bg-neutral-700"></div>
				<span>{m.or_continue_with()}</span>
				<div class="h-px flex-1 bg-neutral-700"></div>
			</div>

			<button
				type="button"
				disabled={loading}
				onclick={HandleGoogleLogin}
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-600 bg-neutral-700/60 px-4 py-3 text-sm font-semibold text-neutral-100 transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500/30 disabled:cursor-not-allowed disabled:opacity-60"
			>
				<LogIn class="size-4" />
				{m.login_with_google()}
			</button>

			<div
				class="mt-5 flex justify-center border-t border-neutral-700 pt-5"
			>
				<button
					type="button"
					disabled={loading}
					onclick={ToggleMode}
					class="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
				>
					{creatingAccount
						? m.use_existing_account()
						: m.use_new_account()}
				</button>
			</div>
		</div>
	</div>
</div>
