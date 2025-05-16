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
    History,
    Poetry,
    SelfHelp,
}

export const GenreDisplayNames: { [key in GenreEnums]: string } = {
    [GenreEnums.None]: 'Ingen',
    [GenreEnums.Fantasy]: 'Fantasy',
    [GenreEnums.Children]: 'Barnböcker',
    [GenreEnums.Romance]: 'Romantik',
    [GenreEnums.Horror]: 'Skräck',
    [GenreEnums.Thriller]: 'Thriller',
    [GenreEnums.Mystery]: 'Deckare',
    [GenreEnums.ScienceFiction]: 'Science Fiction',
    [GenreEnums.NonFiction]: 'Facklitteratur',
    [GenreEnums.Fiction]: 'Skönlitteratur',
    [GenreEnums.Biography]: 'Biografi',
    [GenreEnums.History]: 'Historia',
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