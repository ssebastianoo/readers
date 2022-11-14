<script lang="ts">
	import { client } from '$lib/database';
	import { variables } from './variables';
	import { user as storeUser, library as storeLibrary } from '$lib/store';
	import type { Book, User, BooksList, BookInLibrary } from '$lib/types';
	import BookCover from '$lib/BookCover.svelte';

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

	// let results: Book[] = [];
	let results: Book[] = [
		{
			id: 'xjdsy44vuev68qr',
			title: 'la storia di amongo',
			author: 'giorgio casavola',
			totalPages: 100,
			description: 'semplice narratura della vita di amongo',
			cover: '/no-book-cover.png'
		},
		{
			id: 'xjdsy44vuev68qr',
			title: 'la storia di amongo',
			author: 'giorgio casavola',
			totalPages: 100,
			description: 'semplice narratura della vita di amongo',
			cover: '/no-book-cover.png'
		},
		{
			id: 'xjdsy44vuev68qr',
			title: 'la storia di amongo',
			author: 'giorgio casavola',
			totalPages: 100,
			description: 'semplice narratura della vita di amongo',
			cover: '/no-book-cover.png'
		},
		{
			id: 'xjdsy44vuev68qr',
			title: 'la storia di amongo',
			author: 'giorgio casavola',
			totalPages: 100,
			description: 'semplice narratura della vita di amongo',
			cover: '/no-book-cover.png'
		},
		{
			id: 'xjdsy44vuev68qr',
			title: 'la storia di amongo',
			author: 'giorgio casavola',
			totalPages: 100,
			description: 'semplice narratura della vita di amongo',
			cover: '/no-book-cover.png'
		},
		{
			id: 'xjdsy44vuev68qr',
			title: 'la storia di amongo',
			author: 'giorgio casavola',
			totalPages: 100,
			description: 'semplice narratura della vita di amongo',
			cover: '/no-book-cover.png'
		}
	];
	let lastUpdated = new Date();
	let selectedBook: null | Book = null;
	// let selectedBook: any = 'dksoakdjdiah';

	let openPopup = true;

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
					filter: `title~'${target.value}' || author~'${target.value}'`
				});
				results = books.map((book) => {
					return {
						id: book.id,
						title: book.title,
						author: book.author,
						totalPages: book.total_pages,
						description: book.description,
						cover: book.cover
							? `${variables.pocketbaseURL}/api/files/books/${book.id}/${book.cover}`
							: '/no-book-cover.png'
					};
				});
				console.log(results);
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
				? `${variables.pocketbaseURL}/api/files/books/${selectedBook.id}/${selectedBook.cover}`
				: '/no-book-cover.png'
		});

		storeLibrary.set(library);

		selectedBook = null;
		alert('Book added to library!');
	}
</script>

{#if user}
	{#if !openPopup}
		<div
			class="add-book-icon"
			on:keypress|preventDefault
			on:click|preventDefault={() => {
				openPopup = true;
			}}
		>
			<svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
				><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
					d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
				/></svg
			>
		</div>
	{:else}
		<div class="add-book">
			<p class="title">Add a book to your library</p>
			<input
				type="text"
				name="title"
				placeholder="Search book..."
				autocomplete="off"
				value="among"
				on:input={searchBook}
			/>
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
						<BookCover {book} />
					</div>
				{/each}
			</div>
		</div>
	{/if}
{/if}

<style lang="scss">
	.add-book {
		position: absolute;
		width: calc(100vw - 60px);
		height: calc(100vh - 60px);
		background-color: RGBA(0, 0, 0, 0.5);
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		padding: 30px;
		gap: 20px;

		.title {
			background-color: var(--color1);
			border-radius: 5px;
			padding: 4px;
			margin: 0;
		}

		input {
			all: unset;
			background-color: var(--color1);
			border-radius: 5px;
			padding: 4px;
			outline: 2px solid black;
		}

		.books {
			// background-color: RGBA(255, 255, 255, 0.2);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			gap: 5px;
			border-radius: 5px;
			padding: 2px;

			.book {
				cursor: pointer;
			}
		}
	}

	.add-book-icon {
		cursor: pointer;
		box-shadow: 2px 2px 2px black;
		width: 50px;
		height: 30px;
		border-radius: 10px;
		background-color: #ffa048;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
</style>
