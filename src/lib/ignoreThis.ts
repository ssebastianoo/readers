export default NaN;

// <!-- {#if user}
// 	<h2>add a book</h2>
// 	<div class="add-book">
// 		{#if !selectedBook}
// 			<input
// 				on:input={searchBook}
// 				type="text"
// 				name="title"
// 				placeholder="Book title..."
// 				autocomplete="off"
// 				value="among"
// 				class="add-book-input"
// 			/>
// 			<div class="result" />
// 		{:else}
// 			<div class="select-status">
// 				<div class="status" on:keypress|preventDefault on:click={() => addBookToLibrary('to read')}>
// 					<p>To Read</p>
// 				</div>
// 				<hr />
// 				<div class="status" on:keypress|preventDefault on:click={() => addBookToLibrary('reading')}>
// 					<p>Reading</p>
// 				</div>
// 				<hr />
// 				<div class="status" on:keypress|preventDefault on:click={() => addBookToLibrary('read')}>
// 					<p>Read</p>
// 				</div>
// 				<hr />
// 				<div
// 					class="status"
// 					on:keypress|preventDefault
// 					on:click={() => addBookToLibrary('abandoned')}
// 				>
// 					<p>Abandoned</p>
// 				</div>
// 				<hr />
// 			</div>
// 		{/if}
//
// <div class="books">
// 	{#each results as book}
// 		<div
// 			class="book"
// 			on:keypress|preventDefault
// 			on:click={() => {
// 				selectedBook = book;
// 				results = [];
// 			}}
// 		>
// 			<h3>{book.title}</h3>
// 			<p>by {book.author}</p>
// 			<p>{book.description}</p>
// 		</div>
// 		<hr />
// 	{/each}
// </div>
// 	</div>
// {/if}

// <style lang="scss">
// 	.book,
// 	.status {
// 		cursor: pointer;
// 	}

// 	.add-book-input {
// 		all: unset;
// 		padding: 2px;
// 		border: 1px solid black;
// 		border-radius: 4px;
// 		transition: box-shadow 0.2s;

// 		&:focus {
// 			box-shadow: 4px 4px black;
// 		}
// 	}
// </style> -->
