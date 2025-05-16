import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book, BookDto } from '../../Models/interfaces';
import { LibraryService } from '../../Services/library.services';
import { BookService } from '../../Services/book.services';
import { BookStatusEnum } from '../../Services/Enums/enum.service';
import { HeaderComponent } from '../header/header.component';
import { SearchComponent } from '../../components/library/search/search.component';
import { BookListComponent } from '../BookListComponent/bookList.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
  standalone: true,
  imports: [CommonModule, SearchComponent, BookListComponent]
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
      this.bookService.updateBook(this.editBook.bookID, book).subscribe(() => {
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

  updateStatus(event: { bookID: string; userID: string; bookStatus: BookStatusEnum }) {
    const { bookID, userID, bookStatus } = event;

    this.bookService.updateBookStatus(bookID, userID, bookStatus, 'Status updated via dropdown').subscribe(() => {
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
      this.bookService.updateBook(this.editBook.bookID, book).subscribe(() => {
        this.getAllBooks();
        this.resetForm();
      });
    }
  }
}