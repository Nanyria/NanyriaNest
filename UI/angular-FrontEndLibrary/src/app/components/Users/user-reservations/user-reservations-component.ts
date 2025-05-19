import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  templateUrl: './user-reservations-component.html',
  styleUrls: ['./user-reservations-component.css'],
  imports: [CommonModule, FormsModule]
})
export class UserReservationsComponent implements OnInit {
  reservedBooks: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.reservedBooks = user?.reservedBooks || [];
    });
  }
}
