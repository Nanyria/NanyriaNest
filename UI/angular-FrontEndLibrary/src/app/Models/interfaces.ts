import {
  GenreEnums,
  BookStatusEnum,
  BookTypeEnums,
} from '../Helpers/Enums/enum';

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
  availabilityDate: Date;

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
  availabilityDate?: Date;

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

export interface ILoggedInUser {
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
  reviews: ReviewItemDto[];
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
export interface CreateRatingItemDto {
  rating: number;
  createdAt?: string;
}
export interface CreateReviewItemDto {
  userId: string;
  bookId: number;
  reviewHeader?: string;
  reviewText?: string;
  ratingItem?: CreateRatingItemDto;
  createdAt?: string; // ISO string, will default to now if not provided
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
export interface ReviewItemDto {
  id: string;
  userId: string;
  bookId: string;
  BookDto: Book;
  reviewHeader: string;
  reviewText: string;
  ratingItem: RatingItemDto;
  createdAt: Date;
}

export interface RatingItemDto {
  id: string;
  reviewItemId: string;
  rating: number;
  createdAt: Date;
}

export interface INavlink {
  name: string;
  route: string;
}
