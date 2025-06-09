import { Component, Output, EventEmitter } from '@angular/core';
import { GenreEnums, GenreDisplayNames } from '../../../Helpers/Enums/enum';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-genre-list',
  standalone: true,
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.css'],
  imports: [CommonModule, GenreCardComponent],
})
export class GenreListComponent {
  @Output() genreSelected = new EventEmitter<GenreEnums>();
  GenreEnums = GenreEnums;
  genres = [GenreEnums.All, ...Object.values(GenreEnums).filter(v => typeof v === 'number' && v !== GenreEnums.All) as GenreEnums[]];

  getGenreDisplayName(genre: GenreEnums): string {
    return GenreDisplayNames[genre];
  }

  selectGenre(genre: GenreEnums) {
    this.genreSelected.emit(genre);
  }
}

