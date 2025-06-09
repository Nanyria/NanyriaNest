export interface GenreColors {
  gradient1: string;
  gradient2: string;
  text: string;
  font: string;
  fontSize?: string;
  highlight: string;
  shadow: string;
}

export const GENRE_COLORS: Record<string, GenreColors> = {
  none: {
    gradient1: 'rgba(223,223,223,1)',
    gradient2: 'rgba(166,166,166,1)',
    text: 'rgb(255, 255, 255)',
    font: "'Arial', sans-serif",
    fontSize: '1.1rem',
    highlight: 'rgba(255, 255, 255, 0.3)',
    shadow: 'rgba(155, 155, 155, 0.3)'
  },
  all: {
    gradient1: 'rgba(117, 75, 43,1)',
    gradient2: 'rgba(73, 47, 27,1)',
    text: 'rgb(255, 255, 255)',
    font: "'Arial', sans-serif",
    fontSize: '1.1rem',
    highlight: 'rgba(170, 125, 91, 0.3)',
    shadow: 'rgba(53, 29, 11, 0.3)'
  },
  fantasy: {
    gradient1: 'rgba(118,47,136,0.5)',
    gradient2: 'rgba(24,0,55,1)',
    text: 'rgba(143, 42, 139, 1)',
    font: "'Cinzel', serif",
    fontSize: '1.3rem',
    highlight: 'rgba(173, 97, 192, 0.3)',
    shadow: 'rgba(69, 19, 81, 0.3)'
  },
  children: {
    gradient1: 'rgba(255,228,158,1)',
    gradient2: 'rgb(233, 172, 115)',
    text: 'rgba(84, 84, 84, 1)',
    fontSize: '1rem',
    font: "'Comic Sans MS', cursive, sans-serif",
    highlight: 'rgba(255, 248, 229, 0.3)',
    shadow: 'rgba(172, 154, 108, 0.3)'
  },
  romance: {
    gradient1: 'rgba(211,152,198,1)',
    gradient2: 'rgba(183,110,121,1)',
    text: 'rgba(255, 255, 255, 0.8)',
    font: "'Dancing Script', cursive",
    fontSize: '1.2rem',
    highlight: 'rgba(237, 197, 228, 0.3)',
    shadow: 'rgba(159, 91, 145, 0.3)'
  },
  horror: {
    gradient1: 'rgba(84,0,0,1)',
    gradient2: 'rgba(0,0,0,1)',
    text: 'rgba(183, 28, 28, 1)',
    font: "'Creepster', cursive",
    fontSize: '1.1rem',
    highlight: 'rgba(129, 20, 20, 0.3)',
    shadow: 'rgba(20, 0, 0, 0.2)'
  },
  thriller: {
    gradient1: 'rgba(183,28,28,1)',
    gradient2: 'rgba(114,12,12,1)',
    text: 'rgba(11, 12, 16, 1)',
    font: "'Oswald', sans-serif",
    fontSize: '1.2rem',
    highlight: 'rgba(238, 75, 75, 0.3)',
    shadow: 'rgba(113, 8, 8, 0.3)'
  },
  mystery: {
    gradient1: 'rgba(40,90,148,1)',
    gradient2: 'rgba(38,37,39,1)',
    text: 'rgba(217, 217, 217, 0.7)',
    font: "'Roboto Slab', serif",
    fontSize: '1.2rem',
    highlight: 'rgba(105, 157, 217, 0.3)',
    shadow: 'rgba(6, 39, 78, 0.3)'
  },
  sciencefiction: {
    gradient1: 'rgba(0,0,34,1)',
    gradient2: 'rgba(106,77,105,1)',
    text: 'rgba(0, 176, 255, 1)',
    font: "'Orbitron', sans-serif",
    fontSize: '1.1rem',
    highlight: 'rgba(16, 16, 90, 0.5)',
    shadow: 'rgb(0, 0, 0)'
  },
  nonfiction: {
    gradient1: 'rgb(217, 217, 217)',
    gradient2: 'rgba(137,154,187,1)',
    text: 'rgba(51, 51, 51, 1)',
    font: "'Lato', sans-serif",
    fontSize: '1rem',
    highlight: 'rgba(255,255,255,0.3)',
    shadow: 'rgb(156, 156, 156, 0.3)'
  },
  fiction: {
    gradient1: 'rgba(182,198,163,1)',
    gradient2: 'rgba(53,105,83,1)',
    text: 'rgba(51, 51, 51, 1)',
    font: "'Merriweather', serif",
    fontSize: '1.1rem',
    highlight: 'rgba(229, 233, 224, 0.3)',
    shadow: 'rgba(82, 102, 56, 0.3)'
  },
  biography: {
    gradient1: 'rgba(255,240,232,1)',
    gradient2: 'rgba(166,137,133,1)',
    text: 'rgba(87, 57, 57, 1)',
    font: "'Georgia', serif",
    fontSize: '1.1rem',
    highlight: 'rgba(255, 255, 255, 0.5)',
    shadow: 'rgba(185, 152, 134, 0.3)'
  },
  feelgood: {
    gradient1: 'rgba(255,239,190,1)',
    gradient2: 'rgba(255,197,110,1)',
    text: 'rgba(96, 89, 73, 1)',
    font: "'Pacifico', cursive",
    fontSize: '1.1rem',
    highlight: 'rgba(255, 255, 255, 0.5)',
    shadow: 'rgba(179, 156, 89, 0.3)'
  },
  poetry: {
    gradient1: 'rgba(132,183,196,1)',
    gradient2: 'rgba(42,91,82,1)',
    text: 'rgba(51, 51, 51, 1)',
    font: "'Poiret One', cursive",
    fontSize: '1.1rem',
    highlight: 'rgba(215, 247, 255, 0.3)',
    shadow: 'rgba(56, 104, 117, 0.3)'
  },
  selfhelp: {
    gradient1: 'rgba(163,217,246,0.7)',
    gradient2: 'rgba(66,75,107,1)',
    text: 'rgba(26, 30, 43, 1)',
    font: "'Montserrat', sans-serif",
    fontSize: '1.1rem',
    highlight: 'rgba(231, 243, 249, 0.3)',
    shadow: 'rgba(72, 135, 169, 0.3)'
  }
};