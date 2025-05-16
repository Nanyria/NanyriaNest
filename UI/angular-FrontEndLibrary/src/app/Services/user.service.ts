import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7291/api/User'; // Base URL for the User API

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<{ isSuccess: boolean; result: User[] }> {
    return this.http.get<{ isSuccess: boolean; result: User[] }>(this.apiUrl);
  }

  // Get user by ID
  getUserById(userId: string): Observable<{ isSuccess: boolean; result: User }> {
    return this.http.get<{ isSuccess: boolean; result: User }>(`${this.apiUrl}/${userId}`);
  }

  // Add a new user
  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Create an admin user
  createAdminUser(adminUser: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-admin`, adminUser);
  }

  // Update a user as an admin
  updateUserAsAdmin(userId: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateAsAdmin/${userId}`, user);
  }

  // Delete a user
  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }
}