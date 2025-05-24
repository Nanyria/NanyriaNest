import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book, ILoggedInUser } from '../../../Models/interfaces';
import { LibraryService } from '../../../Services/library.services';
import { BookService } from '../../../Services/book.services';
import { UserActionsService } from '../../../Services/user-actions.service';
import { AuthService } from '../../../Services/auth.service';
import { BookStatusEnum } from '../../../Helpers/Enums/enum';
import { SearchComponent } from '../search/search.component';
import { BookListComponent } from '../book-list/book-list.component';
import { Router } from '@angular/router';
import { GenreListComponent } from '../genre-list/genre-list.component';
import { InfoCardColumn2, InfoCardColumn3, InfoCardDisplayRow } from '../../../Models/interfaces/site-interfaces';
import { InfoCardComponent } from '../../card-components/info-card/info-card.component';
import { BookTypeOptions, BookStatusOptions, GenreOptions } from '../../../Helpers/Helper';
@Component({
  selector: 'app-library',
  templateUrl: './library-page.component.html',
  styleUrls: ['./library-page.component.css'],
  standalone: true,
  imports: [CommonModule, SearchComponent, BookListComponent, GenreListComponent, InfoCardComponent]
})
export class LibraryComponent {


  user: ILoggedInUser | null = null;
  currentUserId: string = '';
  books: Book[] = [];
  editBook: Book | null = null;
  showInfoCard = false;
  selectedBook: Book | null = null;
  selectedBookReviews: any[] = [];
  infoCardActions: { label: string; action: () => void; disabled?: boolean }[] = [];
  isSuperAdmin: boolean = false;
  bookTypeOptions = BookTypeOptions;
  bookStatusOptions = BookStatusOptions;
  genreOptions = GenreOptions;
  constructor(private libraryService: LibraryService, private bookService: BookService, private userActionsService: UserActionsService, private authService: AuthService, private router: Router) {}
  @ViewChild(InfoCardComponent) infoCardComponent?: InfoCardComponent;
  addNewBook() {
    this.router.navigate(['/add-book']);
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.currentUserId = user?.userId ?? '';
      this.isSuperAdmin = !!user?.isSuperAdmin; // <-- Set here, after user is loaded
      if (this.selectedBook) {
        this.updateInfoCardActions(this.selectedBook);
      }
    });
    this.getAllBooks();
    console.log('User:', this.user);
  }

  getAllBooks() {
    this.libraryService.getAllBooks().subscribe(
      (response: { isSuccess: boolean; result: Book[] }) => {
        if (response.isSuccess && Array.isArray(response.result)) {
          this.books = response.result;
        } else {
          this.books = [];
        }
      },
      (error) => {
        this.books = [];
      }
    );
  }

  updateStatus(event: { bookId: string; userId: string; bookStatus: BookStatusEnum }) {
    const { bookId, userId, bookStatus } = event;

    this.bookService.updateBookStatus(bookId, userId, bookStatus, 'Status updated via dropdown').subscribe(() => {
      this.getAllBooks(); // Refresh the book list after updating the status
    });
  }

  handleSearchResults(results: Book[]) {
    this.books = results;
  }

  saveBook(book: Book) {
    if (this.editBook) {
      this.bookService.updateBook(this.editBook.bookId, book).subscribe(() => {
        this.getAllBooks();;
      });
    }
  }

  addToReservedBooks(book: Book) {
    this.userActionsService.reserveBook(this.currentUserId, book.bookId).subscribe(() => {
      this.getAllBooks(); // Refresh the book list after reserving
    });
  }

  removeFromReservedBooks(book: Book) {
    this.userActionsService.unreserveBook(this.currentUserId, book.bookId).subscribe(() => {
      this.getAllBooks(); // Refresh the book list after removing reservation
    });
  }
  
  borrowBook(book: Book) {
    this.userActionsService.borrowBook(this.currentUserId, book.bookId).subscribe(() => {
      this.getAllBooks(); // Refresh the book list after borrowing
    });
  }
  addToReadList(book: Book) {
    this.userActionsService.addToFavorites(this.currentUserId, book.bookId).subscribe(() => {
    });
  }
  removeFromReadList(book: Book) {
    this.userActionsService.removeFromFavorites(this.currentUserId, book.bookId).subscribe(() => {
    });
  }

  onBookRowClicked(book: Book) {
    this.selectedBook = book;
    this.showInfoCard = true;
    this.selectedBookReviews = [];
    this.libraryService.getBookReviews(book.bookId).subscribe({
      next: (response) => {
        this.selectedBookReviews = (response.result || []).map((review: any): InfoCardDisplayRow[] => [
          { label: '', value: review.userName },
          { label: '', value: review.createdAt },
          { label: '', value: `Betyg: ${review.ratingItem?.rating}` },
          { isBreak: true, value: '' },
          { label: '', value: review.reviewHeader },
          { label: '', value: review.reviewText }
        ]);
      },
      error: () => {
        this.selectedBookReviews = [];
      }
    });

    this.updateInfoCardActions(book); // <--- Use this instead of duplicating logic
  }


  updateInfoCardActions(book: Book) {
    const isReservedByUser = this.user?.reservedBooks?.some(item => +item.bookId === +book.bookId) ?? false;
    const isInReadList = this.user?.readList?.some(item => +item.bookId === +book.bookId) ?? false;
    const isCheckedOutByUser = this.user?.checkedOutBooks?.some(item => +item.bookId === +book.bookId) ?? false;

    this.infoCardActions = [
      {
        label: isCheckedOutByUser ? 'Återlämna' : 'Låna',
        action: () => this.toggleBorrow(book),
        disabled: this.isBorrowDisabled(book)
      },
      {
        label: isReservedByUser ? 'Ta bort reservation' : 'Reservera',
        action: () => this.toggleReservation(book)
      },
      {
        label: isInReadList ? 'Ta bort från läslista' : 'Lägg till i läslista',
        action: () => this.toggleReadList(book)
      }
    ];
  }
  isBorrowDisabled(book: Book): boolean {
    const isCheckedOutBySomeoneElse =
      book.bookStatus === BookStatusEnum.CheckedOut &&
      book.checkedOutBy?.userId !== this.currentUserId;

    // If the book is not checked out, but there are prior reservations (not by this user)
    const hasPriorReservations =
      book.bookStatus !== BookStatusEnum.CheckedOut &&
      Array.isArray(book.reservations) &&
      book.reservations.length > 0 &&
      !this.user?.reservedBooks?.some(item => +item.bookId === +book.bookId);

    return isCheckedOutBySomeoneElse || hasPriorReservations;
  }
  getBookStatusDisplay(book: Book): { status: string; availability: string } {
    const status =
      this.bookStatusOptions.displayNames[book.bookStatus]?.toString() ||
      (typeof book.bookStatus === 'string'
        ? book.bookStatus
        : book.bookStatus?.toString() || '');

    // If user has a reservation, show their reservation's availability date
    const userReservation = book.reservations?.find(
      (item: any) => item.userId === this.currentUserId
    );
    let availabilityDate = '';
    if (userReservation?.availabilityDate) {
      availabilityDate = new Date(userReservation.availabilityDate).toLocaleDateString();
    } else if (book.availabilityDate) {
      availabilityDate = new Date(book.availabilityDate).toLocaleDateString();
    }

    return {
      status,
      availability: availabilityDate
    };
  }

  toggleBorrow(book: Book) {
    const isCheckedOutByUser = this.user?.checkedOutBooks?.some(item => +item.bookId === +book.bookId) ?? false;
    // First, perform the user action
    const obs = isCheckedOutByUser
      ? this.userActionsService.returnBook(this.currentUserId, book.bookId)
      : this.userActionsService.borrowBook(this.currentUserId, book.bookId);

  obs.subscribe(() => {
    this.authService.refreshCurrentUser();
    this.bookService.getBookById(book.bookId).subscribe(response => {
      if (response.isSuccess && response.result) {
        this.selectedBook = response.result;
        this.updateInfoCardActions(response.result);
      }
    });
  });
}

