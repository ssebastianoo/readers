import { writable } from 'svelte/store';
import type { User, BooksList } from '$lib/types';

export const user = writable<null | User>(null);
export const library = writable<BooksList>({
	'to read': [],
	reading: [],
	read: [],
	abandoned: []
});
