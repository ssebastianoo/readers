<script lang="ts">
	import { client } from '$lib/database';
	import type { User } from '$lib/types';
	import { user as storeUser } from '$lib/store';
	import { onMount } from 'svelte';

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
				email: userData.email
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
					email: userData.email
				});
			}
		}

		loaded = true;
	});
</script>

{#if loaded}
	{#if user}
		<div class="nav-item">
			<p>{user.name}</p>
		</div>
		<div class="nav-item">
			<button on:click|preventDefault={() => client.authStore.clear()}>Logout</button>
		</div>
	{:else}
		<div class="nav-item">
			<a href="/login">Login</a>
		</div>
	{/if}
{:else}
	<p>Loading...</p>
{/if}

<style lang="scss">
	p {
		margin: 0;
	}
</style>