toggleReservation(book: Book) {
  const isReservedByUser = this.user?.reservedBooks?.some(item => +item.bookId === +book.bookId) ?? false;
  const obs = isReservedByUser
    ? this.userActionsService.unreserveBook(this.currentUserId, book.bookId)
    : this.userActionsService.reserveBook(this.currentUserId, book.bookId);

  obs.subscribe(() => {
    this.authService.refreshCurrentUser();
    this.bookService.getBookById(book.bookId).subscribe(response => {
      if (response.isSuccess && response.result) {
        this.selectedBook = response.result;
        this.updateInfoCardActions(response.result);
      }
    });
  });
}



    toggleReadList(book: Book) {
    const isInReadList = this.user?.readList?.some(item => +item.bookId === +book.bookId) ?? false;
    const obs = isInReadList
      ? this.userActionsService.removeFromFavorites(this.currentUserId, book.bookId)
      : this.userActionsService.addToFavorites(this.currentUserId, book.bookId);

    obs.subscribe(() => {
      this.authService.refreshCurrentUser();
    });
  }
  closeInfoCard() {
    this.showInfoCard = false;
    this.selectedBook = null;
  }

  get infoCardCol2(): InfoCardColumn2 {
    if (!this.selectedBook) return {};
      const statusObj = this.getBookStatusDisplay(this.selectedBook);
    return {
      rows: [
        { title: 'Titel', value: this.selectedBook.title ?? '' },
        { title: 'Författare', value: this.selectedBook.author ?? '' }
      ],
      rowPairs: [
        {
          first: { title: 'Genre', value: this.genreOptions.displayNames[this.selectedBook.genre]?.toString() || this.selectedBook.genre?.toString() || '' },
          second: { title: 'Boktyp', value: this.bookTypeOptions.displayNames[this.selectedBook.bookType]?.toString() || '' }
        },
        {
          first: { title: 'Publicerad', value: this.selectedBook.publicationYear?.toString() || '' },
          second: { title: statusObj.status, value: statusObj.availability }
        }
      ],
      longText: { title: 'Bokbeskrivning', value: this.selectedBook.bookDescription ?? '' }
    };
  }
  
    get infoCardCol3(): InfoCardColumn3 {
      if (!this.selectedBook) return {};
      return {
        rows: [
          {
            title: 'Recensioner',
            value: this.selectedBookReviews // This is InfoCardDisplayRow[][]
          }
        ]
      };
    }
}