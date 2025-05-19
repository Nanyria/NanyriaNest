import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book, BookDto } from '../../../Models/interfaces';
import { LibraryService } from '../../../Services/library.services';
import { BookService } from '../../../Services/book.services';
import { BookStatusEnum } from '../../../Helpers/Enums/enum';
import { SearchComponent } from '../search/search.component';
import { BookListComponent } from '../book-list/book-list.component';
import { Router } from '@angular/router';
import { GenreListComponent } from '../genre-list/genre-list.component';

@Component({
  selector: 'app-library',
  templateUrl: './library-page.component.html',
  styleUrls: ['./library-page.component.css'],
  standalone: true,
  imports: [CommonModule, SearchComponent, BookListComponent, GenreListComponent]
})
export class LibraryComponent {
  books: Book[] = [];
  editBook: Book | null = null;

  constructor(private libraryService: LibraryService, private bookService: BookService, private router: Router) {}

  addNewBook() {
    this.router.navigate(['/add-book']);
  }

  ngOnInit(): void {
    this.getAllBooks();
  }

  getAllBooks() {
    console.log('Fetching all books...');
    this.libraryService.getAllBooks().subscribe(
      (response: { isSuccess: boolean; result: Book[] }) => {
        console.log('Books fetched:', response);
        if (response.isSuccess && Array.isArray(response.result)) {
          this.books = response.result;
          console.log('Books array:', this.books);
        } else {
          this.books = [];
        }
      },
      (error) => {
        console.error("Error fetching books", error);
        this.books = [];
      }
    );
  }

  handleFormSubmit(book: Book) {
    if (this.editBook) {
      this.bookService.updateBook(this.editBook.bookId, book).subscribe(() => {
        this.getAllBooks();
        this.resetForm();
      });
    } else {
      this.bookService.addBook(book).subscribe(() => {
        this.getAllBooks();
        this.resetForm();
      });
    }
  }

  deleteBook(bookID: string) {
    this.bookService.deleteBook(bookID).subscribe(() => {
      this.getAllBooks();
    });
  }

  updateStatus(event: { bookId: string; userId: string; bookStatus: BookStatusEnum }) {
    const { bookId, userId, bookStatus } = event;

    this.bookService.updateBookStatus(bookId, userId, bookStatus, 'Status updated via dropdown').subscribe(() => {
      this.getAllBooks(); // Refresh the book list after updating the status
    });
  }

  populateForm(book: Book) {
    this.editBook = { ...book };
  }

  resetForm() {
    this.editBook = null;
  }

  cancelEdit() {
    this.resetForm();
  }

  handleSearchResults(results: Book[]) {
    this.books = results;
  }

  saveBook(book: Book) {
    if (this.editBook) {
      this.bookService.updateBook(this.editBook.bookId, book).subscribe(() => {
        this.getAllBooks();
        this.resetForm();
      });
    }
  }
}