import { Component, Input } from '@angular/core';
import { GENRE_COLORS } from '../../../Helpers/genre-colors/genre-colors';
import { GenreDisplayNames, GenreEnums } from '../../../Helpers/Enums/enum';
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
}