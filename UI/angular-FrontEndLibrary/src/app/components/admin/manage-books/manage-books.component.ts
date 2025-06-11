import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book, SlimBookDto } from '../../../Models/interfaces';
import { LibraryService } from '../../../Services/library.services';
import { BookService } from '../../../Services/book.services';
import { BookStatusEnum, GenreEnums } from '../../../Helpers/Enums/enum';
import { AdminSearchComponent } from '../admin-search/admin-search.component';
import { AdminBookListComponent } from '../admin-book-list/admin-book-list.component';
import { Router } from '@angular/router';
import { GenreListComponent } from '../../user-library/genre-list/genre-list.component';
import { BookTypeOptions, BookStatusOptions, GenreOptions } from '../../../Helpers/Helper';
@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.css'],
  standalone: true,
  imports: [CommonModule, AdminSearchComponent, AdminBookListComponent, GenreListComponent]
})
export class ManageBooksComponent {
  books: Book[] = [];
  editBook: Book | null = null;
  bookTypeOptions = BookTypeOptions;
  bookStatusOptions = BookStatusOptions;
  genreOptions = GenreOptions;
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
    onGenreSelected(genre: GenreEnums) {
      if (genre === GenreEnums.All) {
        this.getAllBooks(); // Fetch all books
      } else {
        this.libraryService
          .getBooksByGenre(genre, 'Title', true)
          .subscribe((response) => {
            this.books = response.isSuccess ? response.result : [];
          });
      }
    }
}