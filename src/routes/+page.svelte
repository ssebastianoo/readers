<script lang="ts">
	import AddBook from '$lib/AddBook.svelte';
	import Library from '$lib/Library.svelte';
	import type { User } from '$lib/types';
	import { user as storeUser } from '$lib/store';

	let user: User | null;
	storeUser.subscribe((value) => {
		user = value;
	});
</script>

{#if user}
	<AddBook />
	<Library {user} />
{/if}
