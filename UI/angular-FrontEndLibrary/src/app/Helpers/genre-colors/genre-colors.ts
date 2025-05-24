export interface GenreColors {
  gradient1: string;
  gradient2: string;
  text: string;
  font: string;
}

export const GENRE_COLORS: Record<string, GenreColors> = {
  none: {
    gradient1: '#dfdfdf',
    gradient2: '#a6a6a6',
    text: '#ffffff',
    font: "'Arial', sans-serif"
  },
  fantasy: {
    gradient1: '#762f88',
    gradient2: '#180037',
    text: '#8f2a8b',
    font: "'Cinzel', serif"
  },
  children: {
    gradient1: '#ffe49e',
    gradient2: '#ffd9f4',
    text: '#545454',
    font: "'Comic Sans MS', cursive, sans-serif"
  },
  romance: {
    gradient1: '#d398c6',
    gradient2: '#b76e79',
    text: '#ffffff',
    font: "'Dancing Script', cursive"
  },
  horror: {
    gradient1: '#540000',
    gradient2: '#000000',
    text: '#b71c1c',
    font: "'Creepster', cursive"
  },
  thriller: {
    gradient1: '#720c0c',
    gradient2: '#b71c1c',
    text: '#0b0c10',
    font: "'Oswald', sans-serif"
  },
  mystery: {
    gradient1: '#285a94',
    gradient2: '#262527',
    text: '#d9d9d9',
    font: "'Roboto Slab', serif"
  },
  sciencefiction: {
    gradient1: '#000022',
    gradient2: '#6a4d69',
    text: '#00b0ff',
    font: "'Orbitron', sans-serif"
  },
  nonfiction: {
    gradient1: '#ffffff',
    gradient2: '#899abb',
    text: '#333',
    font: "'Lato', sans-serif"
  },
  fiction: {
    gradient1: '#b6c6a3',
    gradient2: '#356953',
    text: '#333',
    font: "'Merriweather', serif"
  },
  biography: {
    gradient1: '#fff0e8',
    gradient2: '#a68985',
    text: '#573939',
    font: "'Georgia', serif"
  },
  feelgood: {
    gradient1: '#ffefbe',
    gradient2: '#ffc56e',
    text: '#605949',
    font: "'Pacifico', cursive"
  },
  poetry: {
    gradient1: '#84b7c4',
    gradient2: '#2a5b52',
    text: '#333',
    font: "'Poiret One', cursive"
  },
  selfhelp: {
    gradient1: '#a3d9f6',
    gradient2: '#424b6b',
    text: '#1a1e2b',
    font: "'Montserrat', sans-serif"
  }
};