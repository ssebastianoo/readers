<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from '$lib/database';

	async function login(e: Event) {
		const target = e.target as HTMLFormElement;
		
		try {
			const authData = await client.users.authViaEmail(target.email.value, target.password.value);
			location.href = '/';
		} catch (err) {
			alert('Email or password is incorrect');
		}
	}
</script>

<div class="login">
	<form on:submit|preventDefault={login}>
		<input type="text" name="email" placeholder="email" required />
		<input type="password" name="password" placeholder="password" required />
		<button type="submit">login</button>
	</form>
</div>
