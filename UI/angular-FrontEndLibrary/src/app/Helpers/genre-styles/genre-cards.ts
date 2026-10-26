import { GenreEnums } from '../Enums/enum';

// Look of the illustrated genre cards in the parchment theme (library page,
// later the home page). The old GENRE_COLORS are the dark book-spine colours
// of the previous design.
export interface GenreCardStyle {
  tint: string; // card background
  ink: string; // border and icon colour
  icon: string; // Bootstrap Icons class, used when there is no illustration
  image?: string; // illustration in assets/, replaces the icon
}

const art = (name: string) => `assets/images/categories/${name}.png`;

export const GENRE_CARD_STYLES: Partial<Record<GenreEnums, GenreCardStyle>> = {
  [GenreEnums.Fantasy]: { tint: '#ddd2e8', ink: '#5a3a7a', icon: 'bi-magic', image: art('fantasy') },
  [GenreEnums.Children]: { tint: '#f6e2a8', ink: '#a8701a', icon: 'bi-balloon-fill', image: art('children') },
  [GenreEnums.Romance]: { tint: '#f2cdc8', ink: '#a33a3a', icon: 'bi-heart-fill', image: art('romance') },
  [GenreEnums.Horror]: { tint: '#cdd1c1', ink: '#3e4a33', icon: 'bi-moon-stars-fill', image: art('horror') },
  [GenreEnums.Thriller]: { tint: '#e2c4b8', ink: '#7a2a2a', icon: 'bi-lightning-charge-fill', image: art('thriller') },
  [GenreEnums.Mystery]: { tint: '#cdd7df', ink: '#34506b', icon: 'bi-search', image: art('mystery') },
  [GenreEnums.ScienceFiction]: { tint: '#c9d3e6', ink: '#2f4a7a', icon: 'bi-rocket-takeoff-fill', image: art('science-fiction') },
  [GenreEnums.NonFiction]: { tint: '#e3d8c0', ink: '#5a4a30', icon: 'bi-bank2', image: art('non-fiction') },
  [GenreEnums.Fiction]: { tint: '#ebd2b0', ink: '#6b3e1e', icon: 'bi-book-half', image: art('fiction') },
  [GenreEnums.Biography]: { tint: '#dccfb6', ink: '#5d4a30', icon: 'bi-person-vcard-fill', image: art('biography') },
  [GenreEnums.FeelGood]: { tint: '#f6d8ae', ink: '#a8601a', icon: 'bi-sun-fill', image: art('feel-good') },
  [GenreEnums.Poetry]: { tint: '#e8cedb', ink: '#7a3a5a', icon: 'bi-feather', image: art('poetry') },
  [GenreEnums.SelfHelp]: { tint: '#d2e3cb', ink: '#3e6b3a', icon: 'bi-flower1', image: art('self-help') },
};
