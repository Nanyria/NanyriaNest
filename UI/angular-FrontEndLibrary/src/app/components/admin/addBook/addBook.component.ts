import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { BookService } from '../../../Services/book.services';
import { SlimBookDto } from '../../../Models/interfaces';
import {
  GenreEnums,
  GenreDisplayNames,
  LanguageEnums,
  LanguageDisplayNames,
  BookTypeEnums,
} from '../../../Helpers/Enums/enum';

type BookFormat = 'physical' | 'digital';

const MAX_EPUB_SIZE = 100 * 1024 * 1024; // same limit as EpubService.MaxFileSize

// Checks name and size only; the server still validates the EPUB signature
function epubFileError(file: File): string | null {
  if (!file.name.toLowerCase().endsWith('.epub')) {
    return 'Only .epub files are allowed.';
  }
  if (file.size > MAX_EPUB_SIZE) {
    return 'The file is larger than 100 MB.';
  }
  return null;
}

function epubFileValidator(control: AbstractControl): ValidationErrors | null {
  const file = control.value as File | null;
  if (!file) return null;
  const error = epubFileError(file);
  return error ? { epubFile: error } : null;
}

@Component({
  selector: 'app-addbook',
  standalone: true,
  templateUrl: './addBook.component.html',
  styleUrls: ['./addBook.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, RouterModule],
})
export class AddBookComponent implements OnInit {
  addBookForm!: FormGroup;

  readonly BookTypeEnums = BookTypeEnums;
  readonly GenreDisplayNames = GenreDisplayNames;
  readonly LanguageDisplayNames = LanguageDisplayNames;
  // "None" and "All" are filter values, not real genres
  readonly genreOptions = (
    Object.values(GenreEnums).filter((v) => typeof v === 'number') as GenreEnums[]
  ).filter((g) => g !== GenreEnums.None && g !== GenreEnums.All);
  readonly languageOptions = (
    Object.values(LanguageEnums).filter((v) => typeof v === 'number') as LanguageEnums[]
  ).filter((l) => l !== LanguageEnums.Undefined);

  isSaving = false;
  serverErrors: string[] = [];

  // EPUB drop area
  isDraggingEpub = false;
  rejectedEpubName = '';
  epubError = '';

  coverPreviewFailed = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.addBookForm = this.fb.group({
      // UI only: decides which book types are offered, never sent to the API
      format: [null as BookFormat | null, Validators.required],
      bookType: [null as BookTypeEnums | null, Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      author: ['', [Validators.required, Validators.maxLength(75)]],
      publicationYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      genre: [null as GenreEnums | null, Validators.required],
      language: [LanguageEnums.English, Validators.required],
      bookDescription: [''],
      coverImagePath: [''],
      epubFile: [null as File | null],
    });

    // The EPUB is required for e-books only; any other type drops the file
    this.addBookForm.get('bookType')!.valueChanges.subscribe((type) => {
      const epub = this.addBookForm.get('epubFile')!;
      if (type === BookTypeEnums.EBook) {
        epub.setValidators([Validators.required, epubFileValidator]);
      } else {
        epub.clearValidators();
        epub.setValue(null);
        this.clearEpubError();
      }
      epub.updateValueAndValidity();
    });

    this.addBookForm.get('coverImagePath')!.valueChanges.subscribe(() => {
      this.coverPreviewFailed = false;
    });
  }

  get format(): BookFormat | null {
    return this.addBookForm.get('format')!.value;
  }

  get bookType(): BookTypeEnums | null {
    return this.addBookForm.get('bookType')!.value;
  }

  get isEbook(): boolean {
    return this.bookType === BookTypeEnums.EBook;
  }

  get epubFile(): File | null {
    return this.addBookForm.get('epubFile')!.value;
  }

  get coverUrl(): string {
    return (this.addBookForm.get('coverImagePath')!.value ?? '').trim();
  }

  // Shown next to the save button so the admin knows why it is disabled
  get saveHint(): string {
    if (!this.format) return 'Choose a format to continue.';
    if (this.isEbook && !this.epubFile) return 'Add an EPUB file to continue.';
    if (this.addBookForm.invalid) return 'Fill in the required fields.';
    return '';
  }

  // Picking a format preselects its first type
  setFormat(format: BookFormat): void {
    if (this.format === format) return;
    this.addBookForm.patchValue({
      format,
      bookType: format === 'physical' ? BookTypeEnums.Hardcover : BookTypeEnums.EBook,
    });
  }

  setBookType(type: BookTypeEnums): void {
    this.addBookForm.patchValue({ bookType: type });
  }

  showError(name: string): boolean {
    const control = this.addBookForm.get(name)!;
    return control.invalid && (control.dirty || control.touched);
  }

  // ---------- EPUB file ----------

  onEpubSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.takeEpub(input.files?.[0] ?? null);
    input.value = ''; // lets the same file be picked again after Remove
  }

  onEpubDragOver(event: DragEvent): void {
    event.preventDefault(); // required, otherwise the browser never fires drop
    this.isDraggingEpub = true;
  }

  onEpubDragLeave(): void {
    this.isDraggingEpub = false;
  }

  onEpubDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingEpub = false;
    this.takeEpub(event.dataTransfer?.files?.[0] ?? null);
  }

  // A file dropped next to a drop area would make the browser open it and
  // throw the form away; outside the drop areas a drop does nothing instead
  @HostListener('window:dragover', ['$event'])
  @HostListener('window:drop', ['$event'])
  preventFileOpen(event: DragEvent): void {
    event.preventDefault();
    const target = event.target as HTMLElement | null;
    if (event.dataTransfer && !target?.closest('.add-book__drop:not(.add-book__drop--disabled), .add-book__file')) {
      event.dataTransfer.dropEffect = 'none';
    }
  }

  removeEpub(): void {
    this.addBookForm.get('epubFile')!.setValue(null);
    this.clearEpubError();
  }

  private takeEpub(file: File | null): void {
    if (!file) return;
    const error = epubFileError(file);
    if (error) {
      this.epubError = error;
      this.rejectedEpubName = file.name;
      this.addBookForm.get('epubFile')!.setValue(null);
      return;
    }
    this.clearEpubError();
    this.addBookForm.get('epubFile')!.setValue(file);
  }

  private clearEpubError(): void {
    this.epubError = '';
    this.rejectedEpubName = '';
  }

  formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  // ---------- Save ----------

  onSubmit(): void {
    if (this.addBookForm.invalid || this.isSaving) {
      this.addBookForm.markAllAsTouched();
      return;
    }

    const value = this.addBookForm.value;
    const book: SlimBookDto = {
      title: value.title.trim(),
      author: value.author.trim(),
      genre: Number(value.genre) as GenreEnums,
      bookType: Number(value.bookType) as BookTypeEnums,
      language: Number(value.language) as LanguageEnums,
      publicationYear: value.publicationYear,
      bookDescription: value.bookDescription?.trim() || undefined,
      coverImagePath: this.coverUrl || undefined,
    };

    const request = this.isEbook
      ? this.bookService.addEbook(book, this.epubFile!)
      : this.bookService.addBook(book);

    this.isSaving = true;
    this.serverErrors = [];
    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/admin/manage-books']);
      },
      error: (err) => {
        this.isSaving = false;
        const messages: string[] = err?.error?.errorMessages ?? [];
        this.serverErrors = messages.length
          ? messages
          : ['Something went wrong. Please try again.'];
      },
    });
  }
}
