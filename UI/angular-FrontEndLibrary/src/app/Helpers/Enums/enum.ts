export enum BookStatusEnum {
    Available,
    Reserved,
    CheckedOut,
    Returned,
    Overdue,
}

export const BookStatusDisplayNames: { [key in BookStatusEnum]: string } = {
    [BookStatusEnum.Available]: 'Tillgänglig',
    [BookStatusEnum.Reserved]: 'Reserverad',
    [BookStatusEnum.CheckedOut]: 'Utlånad',
    [BookStatusEnum.Returned]: 'Återlämnad',
    [BookStatusEnum.Overdue]: 'Försenad',
};
export enum GenreEnums {
    None,
    Fantasy,
    Children,
    Romance,
    Horror,
    Thriller,
    Mystery,
    ScienceFiction,
    NonFiction,
    Fiction,
    Biography,
    FeelGood,
    Poetry,
    SelfHelp,
    All,
}

export const GenreDisplayNames: Record<GenreEnums, string> = {
    [GenreEnums.All]: 'Alla böcker',
    [GenreEnums.None]: 'Ej satt',
    [GenreEnums.Fantasy]: 'Fantasy',
    [GenreEnums.Children]: 'Barn & Ungdom',
    [GenreEnums.Romance]: 'Romantik',
    [GenreEnums.Horror]: 'Skräck',
    [GenreEnums.Thriller]: 'Thriller',
    [GenreEnums.Mystery]: 'Deckare',
    [GenreEnums.ScienceFiction]: 'Science Fiction',
    [GenreEnums.NonFiction]: 'Facklitteratur',
    [GenreEnums.Fiction]: 'Romaner',
    [GenreEnums.Biography]: 'Biografi',
    [GenreEnums.FeelGood]: 'Feelgood',
    [GenreEnums.Poetry]: 'Poesi',
    [GenreEnums.SelfHelp]: 'Självhjälp',
};
export enum BookTypeEnums {
    Undefined,
    Paperback,
    Hardcover,
    EBook,
    Audiobook,
}

export const BookTypeDisplayNames: { [key in BookTypeEnums]: string } = {
    [BookTypeEnums.Undefined]: 'Ospecificerad',
    [BookTypeEnums.Paperback]: 'Pocket',
    [BookTypeEnums.Hardcover]: 'Inbunden',
    [BookTypeEnums.EBook]: 'E-bok',
    [BookTypeEnums.Audiobook]: 'Ljudbok',
}