import {
  Component,
  Input,
  Output,
  EventEmitter,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AdminBook, ILoggedInUser, SlimBookDto } from '../../../Models/interfaces';
import {
  BookStatusEnum,
  BookStatusDisplayNames,
  GenreEnums,
  GenreDisplayNames,
  BookTypeEnums,
  BookTypeDisplayNames,
  LanguageEnums,
  LanguageDisplayNames,
} from '../../../Helpers/Enums/enum';

@Component({
  selector: 'app-admin-book-list',
  templateUrl: './admin-book-list.component.html',
  styleUrls: ['./admin-book-list.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule],
})
export class AdminBookListComponent {
  @Input() books: AdminBook[] = [];
  @Input() currentUserId!: string;
  @Input() user!: ILoggedInUser;
  @Input() editBook: AdminBook | null = null;
  @Output() onEdit = new EventEmitter<AdminBook>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onUpdateStatus = new EventEmitter<{
    bookId: string;
    userId: string;
    bookStatus: BookStatusEnum;
  }>();
  @Output() onSave = new EventEmitter<AdminBook>();
  @Output() onCancel = new EventEmitter<void>();

  BookTypeDisplayNames = BookTypeDisplayNames;
  bookTypes = Object.values(BookTypeEnums).filter(
    (v) => typeof v === 'number',
  ) as BookTypeEnums[];
  bookTypeOptions = Object.values(BookTypeEnums).filter(
    (v) => typeof v === 'number',
  ) as BookTypeEnums[];
  BookStatusDisplayNames = BookStatusDisplayNames;
  bookStatuses = Object.values(BookStatusEnum).filter(
    (v) => typeof v === 'number',
  ) as BookStatusEnum[];
  GenreDisplayNames = GenreDisplayNames;
  genreOptions = Object.values(GenreEnums).filter(
    (v) => typeof v === 'number',
  ) as GenreEnums[];
  LanguageDisplayNames = LanguageDisplayNames;
  languageOptions = Object.values(LanguageEnums).filter(
    (v) => typeof v === 'number',
  ) as LanguageEnums[];
  isSuperAdmin: boolean = false;
  ngOnInit() {
    if (this.user?.isSuperAdmin) {
      this.isSuperAdmin = true;
    }
  }
  editBookDetails(book: AdminBook) {
    this.onEdit.emit(book);
  }

  deleteBook(bookID: string) {
    this.onDelete.emit(bookID);
  }

  updateBookStatus(book: AdminBook, userId: string, bookStatus: string) {
    const statusEnumValue = Number(bookStatus) as BookStatusEnum;
    const targetUserId = this.isSuperAdmin ? userId : this.currentUserId;
    this.onUpdateStatus.emit({
      bookId: book.bookId,
      userId: targetUserId,
      bookStatus: statusEnumValue,
    });
  }

  saveBook(book: AdminBook) {
    book.genre = Number(book.genre) as GenreEnums;
    this.onSave.emit(book);
  }

  cancelEdit() {
    this.onCancel.emit();
  }
}
