import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { LibraryService } from '../../../Services/library.services';
import { Book } from '../../../Models/interfaces';

@Component({
  selector: 'app-admin-search',
  templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule],
})
export class AdminSearchComponent {
  title: string = '';
  author: string = '';
  @Output() searchResults = new EventEmitter<Book[]>();

  constructor(private bookService: LibraryService) {}

  searchByTitle() {
    this.bookService.getBooksByTitle(this.title).subscribe((response) => {
      if (response.isSuccess) {
        this.searchResults.emit(response.result);
      }
    });
  }

  searchByAuthor() {
    this.bookService.getBooksByAuthor(this.author).subscribe((response) => {
      if (response.isSuccess) {
        this.searchResults.emit(response.result);
      }
    });
  }
}
