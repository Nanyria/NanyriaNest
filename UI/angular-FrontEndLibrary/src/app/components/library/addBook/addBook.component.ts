import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../../Services/book.services';
import { BookDto } from '../../../Models/interfaces';
import { GenreEnums, GenreDisplayNames } from '../../../Services/Enums/enum.service'; // Adjust path if needed

@Component({
  selector: 'app-add-book',
  standalone: true,
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule // Import RouterModule
  ]
})
export class AddBookComponent implements OnInit {
  addBookForm!: FormGroup;
  GenreEnums = GenreEnums;
  GenreDisplayNames = GenreDisplayNames;
  genreOptions = Object.values(GenreEnums).filter(v => typeof v === 'number') as GenreEnums[];


  
  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addBookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required],
      publicationYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      bookDescription: [''],
    });
  }

  onSubmit(): void {
    if (this.addBookForm.valid) {
      console.log('Selected genre value:', this.addBookForm.get('genre')!.value);
      const newBook: BookDto = {
        title: this.addBookForm.get('title')!.value,
        author: this.addBookForm.get('author')!.value,
        genre: Number(this.addBookForm.get('genre')!.value) as unknown as GenreEnums,
        publicationYear: this.addBookForm.get('publicationYear')!.value,
        bookDescription: this.addBookForm.get('bookDescription')!.value,
      };
console.log(newBook);
    this.bookService.addBook(newBook).subscribe({
      next: response => {
        console.log('Book added successfully', response);
        this.router.navigate(['/library']);
      },
      error: error => {
        console.error('Error adding book', error);
      }
    });
    }
  }
}