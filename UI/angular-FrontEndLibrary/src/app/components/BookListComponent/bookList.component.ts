import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, User } from '../../Models/interfaces';
import { BookStatusEnum, BookStatusDisplayNames ,GenreEnums, GenreDisplayNames } from '../../Services/Enums/enum.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './bookList.component.html',
  styleUrls: ['./bookList.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BookListComponent {
  @Input() books: Book[] = [];
  @Input() currentUserID!: string; 
  @Input() user!: User; 
  @Input() editBook: Book | null = null;
  @Output() onEdit = new EventEmitter<Book>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onUpdateStatus = new EventEmitter<{
    bookID: string;
    userID: string;
    bookStatus: BookStatusEnum;
  }>();
  @Output() onSave = new EventEmitter<Book>();
  @Output() onCancel = new EventEmitter<void>();
  

  BookStatusDisplayNames = BookStatusDisplayNames;
    bookStatuses = Object.values(BookStatusEnum).filter(v => typeof v === 'number') as BookStatusEnum[];; 
  GenreDisplayNames = GenreDisplayNames;
  genreOptions = Object.values(GenreEnums).filter(v => typeof v === 'number') as GenreEnums[];
  isSuperAdmin: boolean = false;
  ngOnInit() {
    console.log('BookListComponent initialized');
    console.log('Books received:', this.books);
    if (this.user?.adminRole === 'SuperAdmin') {
      this.isSuperAdmin = true;
    }
  }
  editBookDetails(book: Book) {
    this.onEdit.emit(book);
  }

  deleteBook(bookID: string) {
    this.onDelete.emit(bookID);
  }

  updateBookStatus(book: Book, userID: string, bookStatus: string) {
    const statusEnumValue = Number(bookStatus) as BookStatusEnum;
    const targetUserID = this.isSuperAdmin ? userID : this.currentUserID; 
    this.onUpdateStatus.emit({ bookID: book.bookID, userID: targetUserID, bookStatus: statusEnumValue });
  }

saveBook(book: Book) {
  book.genre = Number(book.genre) as GenreEnums;
  this.onSave.emit(book);
}

  cancelEdit() {
    this.onCancel.emit();
  }
}