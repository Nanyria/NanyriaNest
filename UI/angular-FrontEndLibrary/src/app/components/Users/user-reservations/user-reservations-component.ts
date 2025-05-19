import { Component, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ILoggedInUser } from '../../../Models/interfaces';

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  templateUrl: './user-reservations-component.html',
  styleUrls: ['./user-reservations-component.css'],
  imports: [CommonModule, FormsModule]
})
export class UserReservationsComponent implements OnInit {
@Input() reservedBooks: any[] = [];
  editMode = false;

  constructor(
  ) {}

ngOnInit(): void {

    }
}
