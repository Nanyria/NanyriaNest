import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-bookshelf',
  standalone: true,
  imports: [],
  templateUrl: './bookshelf.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./bookshelf.component.css'], // <-- corrected here
})
export class BookshelfComponent {}
