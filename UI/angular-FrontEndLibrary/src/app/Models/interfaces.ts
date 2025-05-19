import { GenreEnums, BookStatusEnum, BookTypeEnums } from '../Helpers/Enums/enum';

// Book interfaces
export interface Book {
    bookId: string;
    title: string;
    author: string;
    genre: GenreEnums; 
    publicationYear: string; 
    bookDescription?: string; 
    statusHistory: StatusHistoryItem[]; 
    bookStatus: BookStatusEnum; 
    bookType: BookTypeEnums;
    coverImagePath?: string;
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

export interface StatusHistoryItem {
    statusHistoryItemId: string;
    bookId: string; 
    userId?: string; 
    bookStatus: BookStatusEnum; 
    timestamp?: Date; 
    notes?: string; 
}

export interface ReservationItem {
    id: string; 
    userId: string; 
    bookId: string; 
    reservationDate: Date; 
    availabilityDate?: Date; 
    bookIsAvailableEmailSent?: Date; 
}

export interface CheckedOutItem {
    id: string; 
    userId: string; 
    bookId: string; 
    checkOutDate: Date; 
    reminderEmailSent?: Date; 
}

// User interfaces
export interface User {
    id?: string;
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    bio: string;
    profilePictureUrl?: string;
    checkedOutBooks: CheckedOutItem[];
    reservedBooks: ReservationItem[];
    userHistory: StatusHistoryItem[];
    readList: FavoriteItem[];
    adminRole?: boolean;
    isSuperAdmin: boolean;
}

export interface ILoggedInUser{
    id?: string;
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    bio: string;
    profilePictureUrl?: string;
    checkedOutBooks: CheckedOutItem[];
    reservedBooks: ReservationItem[];
    userHistory: StatusHistoryItem[];
    readList: FavoriteItem[];
    adminRole?: boolean;
    isSuperAdmin: boolean;
}

export interface FavoriteItem {
    id: number;
    userId: string;
    bookId: number;
    createdAt: string; // ISO string (DateTime in C#)
    user?: User;       // Optional, if you include navigation properties
    book?: Book;       // Optional, if you include navigation properties
}

export interface UserHistory {
    userHistoryId: string;
    userId: string;
    user: User;
    bookId: string;
    book: Book;
    action: BookStatusEnum;
    timestamp: Date;
    notes?: string;
}

export interface INavlink {
    name: string;
    route: string;
}