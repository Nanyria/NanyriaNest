import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, ILoggedInUser } from '../../../Models/interfaces';
import { BookStatusEnum, BookStatusDisplayNames ,GenreEnums, GenreDisplayNames, BookTypeEnums, BookTypeDisplayNames } from '../../../Helpers/Enums/enum';

@Component({
  selector: 'app-admin-book-list',
  templateUrl: './admin-book-list.component.html',
  styleUrls: ['./admin-book-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminBookListComponent {
  @Input() books: Book[] = [];
  @Input() currentUserId!: string; 
  @Input() user!: ILoggedInUser; 
  @Input() editBook: Book | null = null;
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
  ngOnInit() {
    console.log('BookListComponent initialized');
    console.log('Books received:', this.books);
    if (this.user?.isSuperAdmin) {
      this.isSuperAdmin = true;
    }
  }
  editBookDetails(book: Book) {
    this.onEdit.emit(book);
  }

  deleteBook(bookID: string) {
    this.onDelete.emit(bookID);
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
}