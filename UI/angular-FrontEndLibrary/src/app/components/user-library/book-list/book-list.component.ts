import { Component, Input, Output, EventEmitter, ViewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, ILoggedInUser } from '../../../Models/interfaces';
import { BookStatusEnum, GenreEnums } from '../../../Helpers/Enums/enum';
import { InfoCardComponent } from '../../card-components/info-card/info-card.component';
import { BookTypeOptions, BookStatusOptions, GenreOptions } from '../../../Helpers/Helper';
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BookListComponent {
  @Input() books: Book[] = [];
  @Input() currentUserId!: string; 
  @Input() user: ILoggedInUser | null = null;
  @Output() onEdit = new EventEmitter<Book>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onUpdateStatus = new EventEmitter<{
    bookId: string;
    userId: string;
    bookStatus: BookStatusEnum;
  }>();
  @Output() onSave = new EventEmitter<Book>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() bookRowClicked = new EventEmitter<Book>();

  bookTypeOptions = BookTypeOptions;
  bookStatusOptions = BookStatusOptions;
  genreOptions = GenreOptions;
  isSuperAdmin: boolean = false;
  selectedBook: Book | null = null;
  selectedBookReviews: any[] = [];
  showInfoCard = false;


  constructor() {}
  @ViewChild(InfoCardComponent) infoCardComponent?: InfoCardComponent;

  ngOnInit() {
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
    this.bookRowClicked.emit(book);
  }

}

