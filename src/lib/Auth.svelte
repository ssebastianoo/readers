<script lang="ts">
	import { client } from '$lib/database';
	import type { User } from '$lib/utils';
	import { user as storeUser } from '$lib/store';
	import { onMount } from 'svelte';
	import { variables } from './utils';

	let user: null | User;
	let loaded: boolean = false;

	storeUser.subscribe((value) => {
		user = value;
	});

	client.authStore.onChange(async (token, model) => {
		if (model) {
			const userData = await client.records.getOne('users', model.id);
			storeUser.set({
				id: userData.id,
				name: userData.name,
				username: userData.username,
				email: userData.email,
				avatar: userData.avatar
					? `${variables.pocketbaseURL}/api/files/users/${userData.id}/${userData.avatar}`
					: '/default-avatar.webp'
			});
		} else {
			storeUser.set(null);
		}
	});

	onMount(async () => {
		if (!user) {
			const authUser = client.authStore.model;

			if (authUser) {
				const userData = await client.records.getOne('users', authUser.id);
				storeUser.set({
					id: userData.id,
					name: userData.name,
					username: userData.username,
					email: userData.email,
					avatar: userData.avatar
						? `${variables.pocketbaseURL}/api/files/users/${userData.id}/${userData.avatar}`
						: '/default-avatar.webp'
				});
			}
		}

		loaded = true;
	});
</script>

{#if loaded}
	{#if user}
		<img class="avatar" width="50" src={user.avatar} alt={`${user.name}'s avatar`} />
	{:else}
		<a href="/login">Login</a>
	{/if}
{:else}
	<p>Loading...</p>
{/if}

<style lang="scss">
	.avatar {
		border-radius: 50%;
	}
</style>
