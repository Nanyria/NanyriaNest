import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Book, SlimBookDto } from '../../../Models/interfaces';
import { LibraryService } from '../../../Services/library.services';
import { BookService } from '../../../Services/book.services';
import { BookStatusEnum, GenreEnums } from '../../../Helpers/Enums/enum';
import { AdminSearchComponent } from '../admin-search/admin-search.component';
import { AdminBookListComponent } from '../admin-book-list/admin-book-list.component';
import { Router } from '@angular/router';
import {
  BookTypeOptions,
  BookStatusOptions,
  GenreOptions,
} from '../../../Helpers/Helper';
import { AdminBookCardComponent } from '../../card-components/admin-book-card/admin-book-card.component';
@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AdminSearchComponent,
    AdminBookListComponent,
    AdminBookCardComponent,
  ],
})
export class ManageBooksComponent {
  books: Book[] = [];
  editBook: Book | null = null;
  updatedBook: SlimBookDto | null = null;
  showInfoCard = false;
  infoCardActions: { label: string; action: () => void; disabled?: boolean }[] =
    [];
  bookTypeOptions = BookTypeOptions;
  bookStatusOptions = BookStatusOptions;
  genreOptions = GenreOptions;
  constructor(
    private libraryService: LibraryService,
    private bookService: BookService,
    private router: Router,
  ) {}

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
        console.error('Error fetching books', error);
        this.books = [];
      },
    );
  }

  deleteBook(bookID: string) {
    this.bookService.deleteBook(bookID).subscribe(() => {
      this.getAllBooks();
    });
  }

  updateStatus(event: {
    bookId: string;
    userId: string;
    bookStatus: BookStatusEnum;
  }) {
    const { bookId, userId, bookStatus } = event;

    this.bookService
      .updateBookStatus(
        bookId,
        userId,
        bookStatus,
        'Status updated via dropdown',
      )
      .subscribe(() => {
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
      publicationYear: Number(
        bookInput.publicationYear ?? this.editBook.publicationYear,
      ),
      bookDescription:
        bookInput.bookDescription ?? this.editBook.bookDescription ?? null,
      bookType: Number(bookInput.bookType ?? this.editBook.bookType),
      language: Number(bookInput.language ?? this.editBook.language),
      coverImagePath:
        bookInput.coverImagePath ?? this.editBook.coverImagePath ?? null,
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
        console.error(
          'saveBook update error status=',
          err?.status,
          'errorBody=',
          err?.error,
        );
      },
    );
  }

  // If you also use handleFormSubmit to update, apply the same mapping there
  handleFormSubmit(bookInput: any) {
    console.log('handleFormSubmit called', {
      editBook: this.editBook,
      bookInput,
    });

    if (this.editBook) {
      const payload: SlimBookDto = {
        title: bookInput.title ?? this.editBook.title,
        author: bookInput.author ?? this.editBook.author,
        genre: (bookInput.genre ?? this.editBook.genre) as any,
        publicationYear: String(
          bookInput.publicationYear ?? this.editBook.publicationYear,
        ),
        bookDescription:
          bookInput.bookDescription ?? this.editBook.bookDescription,
        bookType: (bookInput.bookType ?? this.editBook.bookType) as any,
        language: (bookInput.language ?? this.editBook.language) as any,
        coverImagePath:
          bookInput.coverImagePath ?? this.editBook.coverImagePath,
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
        },
      );
    } else {
      // For creating new books, construct SlimBookDto similarly
    }
  }
  // onBookRowClicked(book: Book) {
  //   this.bookService.getBookById(book.bookId).subscribe((response) => {
  //     if (response.isSuccess && response.result) {
  //       this.selectedBook = response.result;
  //       this.showInfoCard = true;
  //       this.selectedBookReviews = [];
  //       this.libraryService.getBookReviews(book.bookId).subscribe({
  //         next: (reviewResponse) => {
  //           this.selectedBookReviews = (reviewResponse.result || []).map(
  //             (review: any): InfoCardDisplayRow[] => [
  //               { label: '', value: review.userName },
  //               { label: '', value: review.createdAt },
  //               { label: '', value: `Betyg: ${review.ratingItem?.rating}` },
  //               { isBreak: true, value: '' },
  //               { label: '', value: review.reviewHeader },
  //               { label: '', value: review.reviewText },
  //             ],
  //           );
  //         },
  //         error: () => {
  //           this.selectedBookReviews = [];
  //         },
  //       });
  //       this.updateInfoCardActions(response.result);
  //     }
  //   });
  // }

  // updateInfoCardActions(book: Book) {
  //   const isReservedByUser =
  //     this.user?.reservedBooks?.some((item) => +item.bookId === +book.bookId) ??
  //     false;
  //   const isInReadList =
  //     this.user?.readList?.some((item) => +item.bookId === +book.bookId) ??
  //     false;
  //   const isCheckedOutByUser =
  //     this.user?.checkedOutBooks?.some(
  //       (item) => +item.bookId === +book.bookId,
  //     ) ?? false;

  //   this.infoCardActions = [
  //     {
  //       label: isCheckedOutByUser ? 'Återlämna' : 'Låna',
  //       action: () => this.toggleBorrow(book),
  //       disabled: this.isBorrowDisabled(book),
  //     },
  //     {
  //       label: isReservedByUser ? 'Ta bort reservation' : 'Reservera',
  //       action: () => this.toggleReservation(book),
  //     },
  //     {
  //       label: isInReadList ? 'Ta bort från läslista' : 'Lägg till i läslista',
  //       action: () => this.toggleReadList(book),
  //     },
  //   ];
  // }
  // isBorrowDisabled(book: Book): boolean {
  //   const isCheckedOutBySomeoneElse =
  //     book.bookStatus === BookStatusEnum.CheckedOut &&
  //     book.checkedOutBy?.userId !== this.currentUserId;

  //   // If the book is not checked out, but there are prior reservations (not by this user)
  //   const hasPriorReservations =
  //     book.bookStatus !== BookStatusEnum.CheckedOut &&
  //     Array.isArray(book.reservations) &&
  //     book.reservations.length > 0 &&
  //     !this.user?.reservedBooks?.some((item) => +item.bookId === +book.bookId);

  //   return isCheckedOutBySomeoneElse || hasPriorReservations;
  // }
  // getBookStatusDisplay(book: Book): { status: string; availability: string } {
  //   const status =
  //     this.bookStatusOptions.displayNames[book.bookStatus]?.toString() ||
  //     (typeof book.bookStatus === 'string'
  //       ? book.bookStatus
  //       : book.bookStatus?.toString() || '');

  //   // If user has a reservation, show their reservation's availability date
  //   const userReservation = book.reservations?.find(
  //     (item: any) => item.userId === this.currentUserId,
  //   );
  //   let availabilityDate = '';
  //   if (userReservation?.availabilityDate) {
  //     availabilityDate = new Date(
  //       userReservation.availabilityDate,
  //     ).toLocaleDateString();
  //   } else if (book.availabilityDate) {
  //     availabilityDate = new Date(book.availabilityDate).toLocaleDateString();
  //   }

  //   return {
  //     status,
  //     availability: availabilityDate,
  //   };
  // }

  // toggleBorrow(book: Book) {
  //   const isCheckedOutByUser =
  //     this.user?.checkedOutBooks?.some(
  //       (item) => +item.bookId === +book.bookId,
  //     ) ?? false;
  //   // First, perform the user action
  //   const obs = isCheckedOutByUser
  //     ? this.userActionsService.returnBook(this.currentUserId, book.bookId)
  //     : this.userActionsService.borrowBook(this.currentUserId, book.bookId);

  //   obs.subscribe(() => {
  //     this.authService.refreshCurrentUser();
  //     this.bookService.getBookById(book.bookId).subscribe((response) => {
  //       if (response.isSuccess && response.result) {
  //         this.selectedBook = response.result;
  //         this.updateInfoCardActions(response.result);
  //       }
  //     });
  //   });
  // }

  // toggleReservation(book: Book) {
  //   const isReservedByUser =
  //     this.user?.reservedBooks?.some((item) => +item.bookId === +book.bookId) ??
  //     false;
  //   const obs = isReservedByUser
  //     ? this.userActionsService.unreserveBook(this.currentUserId, book.bookId)
  //     : this.userActionsService.reserveBook(this.currentUserId, book.bookId);

  //   obs.subscribe(() => {
  //     this.authService.refreshCurrentUser();
  //     this.bookService.getBookById(book.bookId).subscribe((response) => {
  //       if (response.isSuccess && response.result) {
  //         this.selectedBook = response.result;
  //         this.updateInfoCardActions(response.result);
  //       }
  //     });
  //   });
  // }

  // toggleReadList(book: Book) {
  //   const isInReadList =
  //     this.user?.readList?.some((item) => +item.bookId === +book.bookId) ??
  //     false;
  //   const obs = isInReadList
  //     ? this.userActionsService.removeFromFavorites(
  //         this.currentUserId,
  //         book.bookId,
  //       )
  //     : this.userActionsService.addToFavorites(this.currentUserId, book.bookId);

  //   obs.subscribe(() => {
  //     this.authService.refreshCurrentUser();
  //   });
  // }
  // closeInfoCard() {
  //   this.showInfoCard = false;
  //   this.selectedBook = null;
  // }

  // get infoCardCol2(): InfoCardColumn2 {
  //   if (!this.selectedBook) return {};
  //   const statusObj = this.getBookStatusDisplay(this.selectedBook);
  //   return {
  //     rows: [
  //       { title: 'Titel', value: this.selectedBook.title ?? '' },
  //       { title: 'Författare', value: this.selectedBook.author ?? '' },
  //     ],
  //     rowPairs: [
  //       {
  //         first: {
  //           title: 'Genre',
  //           value:
  //             this.genreOptions.displayNames[
  //               this.selectedBook.genre
  //             ]?.toString() ||
  //             this.selectedBook.genre?.toString() ||
  //             '',
  //         },
  //         second: {
  //           title: 'Boktyp',
  //           value:
  //             this.bookTypeOptions.displayNames[
  //               this.selectedBook.bookType
  //             ]?.toString() || '',
  //         },
  //       },
  //       {
  //         first: {
  //           title: 'Publicerad',
  //           value: this.selectedBook.publicationYear?.toString() || '',
  //         },
  //         second: { title: statusObj.status, value: statusObj.availability },
  //       },
  //     ],
  //     longText: {
  //       title: 'Bokbeskrivning',
  //       value: this.selectedBook.bookDescription ?? '',
  //     },
  //   };
  // }

  // get infoCardCol3(): InfoCardColumn3 {
  //   if (!this.selectedBook) return {};
  //   return {
  //     rows: [
  //       {
  //         title: 'Recensioner',
  //         value: this.selectedBookReviews, // This is InfoCardDisplayRow[][]
  //       },
  //     ],
  //   };
  // }

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
