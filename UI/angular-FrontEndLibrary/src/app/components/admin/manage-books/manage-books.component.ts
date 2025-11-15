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
  updatedBook: SlimBookDto | null = null;
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
    // console.log('Fetching all books...');
    this.libraryService.getAllBooks().subscribe(
      (response: { isSuccess: boolean; result: Book[] }) => {
        console.log('Books fetched:', response);
        if (response.isSuccess && Array.isArray(response.result)) {
          this.books = response.result;
          // console.log('Books array:', this.books);
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

  // handleFormSubmit(book: Book, updatedBook: SlimBookDto) {
  //   console.log('handleFormSubmit called', { editBook: this.editBook, book, updatedBook });
  //   if (this.editBook) {
  //     console.log('Updating book id=', this.editBook.bookId, 'payload=', updatedBook);
  //     this.bookService.updateBook(this.editBook.bookId, updatedBook).subscribe(
  //       (res) => {
  //         console.log('Update book response', res);
  //         this.getAllBooks();
  //         this.resetForm();
  //       },
  //       (err) => {
  //         console.error('Error updating book', err);
  //       }
  //     );
  //   } else {
  //     console.log('Adding new book payload=', book);
  //     this.bookService.addBook(book).subscribe(
  //       (res) => {
  //         console.log('Add book response', res);
  //         this.getAllBooks();
  //         this.resetForm();
  //       },
  //       (err) => {
  //         console.error('Error adding book', err);
  //       }
  //     );
  //   }
  // }

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

  saveBook(bookInput: SlimBookDto) {
    console.log('saveBook called', { editBook: this.editBook, bookInput });

    if (!this.editBook) {
      console.warn('saveBook: no editBook set, aborting');
      return;
    }

    // Build payload with proper types (cast enums/years to numbers if API expects numbers)
    const payload: any = {
      title: (bookInput.title ?? this.editBook.title) as string,
      author: (bookInput.author ?? this.editBook.author) as string,
      genre: Number(bookInput.genre ?? this.editBook.genre),
      publicationYear: Number(bookInput.publicationYear ?? this.editBook.publicationYear),
      bookDescription: bookInput.bookDescription ?? this.editBook.bookDescription ?? null,
      bookType: Number(bookInput.bookType ?? this.editBook.bookType),
      language: Number(bookInput.language ?? this.editBook.language),
      coverImagePath: bookInput.coverImagePath ?? this.editBook.coverImagePath ?? null
    };

    console.log('saveBook -> sending payload:', payload);

    this.bookService.updateBook(this.editBook.bookId, payload).subscribe(
      (res) => {
        console.log('saveBook update response', res);
        this.getAllBooks();
        this.resetForm();
      },
      (err) => {
        // show HTTP status and backend error body for diagnosis
        console.error('saveBook update error status=', err?.status, 'errorBody=', err?.error);
      }
    );
  }

  // If you also use handleFormSubmit to update, apply the same mapping there
  handleFormSubmit(bookInput: any) {
    console.log('handleFormSubmit called', { editBook: this.editBook, bookInput });

    if (this.editBook) {
      const payload: SlimBookDto = {
        title: bookInput.title ?? this.editBook.title,
        author: bookInput.author ?? this.editBook.author,
        genre: (bookInput.genre ?? this.editBook.genre) as any,
        publicationYear: String(bookInput.publicationYear ?? this.editBook.publicationYear),
        bookDescription: bookInput.bookDescription ?? this.editBook.bookDescription,
        bookType: (bookInput.bookType ?? this.editBook.bookType) as any,
        language: (bookInput.language ?? this.editBook.language) as any,
        coverImagePath: bookInput.coverImagePath ?? this.editBook.coverImagePath
      };

      console.log('handleFormSubmit -> updating with payload:', payload);
      this.bookService.updateBook(this.editBook.bookId, payload).subscribe(
        (res) => {
          console.log('handleFormSubmit update response', res);
          this.getAllBooks();
          this.resetForm();
        },
        (err) => {
          console.error('handleFormSubmit update error', err);
        }
      );
    } else {
      // For creating new books, construct SlimBookDto similarly
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