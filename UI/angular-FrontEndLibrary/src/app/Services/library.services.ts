
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book} from '../Models/interfaces';


@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private apiUrl = 'api/Library';

  constructor(private http: HttpClient) {}

getAllBooks(): Observable<{ isSuccess: boolean; result: Book[] }> {
  return this.http.get<{ isSuccess: boolean; result: Book[] }>(this.apiUrl);
}


  getBooksByTitle(title: string): Observable<{ isSuccess: boolean; result: Book[] }> {
    return this.http.get<{ isSuccess: boolean; result: Book[] }>(`${this.apiUrl}/title/${title}`);
  }

  getBooksByAuthor(author: string): Observable<{ isSuccess: boolean; result: Book[] }> {
    return this.http.get<{ isSuccess: boolean; result: Book[] }>(`${this.apiUrl}/author/${author}`);
  }


  getBooksByGenre(genre: string, sortBy: string = 'Title', ascending: boolean = true): Observable<{ isSuccess: boolean; result: Book[] }> {
  const params = new HttpParams()
    .set('sortBy', sortBy)
    .set('ascending', ascending.toString());

    return this.http.get<{ isSuccess: boolean; result: Book[] }>(
      `${this.apiUrl}/booksbygenre/${genre}`,
      { params }
    );
  }
  
    getBookReviews(bookId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/review/${bookId}`);
  }
}
