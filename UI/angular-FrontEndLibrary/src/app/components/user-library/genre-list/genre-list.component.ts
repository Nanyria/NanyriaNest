import { Component } from '@angular/core';
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
  GenreEnums = GenreEnums;
  genres = Object.values(GenreEnums).filter(v => typeof v === 'number') as GenreEnums[];

  getGenreDisplayName(genre: GenreEnums): string {
    return GenreDisplayNames[genre];
  }
}

