import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule], // <-- Add FormsModule and CommonModule here
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        // Login successful, redirect or update UI
        this.router.navigate(['/']); // Redirect to home or dashboard
      },
      error: () => {
        // Handle login error
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}