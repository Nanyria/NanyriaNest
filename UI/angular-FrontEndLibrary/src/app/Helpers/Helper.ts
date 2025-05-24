import { BookTypeEnums, BookTypeDisplayNames, BookStatusEnum, BookStatusDisplayNames, GenreEnums, GenreDisplayNames } from './Enums/enum';

export const BookTypeOptions = {
  displayNames: BookTypeDisplayNames,
  values: Object.values(BookTypeEnums).filter(v => typeof v === 'number') as BookTypeEnums[]
};

export const BookStatusOptions = {
  displayNames: BookStatusDisplayNames,
  values: Object.values(BookStatusEnum).filter(v => typeof v === 'number') as BookStatusEnum[]
};

export const GenreOptions = {
  displayNames: GenreDisplayNames,
  values: Object.values(GenreEnums).filter(v => typeof v === 'number') as GenreEnums[]
};