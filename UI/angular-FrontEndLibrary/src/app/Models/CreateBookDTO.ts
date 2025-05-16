export interface CreateBookDTO {
  title: string;
  author: string;
  genre: string;
  publicationYear: string;
  bookDescription?: string;
  isInStock: boolean;
}