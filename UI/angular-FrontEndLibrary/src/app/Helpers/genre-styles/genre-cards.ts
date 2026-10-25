import { GenreEnums } from '../Enums/enum';

// Look of the illustrated genre cards in the parchment theme (library page,
// later the home page). The old GENRE_COLORS are the dark book-spine colours
// of the previous design.
export interface GenreCardStyle {
  tint: string; // card background
  ink: string; // illustration colour
  icon: string; // Bootstrap Icons class, used until an illustration exists
  image?: string; // optional illustration in assets/, replaces the icon
}

export const GENRE_CARD_STYLES: Partial<Record<GenreEnums, GenreCardStyle>> = {
  [GenreEnums.Fantasy]: { tint: '#f1dfc0', ink: '#8e1f1c', icon: 'bi-magic' },
  [GenreEnums.Children]: { tint: '#f4e4b6', ink: '#a8701a', icon: 'bi-balloon-fill' },
  [GenreEnums.Romance]: { tint: '#f1d3cb', ink: '#a33a3a', icon: 'bi-heart-fill' },
  [GenreEnums.Horror]: { tint: '#d9dccb', ink: '#4b5a3c', icon: 'bi-moon-stars-fill' },
  [GenreEnums.Thriller]: { tint: '#e7cfc5', ink: '#7a2a2a', icon: 'bi-lightning-charge-fill' },
  [GenreEnums.Mystery]: { tint: '#eddcbf', ink: '#7a5426', icon: 'bi-search' },
  [GenreEnums.ScienceFiction]: { tint: '#d8d9e4', ink: '#3c4a7a', icon: 'bi-rocket-takeoff-fill' },
  [GenreEnums.NonFiction]: { tint: '#e4dccb', ink: '#5a4a30', icon: 'bi-bank2' },
  [GenreEnums.Fiction]: { tint: '#ead7bd', ink: '#6b3e1e', icon: 'bi-book-half' },
  [GenreEnums.Biography]: { tint: '#ecdcc4', ink: '#6b4a2a', icon: 'bi-person-vcard-fill' },
  [GenreEnums.FeelGood]: { tint: '#f3e5bd', ink: '#a8701a', icon: 'bi-sun-fill' },
  [GenreEnums.Poetry]: { tint: '#e9d6dc', ink: '#7a3a5a', icon: 'bi-feather' },
  [GenreEnums.SelfHelp]: { tint: '#d8e2d1', ink: '#4a6b3e', icon: 'bi-flower1' },
};
