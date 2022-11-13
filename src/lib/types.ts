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
