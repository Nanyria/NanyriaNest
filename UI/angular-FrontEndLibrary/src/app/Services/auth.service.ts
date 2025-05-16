import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ILoggedInUser } from '../Models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7291/api/Auth';
  private tokenKey = 'auth_token';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<ILoggedInUser | null>(null);
  
  constructor(private http: HttpClient) {
        const user = this.getUserFromToken();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.authStatus.next(true);
          const user = this.getUserFromToken();
          if (user) {
            this.currentUserSubject.next(user);
          }
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStatus.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }
    getCurrentUser(): Observable<ILoggedInUser | null> {
    return this.currentUserSubject.asObservable();
  }
    getUserId(): string | null {
    const user = this.getUserFromToken();
    return user ? user.userID : null;
  }
  private getUserFromToken(): ILoggedInUser | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Map payload to ILoggedInUser as needed
      return {
        userID: payload.userID,
        userName: payload.userName,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        adminRole: payload.adminRole,
        isSuperAdmin: payload.isSuperAdmin,
        password: '', // Do not store password
      };
    } catch {
      return null;
    }
  }
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}