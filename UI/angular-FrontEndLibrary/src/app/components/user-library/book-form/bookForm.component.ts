//bookform.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlimBookDto } from '../../../Models/interfaces';
import { BookStatusEnum, GenreEnums } from '../../../Helpers/Enums/enum';

@Component({
  selector: 'app-book-form',
  standalone: true,
  templateUrl: './bookForm.component.html',
  styleUrls: ['./bookForm.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BookFormComponent {
  @Input() editBook: SlimBookDto | null = null;
  @Output() onSubmit = new EventEmitter<SlimBookDto>();
  @Output() onCancel = new EventEmitter<void>();

  book: SlimBookDto = {  
    title: '', 
    author: '', 
    genre: GenreEnums.None, // Default to "None"
    bookDescription: '', 
    publicationYear: '', 
  };
  ngOnChanges() {
    if (this.editBook) {
      this.book = { ...this.editBook };
    } else {
      this.resetForm();
    }
  }

  submitForm() {
    this.onSubmit.emit(this.book);
    this.resetForm();
  }

  resetForm() {
    this.book = { title: '', author: '', genre: GenreEnums.None, bookDescription: '', publicationYear: '' };
  }
}
