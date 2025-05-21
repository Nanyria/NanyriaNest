import { GenreEnums, BookStatusEnum, BookTypeEnums } from '../Helpers/Enums/enum';

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



// User interfaces
// export interface User {
//     id?: string;
//     userId: string;
//     userName: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     bio: string;
//     profilePictureUrl?: string;
//     checkedOutBooks: CheckedOutItem[];
//     reservedBooks: ReservationItem[];
//     userHistory: StatusHistoryItem[];
//     readList: FavoriteItem[];
//     adminRole?: boolean;
//     isSuperAdmin: boolean;
// }

export interface ILoggedInUser{
    id?: string;
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    profilePictureUrl?: string;
    bio: string;

    readList: FavoriteItem[];
    reviews: ReviewItem[];
    checkedOutBooks: CheckedOutItem[];
    reservedBooks: ReservationItem[];
    userHistory: StatusHistoryItem[];
    notifications: NotificationItem[];
    adminRole?: boolean;
    isSuperAdmin: boolean;
}

export interface UserHistory {
    userHistoryId: string;
    userId: string;
    user: ILoggedInUser;
    bookId: string;
    book: Book;
    action: BookStatusEnum;
    timestamp: Date;
    notes?: string;
}
export interface NotificationItem {
    notificationId: string;
    userId: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}


  //Joint interfaces
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

export interface FavoriteItem {
    id: number;
    userId: string;
    bookId: number;
    createdAt: string; // ISO string (DateTime in C#)
}
export interface ReviewItem {
    reviewId: string;
    userId: string;
    bookId: string;
    reviewHeader: string;
    reviewText: string;
    ratingItem: RatingItem;
    createdAt: Date;
}
export interface RatingItem {
    ratingId: string;
    reviewItemId: string;
    Rating: number;
    CreatedAt: Date;
}

export interface INavlink {
    name: string;
    route: string;
}