import { Component, Input } from '@angular/core';
import { GENRE_COLORS } from '../../../Helpers/genre-styles/genre-colors';
import { GENRE_BOOK_SORT_STYLES } from '../../../Helpers/genre-styles/genre-book-sort-styles';
@Component({
  selector: 'app-genre-card',
  standalone: true,
  templateUrl: './genre-card.component.html',
  styleUrls: ['./genre-card.component.css']
})
export class GenreCardComponent {
  @Input() genre: string = '';
  @Input() displayName: string = '';
  get palette() {
    return GENRE_COLORS[this.genre?.toLowerCase()] || GENRE_COLORS['none'];
  }
  get genreStyle() {
  return GENRE_BOOK_SORT_STYLES[this.genre?.toLowerCase()] || GENRE_BOOK_SORT_STYLES['none'];
}
}