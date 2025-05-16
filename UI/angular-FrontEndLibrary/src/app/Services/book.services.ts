//book.services.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookDto, StatusHistoryItem } from '../Models/interfaces';
import { BookStatusEnum } from './Enums/enum.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'https://localhost:7291/api/Book';

  constructor(private http: HttpClient) {}

  getBookById(bookID: string): Observable<{ isSuccess: boolean; result: Book }> {
    return this.http.get<{ isSuccess: boolean; result: Book }>(`${this.apiUrl}/${bookID}`);
  }

  addBook(book: BookDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, book);
  }

  updateBook(bookID: string, updatedBook: BookDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${bookID}`, updatedBook);
  }

  updateBookStatus(
    bookID: string,
    userID: string,
    bookStatus: BookStatusEnum,
    notes?: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('userId', userID.toString())
      .set('bookStatus', bookStatus)
      .set('notes', notes || '');

    return this.http.put<any>(`${this.apiUrl}/status/${bookID}`, {}, { params });
  }

  deleteBook(bookID: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${bookID}`);
  }

  getBookHistory(bookID: string): Observable<{ isSuccess: boolean; result: StatusHistoryItem[] }> {
    return this.http.get<{ isSuccess: boolean; result: StatusHistoryItem[] }>(
      `${this.apiUrl}/history/${bookID}`
    );
  }

}
