<script lang="ts">
	import { client } from '$lib/database';
	import type { User, BookInLibrary, BooksList } from '$lib/types';
	import { onMount } from 'svelte';
	import { library as storeLibrary } from '$lib/store';
	import { variables } from './variables';

	export let user: User;
	let books: BooksList = {
		'to read': [],
		reading: [],
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
			'to read': [],
			reading: [],
			read: [],
			abandoned: []
		};
		for (const book of library) {
			const status = book.status as 'to read' | 'reading' | 'read' | 'abandoned';
			const bookData = await client.records.getOne('books', book.book_id);

			console.log(bookData.cover);
			const bookObj: BookInLibrary = {
				id: bookData.id,
				title: bookData.title,
				author: bookData.author,
				description: bookData.description,
				totalPages: bookData.total_pages,
				currentPage: book.current_page,
				status: status,
				cover: `${variables.pocketbaseURL}/api/files/books/${bookData.id}/${bookData.cover}`
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
</script>

<div class="library">
	{#each Object.entries(books) as [shelfName, shelf]}
		<h2>{shelfName}</h2>
		{#if shelf.length === 0}
			<p>No books here</p>
		{:else}
			{#each shelf as book}
				<div class="book">
					<h3>{book.title}</h3>
					<p>{book.author}</p>
					<p>{book.currentPage} / {book.totalPages}</p>
					<button
						on:click|preventDefault={() => {
							deleteBook(book);
						}}>remove</button
					>
					<img width="100" src={book.cover} alt={`${book.title} cover`} />
				</div>
			{/each}
		{/if}
	{/each}
</div>
