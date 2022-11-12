<script lang="ts">
	import { client } from '$lib/database';
	import { variables } from './variables';
	import { user as storeUser, library as storeLibrary } from '$lib/store';
	import type { Book, User, BooksList, BookInLibrary } from '$lib/types';

	let user: null | User;
	let library: BooksList = {
		'to read': [],
		reading: [],
		read: [],
		abandoned: []
	};

	storeUser.subscribe((value) => {
		user = value;
	});

	storeLibrary.subscribe((value) => {
		library = value;
	});

	let results: Book[] = [];
	let lastUpdated = new Date();
	let selectedBook: null | Book = null;
	// let selectedBook: any = 'dksoakdjdiah';

	async function searchBook(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value.length < 2) {
			results = [];
			return;
		}

		const date = new Date();
		lastUpdated = date;
		setTimeout(async () => {
			if (lastUpdated === date) {
				const books = await client.records.getFullList('books', 200, {
					filter: `title~'${target.value}'`
				});
				results = books.map((book) => {
					return {
						id: book.id,
						title: book.title,
						author: book.author,
						totalPages: book.total_pages,
						description: book.description,
						cover: `${variables.pocketbaseURL}/api/files/books/${book.id}/${book.cover}`
					};
				});
			}
		}, 200);
	}

	async function addBookToLibrary(status: 'to read' | 'reading' | 'read' | 'abandoned') {
		if (!user || !selectedBook) return;

		const userBooks = await client.records.getFullList('libraries', 200, {
			filter: `user_id='${user.id}'`
		});

		const bookExists = userBooks.find((book) => book.book_id === selectedBook!.id);

		if (bookExists) {
			await client.records.update('libraries', bookExists.id, {
				status: status
			});

			const st = bookExists.status as 'to read' | 'reading' | 'read' | 'abandoned';
			library[st] = library[st].filter((book: BookInLibrary) => book.id !== bookExists.book_id);
		} else {
			await client.records.create('libraries', {
				user_id: user.id,
				book_id: selectedBook.id,
				status: status,
				current_page: 0
			});
		}

		library[status as 'to read' | 'reading' | 'read' | 'abandoned'].push({
			id: selectedBook.id,
			title: selectedBook.title,
			status: status,
			currentPage: bookExists ? parseInt(bookExists.current_page) : 0,
			totalPages: selectedBook.totalPages,
			author: selectedBook.author,
			description: selectedBook.description,
			cover: selectedBook.cover
		});

		storeLibrary.set(library);

		selectedBook = null;
		alert('Book added to library!');
	}
</script>

{#if user}
	<h2>add a book</h2>
	<div class="add-book">
		{#if !selectedBook}
			<input
				on:input={searchBook}
				type="text"
				name="title"
				placeholder="Book title..."
				autocomplete="off"
				value="among"
			/>
			<div class="result" />
		{:else}
			<div class="select-status">
				<div class="status" on:keypress|preventDefault on:click={() => addBookToLibrary('to read')}>
					<p>To Read</p>
				</div>
				<hr />
				<div class="status" on:keypress|preventDefault on:click={() => addBookToLibrary('reading')}>
					<p>Reading</p>
				</div>
				<hr />
				<div class="status" on:keypress|preventDefault on:click={() => addBookToLibrary('read')}>
					<p>Read</p>
				</div>
				<hr />
				<div
					class="status"
					on:keypress|preventDefault
					on:click={() => addBookToLibrary('abandoned')}
				>
					<p>Abandoned</p>
				</div>
				<hr />
			</div>
		{/if}

		<div class="books">
			{#each results as book}
				<div
					class="book"
					on:keypress|preventDefault
					on:click={() => {
						selectedBook = book;
						results = [];
					}}
				>
					<h3>{book.title}</h3>
					<p>by {book.author}</p>
					<p>{book.description}</p>
				</div>
				<hr />
			{/each}
		</div>
	</div>
{/if}

<style>
	.book,
	.status {
		cursor: pointer;
	}
</style>
