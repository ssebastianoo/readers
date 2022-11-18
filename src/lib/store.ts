import { writable } from 'svelte/store';
import type { User, BooksList, Book } from '$lib/utils';

export const user = writable<null | User>(null);
export const library = writable<BooksList>({
	'to read': [],
	reading: [],
	read: [],
	abandoned: []
});
export const bookCreated = writable<Book>();
