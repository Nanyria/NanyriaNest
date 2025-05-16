import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserActionsService {
  private apiUrl = 'https://localhost:7291/api/UserActions'; // Base URL for the User API

  constructor(private http: HttpClient) {}

  // Borrow a book
  borrowBook(userId: string, bookId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/borrow/${userId}/${bookId}`, {});
  }

  // Reserve a book
  reserveBook(userId: string, bookId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reserve/${userId}/${bookId}`, {});
  }

  // Unreserve a book
  unreserveBook(userId: string, bookId: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/unreserve/${userId}/${bookId}`,
      {},
    );
  }

  // Return a book
  returnBook(userId: string, bookId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/return/${userId}/${bookId}`, {});
  }

  // To add - list of borrowed books
  getBorrowedBooks(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/borrowed/${userId}`);
  }

  // To add - list of reserved books
  getReservedBooks(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reserved/${userId}`);
  }

  updateUser(userId: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${userId}`, user);
  }
}
