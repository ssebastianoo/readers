<script lang="ts">
	import { client } from '$lib/database';
	import { user as storeUser, bookCreated } from '$lib/store';
	import type { User } from '$lib/utils';
	import { getCoverUrl } from '$lib/utils';

	let user: User | null;

	storeUser.subscribe((value) => {
		user = value;
	});

	async function createBook(e: Event) {
		if (user) {
			const target = e.target as HTMLFormElement;
			const formData = new FormData();
			if (target.bookCover.files[0]) formData.append('cover', target.bookCover.files[0]);
			formData.append('title', target.bookTitle.value);
			formData.append('author', target.bookAuthor.value);
			formData.append('total_pages', target.bookPages.value);
			formData.append('description', target.bookDescription.value);
			formData.append('owner', user.id);
			const b = await client.records.create('books', formData);
			const data = await client.records.getOne('books', b.id);
			bookCreated.set({
				id: data.id,
				title: data.title,
				description: data.description,
				cover: getCoverUrl(data),
				author: data.author,
				totalPages: data.total_pages
			});
		} else {
			alert('you need to be logged in to create a book');
		}
	}
</script>

{#if user}
	<form class="create-book" on:submit|preventDefault={createBook}>
		<input type="text" name="bookTitle" placeholder="Title" required />
		<input type="text" name="bookAuthor" placeholder="Author" />
		<input type="number" name="bookPages" placeholder="Total pages" />
		<input type="file" name="bookCover" placeholder="Cover" />
		<textarea type="text" name="bookDescription" placeholder="Description" />
		<input type="submit" value="Create" />
	</form>
{/if}
