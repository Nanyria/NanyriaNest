import { GenreEnums, BookStatusEnum, BookTypeEnums } from '../..//Helpers/Enums/enum';
import { StatusHistoryItem, ReservationItem, CheckedOutItem } from './joint-interfaces';
// Book interfaces
export interface Book {
    bookId: string;
    title: string;
    author: string;
    genre: GenreEnums; 
    publicationYear: string; 
    bookDescription?: string; 
    coverImagePath?: string;
    bookStatus: BookStatusEnum; 
    bookType: BookTypeEnums;

    reviews?: string[];
    statusHistory: StatusHistoryItem[]; 
    reservations: ReservationItem[]; 
    checkedOutBy?: CheckedOutItem; 
}
export interface BookDto {
    title: string;
    author: string;
    genre: GenreEnums;
    publicationYear: string;
    bookDescription?: string;
    bookType?: BookTypeEnums;
    coverImagePath?: string;
  }
  