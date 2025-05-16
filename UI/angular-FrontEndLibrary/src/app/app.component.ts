//app.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LibraryService } from './Services/library.services';
import { Book } from './Models/interfaces';
import { HeaderComponent } from './components/header/header.component';
import { NavComponent } from './components/nav/nav.component';
import { FormsModule } from '@angular/forms'; // <-- Import this
import { AuthService } from './Services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html', // Split into a separate HTML file
  styleUrls: ['./app.component.css'],  // Split into a separate CSS file
  imports: [
    CommonModule,
    RouterModule, // Import RouterModule without forRoot
    NavComponent,
    HeaderComponent,
    FormsModule, // <-- Add this
  ]
})
export class AppComponent {
  title = 'angular-FrontEndLibrary';

  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
