<script lang="ts">
	import { goto } from '$app/navigation';
	import { LoginWithGoogle } from '$lib/services/auth.service';

	const HandleGoogleLogin = async () => {
		const result = await LoginWithGoogle();

		if (result.user) {
			await goto('/');
		}
	};
</script>

<button class="" onclick={HandleGoogleLogin}> Login with Google </button>
