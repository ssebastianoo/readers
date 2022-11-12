<script lang="ts">
	import { client } from '$lib/database';
	import type { User } from 'pocketbase';
	import { onMount } from 'svelte';
	import { user as storeUser } from '$lib/store';

	async function registerUser(e: Event) {
		const target = e.target as HTMLFormElement;

		if (target.password.value !== target.confirmPassword.value) {
			alert('Passwords do not match');
			return;
		}

		let user: null | User;

		try {
			user = await client.users.create({
				email: target.email.value,
				password: target.password.value,
				passwordConfirm: target.confirmPassword.value
			});
		} catch (err: any) {
			if (err.data.data.email && err.data.data.email.code === 'validation_user_email_exists') {
				alert('User already exists');
			} else {
				alert('Something went wrong');
			}
			return;
		}

		if (user) {
			await client.records.create('users', {
				id: user.id,
				email: user.email,
				username: target.username.value,
				name: target.realName.value
			});
			const userData = await client.users.authViaEmail(user.email, target.password.value);
			storeUser.set({
				id: userData.id,
				name: userData.name,
				username: userData.username,
				email: userData.email
			});
		}
	}
</script>

<div class="register">
	<h2>register</h2>
	<form on:submit|preventDefault={registerUser}>
		<input name="realName" type="text" placeholder="name" required />
		<input name="username" type="text" placeholder="username" required />
		<input name="email" type="email" placeholder="email" required />
		<input name="password" type="password" placeholder="password" required />
		<input name="confirmPassword" type="password" placeholder="confirm password" required />
		<button type="submit">register</button>
	</form>
</div>
