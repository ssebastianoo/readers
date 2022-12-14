<script lang="ts">
	import { client } from '$lib/database';
	import type { User, BookInLibrary, BooksList } from '$lib/utils';
	import { onMount } from 'svelte';
	import { library as storeLibrary } from '$lib/store';
	import BookCover from '$lib/BookCover.svelte';
	import { getCoverUrl } from '$lib/utils';

	export let user: User;
	let books: BooksList = {
		reading: [],
		'to read': [],
		read: [],
		abandoned: []
	};

	storeLibrary.subscribe((value) => {
		books = value;
	});

	onMount(async () => {
		const library = await client.records.getFullList('libraries', 200, {
			filter: `user_id='${user.id}'`
		});
		let books_: BooksList = {
			reading: [],
			'to read': [],
			read: [],
			abandoned: []
		};
		for (const book of library) {
			const status = book.status as 'to read' | 'reading' | 'read' | 'abandoned';
			const bookData = await client.records.getOne('books', book.book_id);

			const bookObj: BookInLibrary = {
				id: bookData.id,
				title: bookData.title,
				author: bookData.author,
				description: bookData.description,
				totalPages: bookData.total_pages,
				currentPage: book.current_page,
				status: status,
				cover: getCoverUrl(bookData)
			};

			books_[status].push(bookObj);
		}
		storeLibrary.set(books_);
	});

	async function deleteBook(book: BookInLibrary) {
		const data = await client.records.getList('libraries', 1, 1, {
			filter: `user_id='${user.id}' && book_id='${book.id}'`
		});
		if (data.items.length === 0) return;
		await client.records.delete('libraries', data.items[0].id);
		books[book.status] = books[book.status].filter((b) => b.id !== book.id);
		storeLibrary.set(books);
	}

	function getShelfName(shelfName: string) {
		switch (shelfName) {
			case 'reading':
				return "You're reading";
			case 'to read':
				return 'You want to read';
			case 'read':
				return 'You read';
			case 'abandoned':
				return 'You abandoned';
		}
	}
</script>

<div class="library">
	{#each Object.entries(books) as [shelfName, shelf]}
		<h2>{getShelfName(shelfName)}</h2>
		{#if shelf.length === 0}
			<p>No books here</p>
		{:else}
			<div class="shelf">
				{#each shelf as book}
					<BookCover {book} />
				{/each}
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.shelf {
		display: flex;
		gap: 15px;
	}
</style>
