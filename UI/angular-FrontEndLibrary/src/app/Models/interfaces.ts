import { GenreEnums, BookStatusEnum, BookTypeEnums } from '../Services/Enums/enum.service';

// Book interfaces
export interface Book {
    bookID: string;
    title: string;
    author: string;
    genre: GenreEnums; 
    publicationYear: string; 
    bookDescription?: string; 
    statusHistory: StatusHistoryItem[]; 
    bookStatus: BookStatusEnum; 
    bookType: BookTypeEnums;
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
  }

export interface StatusHistoryItem {
    statusHistoryItemID: string;
    bookID: string; 
    userID?: string; 
    bookStatus: BookStatusEnum; 
    timestamp?: Date; 
    notes?: string; 
}

export interface ReservationItem {
    id: string; 
    userID: string; 
    bookID: string; 
    reservationDate: Date; 
    availabilityDate?: Date; 
    bookIsAvailableEmailSent?: Date; 
}

export interface CheckedOutItem {
    id: string; 
    userID: string; 
    bookID: string; 
    checkOutDate: Date; 
    reminderEmailSent?: Date; 
}

// User interfaces
export interface User {
    userID: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    checkedOutBooks: CheckedOutItem[];
    reservedBooks: ReservationItem[];
    userHistory: StatusHistoryItem[];
    adminRole?: string;
}

export interface ILoggedInUser{
    userID: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    adminRole?: string;
    isSuperAdmin: boolean;
}

export interface UserHistory {
    userHistoryID: string;
    userID: string;
    user: User;
    bookID: string;
    book: Book;
    action: BookStatusEnum;
    timestamp: Date;
    notes?: string;
}