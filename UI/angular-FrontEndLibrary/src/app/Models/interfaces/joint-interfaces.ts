import { GenreEnums, BookStatusEnum, BookTypeEnums } from '../../Helpers/Enums/enum';


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