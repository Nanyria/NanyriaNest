import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Book, ILoggedInUser } from '../../../Models/interfaces';
import { BookStatusEnum } from '../../../Helpers/Enums/enum';
import { BookStatusOptions, GenreOptions } from '../../../Helpers/Helper';

@Component({
  selector: 'app-book-cover-list',
  templateUrl: './book-cover-list.component.html',
  styleUrls: ['./book-cover-list.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class BookCoverListComponent {
  @Input() books: Book[] = [];
  @Input() currentUserId!: string;
  @Input() user: ILoggedInUser | null = null;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Output() bookRowClicked = new EventEmitter<Book>();
  @Output() readListToggled = new EventEmitter<Book>();

  genreOptions = GenreOptions;
  readonly fallbackCover = 'assets/images/book-covers/BrownBook.svg';

  isInReadList(book: Book): boolean {
    return this.user?.readList?.some((item) => +item.bookId === +book.bookId) ?? false;
  }

  // Only flag books that can't be borrowed right now; "Available" is the norm
  statusBadge(book: Book): string | null {
    switch (book.bookStatus) {
      case BookStatusEnum.Reserved:
      case BookStatusEnum.CheckedOut:
      case BookStatusEnum.Overdue:
        return BookStatusOptions.displayNames[book.bookStatus];
      default:
        return null;
    }
  }

  reviewCount(book: Book): number {
    return book.reviews?.length ?? 0;
  }

  openBook(book: Book, event?: Event) {
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }
    this.bookRowClicked.emit(book);
  }

  toggleReadList(book: Book, event: Event) {
    event.stopPropagation(); // don't also open the book
    this.readListToggled.emit(book);
  }
}
