import type { Record } from 'pocketbase';

export const variables = {
	pocketbaseURL: import.meta.env.VITE_POCKETBASE_URL
};

export type User = {
	id: string;
	username: string;
	name: string;
	email: string;
	avatar: string;
};

export type Book = {
	id: string;
	title: string;
	author: string;
	totalPages: number;
	description: string;
	cover: string;
};

export interface BookInLibrary extends Book {
	currentPage: number;
	status: 'to read' | 'reading' | 'read' | 'abandoned';
}

export type BooksList = {
	'to read': BookInLibrary[];
	reading: BookInLibrary[];
	read: BookInLibrary[];
	abandoned: BookInLibrary[];
};

export function getCoverUrl(data: Record) {
	return data.cover
		? `${variables.pocketbaseURL}/api/files/books/${data.id}/${data.cover}`
		: '/no-book-cover.png';
}