import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoggedInUser, CreateUserDto } from '../Models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
private apiUrl = 'api/User'; // Base URL for the User API

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<{ isSuccess: boolean; result: ILoggedInUser[] }> {
    return this.http.get<{ isSuccess: boolean; result: ILoggedInUser[] }>(this.apiUrl);
  }

  // Get user by ID
  getUserById(userId: string): Observable<{ isSuccess: boolean; result: ILoggedInUser }> {
    return this.http.get<{ isSuccess: boolean; result: ILoggedInUser }>(`${this.apiUrl}/${userId}`);
  }

  // Add a new user
  addUser(user: CreateUserDto): Observable<any> {
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