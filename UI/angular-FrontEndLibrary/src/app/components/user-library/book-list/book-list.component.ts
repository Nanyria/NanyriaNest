import { Component, Input, Output, EventEmitter, ViewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, ILoggedInUser } from '../../../Models/interfaces';
import { BookStatusEnum, BookStatusDisplayNames ,GenreEnums, GenreDisplayNames, BookTypeEnums, BookTypeDisplayNames } from '../../../Helpers/Enums/enum';
import { InfoCardComponent } from '../../card-components/info-card/info-card.component';
import { InfoCardColumn2, InfoCardColumn3 } from '../../../Models/interfaces/site-interfaces';
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, InfoCardComponent]
})
export class BookListComponent {
  @Input() books: Book[] = [];
  @Input() currentUserId!: string; 
  @Input() user!: ILoggedInUser; 
  @Output() onEdit = new EventEmitter<Book>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onUpdateStatus = new EventEmitter<{
    bookId: string;
    userId: string;
    bookStatus: BookStatusEnum;
  }>();
  @Output() onSave = new EventEmitter<Book>();
  @Output() onCancel = new EventEmitter<void>();

  BookTypeDisplayNames = BookTypeDisplayNames;
  bookTypes = Object.values(BookTypeEnums).filter(v => typeof v === 'number') as BookTypeEnums[];
  BookStatusDisplayNames = BookStatusDisplayNames;
  bookStatuses = Object.values(BookStatusEnum).filter(v => typeof v === 'number') as BookStatusEnum[];; 
  GenreDisplayNames = GenreDisplayNames;
  genreOptions = Object.values(GenreEnums).filter(v => typeof v === 'number') as GenreEnums[];
  isSuperAdmin: boolean = false;
  selectedBook: Book | null = null;
  showInfoCard = false;
  popupPosition = { top: 0, left: 0 };
  popupTableWidth = 0;
  @ViewChild(InfoCardComponent) infoCardComponent?: InfoCardComponent;

  ngOnInit() {
    console.log('BookListComponent initialized');
    console.log('Books received:', this.books);
    if (this.user?.isSuperAdmin) {
      this.isSuperAdmin = true;
    }
  }

  updateBookStatus(book: Book, userId: string, bookStatus: string) {
    const statusEnumValue = Number(bookStatus) as BookStatusEnum;
    const targetUserId = this.isSuperAdmin ? userId : this.currentUserId;
    this.onUpdateStatus.emit({ bookId: book.bookId, userId: targetUserId, bookStatus: statusEnumValue });
  }

  saveBook(book: Book) {
    book.genre = Number(book.genre) as GenreEnums;
    this.onSave.emit(book);
  }

  cancelEdit() {
    this.onCancel.emit();
  }

  onBookRowClick(book: Book, event: MouseEvent) {
    this.selectedBook = book;
    this.showInfoCard = true;

    // Find the image element that was clicked
    const img = (event.currentTarget as HTMLElement).querySelector('img');
    if (img) {
      const rect = img.getBoundingClientRect();
      // Adjust for scrolling and container offset if needed
        const table = document.querySelector('.table-custom') as HTMLElement;
        if (table) {
          this.popupTableWidth = table.offsetWidth;
        }
      this.popupPosition = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      };
    }
  }

  closeInfoCard() {
    this.showInfoCard = false;
    this.selectedBook = null;
  }

get infoCardCol2(): InfoCardColumn2 {
  if (!this.selectedBook) return {};
  return {
    rows: [
      { title: 'Titel', value: this.selectedBook.title ?? '' },
      { title: 'Författare', value: this.selectedBook.author ?? '' }
    ],
    rowPairs: [
      {
        first: { title: 'Genre', value: this.GenreDisplayNames[this.selectedBook.genre]?.toString() || this.selectedBook.genre?.toString() || '' },
        second: { title: 'Boktyp', value: this.BookTypeDisplayNames[this.selectedBook.bookType]?.toString() || '' }
      },
      {
        first: { title: 'Publiceringsår', value: this.selectedBook.publicationYear?.toString() || '' },
        second: { title: 'Status', value: this.BookStatusDisplayNames[this.selectedBook.bookStatus]?.toString() || '' }
      }
    ],
    longText: { title: 'Bokbeskrivning', value: this.selectedBook.bookDescription ?? '' }
  };
}

  get infoCardCol3(): InfoCardColumn3 {
    if (!this.selectedBook) return {};
    return {
      rows: [
        { title: 'Book ID', value: this.selectedBook.bookId?.toString() || '' },
        // { title: 'Reviews', value: this.selectedBook.reviews?.toString() || '' }
      ]
    };
  }
}
