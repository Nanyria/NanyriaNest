import {
  AfterViewInit,
  Component,
  DestroyRef,
  HostListener,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';

import { Book, ILoggedInUser } from '../../../Models/interfaces';
import { LibraryService } from '../../../Services/library.services';
import { BookService } from '../../../Services/book.services';
import { UserActionsService } from '../../../Services/user-actions.service';
import { AuthService } from '../../../Services/auth.service';
import { LibraryUiService } from '../../../Services/library-ui.service';
import { BookStatusEnum, BookTypeEnums, GenreEnums } from '../../../Helpers/Enums/enum';
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
import { ScrollStripComponent } from '../../layout/scroll-strip/scroll-strip.component';
import {
  BookTypeOptions,
  BookStatusOptions,
  GenreOptions,
} from '../../../Helpers/Helper';
import {
  GENRE_CARD_STYLES,
  GenreCardStyle,
} from '../../../Helpers/genre-styles/genre-cards';
import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

type StatusFilter = 'all' | 'available' | 'reserved' | 'checkedOut';
type SortOption = 'title' | 'author' | 'newest' | 'popular';
type BookFormatFilter = 'physical' | 'ebook' | 'audiobook' | 'all';

// Genre chips shown in the filter panel before "+ More" is pressed
const FILTER_GENRES_SHOWN = 6;

const byNewest = (a: Book, b: Book) =>
  (Number(b.publicationYear) || 0) - (Number(a.publicationYear) || 0);
const byMostReviewed = (a: Book, b: Book) =>
  (b.reviews?.length ?? 0) - (a.reviews?.length ?? 0);

@Component({
  selector: 'app-library',
  templateUrl: './library-page.component.html',
  styleUrls: ['./library-page.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    BookCoverListComponent,
    InfoCardComponent,
    ScrollStripComponent,
    FormsModule,
    NgTemplateOutlet,
  ],
})
export class LibraryComponent implements AfterViewInit {
  private destroyRef = inject(DestroyRef);
  user: ILoggedInUser | null = null;
  currentUserId: string = '';
  books: Book[] = []; // Every book; the template shows visibleBooks
  loading = true;
  loadError = false;

  // Filtering and sorting happen client-side over the loaded books
  searchTerm = '';
  selectedGenre: GenreEnums = GenreEnums.All;
  selectedStatus: StatusFilter = 'all';
  selectedBookFormat: BookFormatFilter = 'all';
  selectedMinimumRating = 0;
  averageRatings: Record<string, number> = {};
  ratingsLoaded = false;
  ratingsLoading = false;
  sortBy: SortOption = 'title';
  viewMode: 'grid' | 'list' = 'grid';
  showAll = false; // "See all" pressed: list every book even without filters
  genresExpanded = false;

  // The filter panel edits a draft that only takes effect on "Apply filters"
  filtersOpen = false;
  allFilterGenresShown = false;
  draft = {
    genre: GenreEnums.All,
    status: 'all' as StatusFilter,
    format: 'all' as BookFormatFilter,
    minimumRating: 0,
  };

  statusFilters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'checkedOut', label: 'Checked out' },
  ];
  formatFilters: { value: BookFormatFilter; label: string }[] = [
    { value: 'physical', label: 'Physical book' },
    { value: 'ebook', label: 'E-book' },
    { value: 'audiobook', label: 'Audiobook' },
  ];
  ratingFilters = [0, 3, 4, 5];
  sortOptions: { value: SortOption; label: string }[] = [
    { value: 'title', label: 'Title (A–Z)' },
    { value: 'author', label: 'Author (A–Z)' },
    { value: 'newest', label: 'Newest published' },
    { value: 'popular', label: 'Most reviewed' },
  ];
  // One illustrated card per genre ("All" is the header link, not a card)
  genreCards = Object.values(GenreEnums)
    .filter((g): g is GenreEnums => typeof g === 'number')
    .filter((g) => g !== GenreEnums.None && g !== GenreEnums.All)
    .map((g) => ({
      value: g,
      label: GenreOptions.displayNames[g],
      ...(GENRE_CARD_STYLES[g] ??
        ({ tint: '#ecdcc4', ink: '#6b4a2a', icon: 'bi-bookmark' } as GenreCardStyle)),
    }));
  readonly allGenres = GenreEnums.All;

  @ViewChild('genreStrip') genreStrip?: ScrollStripComponent;
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
    private libraryUi: LibraryUiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  @ViewChild(InfoCardComponent) infoCardComponent?: InfoCardComponent;
  addNewBook() {
    this.router.navigate(['/add-book']);
  }

  ngOnInit(): void {
    this.libraryUi.filtersToggled$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => (this.filtersOpen ? this.closeFilters() : this.openFilters()));
    this.authService
      .getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.user = user;
        this.currentUserId = user?.userId ?? '';
        this.isSuperAdmin = !!user?.isSuperAdmin; // <-- Set here, after user is loaded
        if (this.selectedBook) {
          this.updateInfoCardActions(this.selectedBook);
        }
      });
    // Genre, search and "see all" live in the URL (/library?genre=Fantasy&q=dune)
    // so the topbar search and links can point straight at a filtered view
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const genre = GenreEnums[params.get('genre') as keyof typeof GenreEnums];
        this.selectedGenre = genre ?? GenreEnums.All;
        this.searchTerm = params.get('q') ?? '';
        this.showAll = params.get('view') === 'all';
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
        this.matchesFormat(book) &&
        this.matchesMinimumRating(book) &&
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
          return byNewest(a, b);
        case 'popular':
          return byMostReviewed(a, b);
        default:
          return (a.title ?? '').localeCompare(b.title ?? '');
      }
    });
  }

  private matchesFormat(book: Book): boolean {
    switch (this.selectedBookFormat) {
      case 'physical':
        return (
          book.bookType === BookTypeEnums.Paperback ||
          book.bookType === BookTypeEnums.Hardcover
        );
      case 'ebook':
        return book.bookType === BookTypeEnums.EBook;
      case 'audiobook':
        return book.bookType === BookTypeEnums.Audiobook;
      default:
        return true;
    }
  }

  private matchesMinimumRating(book: Book): boolean {
    return (
      !this.selectedMinimumRating ||
      (this.averageRatings[book.bookId] ?? 0) >= this.selectedMinimumRating
    );
  }

  // Books carry no average rating, so it's worked out from each book's reviews.
  // That's one request per book, made only the first time the rating filter is used.
  private loadAverageRatings(): void {
    if (!this.books.length || this.ratingsLoaded || this.ratingsLoading) return;
    this.ratingsLoading = true;
    const requests = this.books.map((book) =>
      this.libraryService
        .getBookReviews(book.bookId)
        .pipe(catchError(() => of({ result: [] }))),
    );
    forkJoin(requests).subscribe((responses) => {
      const ratings: Record<string, number> = {};
      responses.forEach((response: any, index) => {
        const values: number[] = (response?.result ?? [])
          .map((review: any) =>
            Number(review.ratingItem?.rating ?? review.ratingItem?.Rating),
          )
          .filter((value: number) => Number.isFinite(value) && value > 0);
        if (values.length) {
          ratings[this.books[index].bookId] =
            values.reduce((sum, value) => sum + value, 0) / values.length;
        }
      });
      this.averageRatings = ratings;
      this.ratingsLoaded = true;
      this.ratingsLoading = false;
    });
  }

  // ---------- Browse view: shelves of books ----------
  get recentlyPublishedBooks(): Book[] {
    return [...this.books].sort(byNewest).slice(0, 12);
  }

  get popularBooks(): Book[] {
    return [...this.books].sort(byMostReviewed).slice(0, 12);
  }

  // Any search, filter or "see all" swaps the shelves for the full results list
  get isResultsMode(): boolean {
    return this.showAll || this.activeFilters.length > 0;
  }

  // The filters in effect, as removable chips above the results
  get activeFilters(): { label: string; clear: () => void }[] {
    const chips: { label: string; clear: () => void }[] = [];
    if (this.searchTerm.trim()) {
      chips.push({
        label: `"${this.searchTerm.trim()}"`,
        clear: () => {
          this.searchTerm = '';
          this.updateQueryParams();
        },
      });
    }
    if (this.selectedGenre !== GenreEnums.All) {
      chips.push({
        label: GenreOptions.displayNames[this.selectedGenre],
        clear: () => this.onGenreSelected(GenreEnums.All),
      });
    }
    if (this.selectedBookFormat !== 'all') {
      chips.push({
        label: this.formatFilters.find((f) => f.value === this.selectedBookFormat)!.label,
        clear: () => (this.selectedBookFormat = 'all'),
      });
    }
    if (this.selectedMinimumRating) {
      chips.push({
        label: `${this.selectedMinimumRating}+ stars`,
        clear: () => (this.selectedMinimumRating = 0),
      });
    }
    if (this.selectedStatus !== 'all') {
      chips.push({
        label: this.statusFilters.find((f) => f.value === this.selectedStatus)!.label,
        clear: () => (this.selectedStatus = 'all'),
      });
    }
    return chips;
  }

  get resultsTitle(): string {
    if (this.activeFilters.length === 0) return 'All books';
    return this.searchTerm.trim() ? 'Search results' : 'Filtered books';
  }

  // "See all" on a shelf lists every book in that shelf's order
  seeAll(sort: SortOption) {
    this.sortBy = sort;
    this.showAll = true;
    this.updateQueryParams();
    window.scrollTo({ top: 0 });
  }

  // ---------- Filter panel ----------
  get filterGenreChips() {
    if (this.allFilterGenresShown) return this.genreCards;
    // Keep the chosen genre visible even when it's past the first few
    return this.genreCards.filter(
      (genre, index) =>
        index < FILTER_GENRES_SHOWN || genre.value === this.draft.genre,
    );
  }

  get hiddenFilterGenreCount(): number {
    return this.genreCards.length - this.filterGenreChips.length;
  }

  openFilters() {
    this.draft = {
      genre: this.selectedGenre,
      status: this.selectedStatus,
      format: this.selectedBookFormat,
      minimumRating: this.selectedMinimumRating,
    };
    this.filtersOpen = true;
  }

  closeFilters() {
    this.filtersOpen = false;
    this.allFilterGenresShown = false;
  }

  resetDraftFilters() {
    this.draft = {
      genre: GenreEnums.All,
      status: 'all',
      format: 'all',
      minimumRating: 0,
    };
  }

  applyFilters() {
    this.selectedGenre = this.draft.genre;
    this.selectedStatus = this.draft.status;
    this.selectedBookFormat = this.draft.format;
    this.selectedMinimumRating = this.draft.minimumRating;
    if (this.selectedMinimumRating) {
      this.loadAverageRatings();
    }
    this.updateQueryParams();
    this.closeFilters();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.filtersOpen) {
      this.closeFilters();
    }
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
        view: this.showAll ? 'all' : null,
      },
      replaceUrl: true,
    });
  }

  // Back to the browse view with no filters at all
  clearFilters() {
    this.showAll = false;
    this.sortBy = 'title';
    this.searchTerm = '';
    this.selectedGenre = GenreEnums.All;
    this.selectedStatus = 'all';
    this.selectedBookFormat = 'all';
    this.selectedMinimumRating = 0;
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

  // When arriving with ?genre=…, centre that genre in the strip
  ngAfterViewInit() {
    if (this.selectedGenre !== GenreEnums.All) {
      this.genreStrip?.centerOn(`[data-genre="${this.selectedGenre}"]`);
    }
  }
}
