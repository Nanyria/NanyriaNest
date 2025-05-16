import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  templateUrl: './user-reservations-component.html',
  styleUrls: ['./user-reservations-component.css'],
  imports: [CommonModule, FormsModule]
})
export class UserReservationsComponent implements OnInit {

  editMode = false;

  constructor(
  ) {}

ngOnInit(): void {

    }
}
