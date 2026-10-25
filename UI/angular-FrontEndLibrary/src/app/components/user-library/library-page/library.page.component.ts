import {
  Component,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Book, ILoggedInUser } from '../../../Models/interfaces';
import { LibraryService } from '../../../Services/library.services';
import { BookService } from '../../../Services/book.services';
import { UserActionsService } from '../../../Services/user-actions.service';
import { AuthService } from '../../../Services/auth.service';
import { BookStatusEnum, GenreEnums } from '../../../Helpers/Enums/enum';
import { SearchComponent } from '../search/search.component';
import { BookListComponent } from '../book-list/book-list.component';
import { BookCoverListComponent } from '../book-cover-list/book-cover-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  InfoCardColumn2,
  InfoCardColumn3,
  InfoCardDisplayRow,
} from '../../../Models/interfaces/site-interfaces';
import { InfoCardComponent } from '../../card-components/info-card/info-card.component';
import {
  BookTypeOptions,
  BookStatusOptions,
  GenreOptions,
} from '../../../Helpers/Helper';

type StatusFilter = 'all' | 'available' | 'reserved' | 'checkedOut';
type SortOption = 'title' | 'author' | 'newest';

@Component({
  selector: 'app-library',
  templateUrl: './library-page.component.html',
  styleUrls: ['./library-page.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [BookCoverListComponent, InfoCardComponent, FormsModule],
})
export class LibraryComponent {
  user: ILoggedInUser | null = null;
  currentUserId: string = '';
  books: Book[] = []; // Every book; the template shows visibleBooks
  loading = true;
  loadError = false;

  // Filtering and sorting happen client-side over the loaded books
  searchTerm = '';
  selectedGenre: GenreEnums = GenreEnums.All;
  selectedStatus: StatusFilter = 'all';
  sortBy: SortOption = 'title';
  viewMode: 'grid' | 'list' = 'grid';

  statusFilters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'checkedOut', label: 'Checked out' },
  ];
  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'title', label: 'Title (A–Z)' },
    { value: 'author', label: 'Author (A–Z)' },
    { value: 'newest', label: 'Newest published' },
  ];
  genreChoices = Object.values(GenreEnums)
    .filter((g): g is GenreEnums => typeof g === 'number')
    .filter((g) => g !== GenreEnums.None)
    .map((g) => ({ value: g, label: GenreOptions.displayNames[g] }));
  editBook: Book | null = null;
  showInfoCard = false;
  selectedBook: Book | null = null;
  selectedBookReviews: any[] = [];
  infoCardActions: { label: string; action: () => void; disabled?: boolean }[] =
    [];
  isSuperAdmin: boolean = false;
  bookTypeOptions = BookTypeOptions;
  bookStatusOptions = BookStatusOptions;
  genreOptions = GenreOptions;
  constructor(
    private libraryService: LibraryService,
    private bookService: BookService,
    private userActionsService: UserActionsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  @ViewChild(InfoCardComponent) infoCardComponent?: InfoCardComponent;
  addNewBook() {
    this.router.navigate(['/add-book']);
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.user = user;
      this.currentUserId = user?.userId ?? '';
      this.isSuperAdmin = !!user?.isSuperAdmin; // <-- Set here, after user is loaded
      if (this.selectedBook) {
        this.updateInfoCardActions(this.selectedBook);
      }
    });
    // Genre and search live in the URL (/library?genre=Fantasy&q=dune) so the
    // topbar search and links can point straight at a filtered view
    this.route.queryParamMap.subscribe((params) => {
      const genre = GenreEnums[params.get('genre') as keyof typeof GenreEnums];
      this.selectedGenre = genre ?? GenreEnums.All;
      this.searchTerm = params.get('q') ?? '';
    });
    this.getAllBooks();
  }

  getAllBooks() {
    this.libraryService.getAllBooks().subscribe(
      (response: { isSuccess: boolean; result: Book[] }) => {
        this.books =
          response.isSuccess && Array.isArray(response.result)
            ? response.result
            : [];
        this.loading = false;
        this.loadError = false;
      },
      (error) => {
        this.books = [];
        this.loading = false;
        this.loadError = true;
      },
    );
  }

  get visibleBooks(): Book[] {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = this.books.filter(
      (book) =>
        (this.selectedGenre === GenreEnums.All ||
          book.genre === this.selectedGenre) &&
        this.matchesStatus(book) &&
        (!term ||
          book.title?.toLowerCase().includes(term) ||
          book.author?.toLowerCase().includes(term) ||
          GenreOptions.displayNames[book.genre]?.toLowerCase().includes(term)),
    );
    return filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'author':
          return (a.author ?? '').localeCompare(b.author ?? '');
        case 'newest':
          return (
            (Number(b.publicationYear) || 0) - (Number(a.publicationYear) || 0)
          );
        default:
          return (a.title ?? '').localeCompare(b.title ?? '');
      }
    });
  }

  private matchesStatus(book: Book): boolean {
    switch (this.selectedStatus) {
      case 'available':
        return (
          book.bookStatus === BookStatusEnum.Available ||
          book.bookStatus === BookStatusEnum.Returned
        );
      case 'reserved':
        return book.bookStatus === BookStatusEnum.Reserved;
      case 'checkedOut':
        return (
          book.bookStatus === BookStatusEnum.CheckedOut ||
          book.bookStatus === BookStatusEnum.Overdue
        );
      default:
        return true;
    }
  }

  // Keep genre and search in the URL without adding history entries per keystroke
  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        genre:
          this.selectedGenre === GenreEnums.All
            ? null
            : GenreEnums[this.selectedGenre],
        q: this.searchTerm.trim() || null,
      },
      replaceUrl: true,
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedGenre = GenreEnums.All;
    this.selectedStatus = 'all';
    this.updateQueryParams();
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

  handleSearchResults(results: Book[]) {
    this.books = results;
  }

  saveBook(book: Book) {
    if (this.editBook) {
      this.bookService.updateBook(this.editBook.bookId, book).subscribe(() => {
        this.getAllBooks();
      });
    }
  }

  addToReservedBooks(book: Book) {
    this.userActionsService
      .reserveBook(this.currentUserId, book.bookId)
      .subscribe(() => {
        this.getAllBooks(); // Refresh the book list after reserving
      });
  }

  removeFromReservedBooks(book: Book) {
    this.userActionsService
      .unreserveBook(this.currentUserId, book.bookId)
      .subscribe(() => {
        this.getAllBooks(); // Refresh the book list after removing reservation
      });
  }

  borrowBook(book: Book) {
    this.userActionsService
      .borrowBook(this.currentUserId, book.bookId)
      .subscribe(() => {
        this.getAllBooks(); // Refresh the book list after borrowing
      });
  }
  addToReadList(book: Book) {
    this.userActionsService
      .addToFavorites(this.currentUserId, book.bookId)
      .subscribe(() => {});
  }
  removeFromReadList(book: Book) {
    this.userActionsService
      .removeFromFavorites(this.currentUserId, book.bookId)
      .subscribe(() => {});
  }

  onBookRowClicked(book: Book) {
    this.bookService.getBookById(book.bookId).subscribe((response) => {
      if (response.isSuccess && response.result) {
        this.selectedBook = response.result;
        this.showInfoCard = true;
        this.selectedBookReviews = [];
        this.libraryService.getBookReviews(book.bookId).subscribe({
          next: (reviewResponse) => {
            this.selectedBookReviews = (reviewResponse.result || []).map(
              (review: any): InfoCardDisplayRow[] => [
                { label: '', value: review.userName },
                { label: '', value: review.createdAt },
                { label: '', value: `Rating: ${review.ratingItem?.rating}` },
                { isBreak: true, value: '' },
                { label: '', value: review.reviewHeader },
                { label: '', value: review.reviewText },
              ],
            );
          },
          error: () => {
            this.selectedBookReviews = [];
          },
        });
        this.updateInfoCardActions(response.result);
      }
    });
  }

  updateInfoCardActions(book: Book) {
    const isReservedByUser =
      this.user?.reservedBooks?.some((item) => +item.bookId === +book.bookId) ??
      false;
    const isInReadList =
      this.user?.readList?.some((item) => +item.bookId === +book.bookId) ??
      false;
    const isCheckedOutByUser =
      this.user?.checkedOutBooks?.some(
        (item) => +item.bookId === +book.bookId,
      ) ?? false;

    this.infoCardActions = [
      {
        label: isCheckedOutByUser ? 'Return' : 'Borrow',
        action: () => this.toggleBorrow(book),
        disabled: this.isBorrowDisabled(book),
      },
      {
        label: isReservedByUser ? 'Cancel reservation' : 'Reserve',
        action: () => this.toggleReservation(book),
      },
      {
        label: isInReadList ? 'Remove from reading list' : 'Add to reading list',
        action: () => this.toggleReadList(book),
      },
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
      !this.user?.reservedBooks?.some((item) => +item.bookId === +book.bookId);

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
      (item: any) => item.userId === this.currentUserId,
    );
    let availabilityDate = '';
    if (userReservation?.availabilityDate) {
      availabilityDate = new Date(
        userReservation.availabilityDate,
      ).toLocaleDateString();
    } else if (book.availabilityDate) {
      availabilityDate = new Date(book.availabilityDate).toLocaleDateString();
    }

    return {
      status,
      availability: availabilityDate,
    };
  }

  toggleBorrow(book: Book) {
    const isCheckedOutByUser =
      this.user?.checkedOutBooks?.some(
        (item) => +item.bookId === +book.bookId,
      ) ?? false;
    // First, perform the user action
    const obs = isCheckedOutByUser
      ? this.userActionsService.returnBook(this.currentUserId, book.bookId)
      : this.userActionsService.borrowBook(this.currentUserId, book.bookId);

    obs.subscribe(() => {
      this.authService.refreshCurrentUser();
      this.bookService.getBookById(book.bookId).subscribe((response) => {
        if (response.isSuccess && response.result) {
          this.selectedBook = response.result;
          this.updateInfoCardActions(response.result);
        }
      });
    });
  }

  toggleReservation(book: Book) {
    const isReservedByUser =
      this.user?.reservedBooks?.some((item) => +item.bookId === +book.bookId) ??
      false;
    const obs = isReservedByUser
      ? this.userActionsService.unreserveBook(this.currentUserId, book.bookId)
      : this.userActionsService.reserveBook(this.currentUserId, book.bookId);

    obs.subscribe(() => {
      this.authService.refreshCurrentUser();
      this.bookService.getBookById(book.bookId).subscribe((response) => {
        if (response.isSuccess && response.result) {
          this.selectedBook = response.result;
          this.updateInfoCardActions(response.result);
        }
      });
    });
  }

  toggleReadList(book: Book) {
    const isInReadList =
      this.user?.readList?.some((item) => +item.bookId === +book.bookId) ??
      false;
    const obs = isInReadList
      ? this.userActionsService.removeFromFavorites(
          this.currentUserId,
          book.bookId,
        )
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
        { title: 'Title', value: this.selectedBook.title ?? '' },
        { title: 'Author', value: this.selectedBook.author ?? '' },
      ],
      rowPairs: [
        {
          first: {
            title: 'Genre',
            value:
              this.genreOptions.displayNames[
                this.selectedBook.genre
              ]?.toString() ||
              this.selectedBook.genre?.toString() ||
              '',
          },
          second: {
            title: 'Book type',
            value:
              this.bookTypeOptions.displayNames[
                this.selectedBook.bookType
              ]?.toString() || '',
          },
        },
        {
          first: {
            title: 'Published',
            value: this.selectedBook.publicationYear?.toString() || '',
          },
          second: { title: statusObj.status, value: statusObj.availability },
        },
      ],
      longText: {
        title: 'Description',
        value: this.selectedBook.bookDescription ?? '',
      },
    };
  }

  get infoCardCol3(): InfoCardColumn3 {
    if (!this.selectedBook) return {};
    return {
      rows: [
        {
          title: 'Reviews',
          value: this.selectedBookReviews, // This is InfoCardDisplayRow[][]
        },
      ],
    };
  }

  onGenreSelected(genre: GenreEnums) {
    this.selectedGenre = genre;
    this.updateQueryParams();
  }
}
