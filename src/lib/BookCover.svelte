<script lang="ts">
	import type { Book, BookInLibrary } from '$lib/types';
	export let book: BookInLibrary | Book;
</script>

<div class="book">
	<div class="text">
		<p class="title">{book.title}</p>
		<p class="author">{book.author}</p>
	</div>
	<img height="150" src={book.cover} alt={`${book.title} cover`} />
</div>

<style lang="scss">
	.book {
		display: flex;
		position: relative;

		.text {
			width: calc(100% - 4px);
			padding: 2px;
			position: absolute;
			bottom: 0;
			background-color: #ffb36cd8;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;

			p {
				margin: 0;
			}

			.author {
				margin-top: 10px;
				font-size: 13px;
			}
		}

		img {
			border-radius: 5px;
			box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.644);
		}
	}
</style>
