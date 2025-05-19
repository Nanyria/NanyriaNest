import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-checkouts',
  standalone: true,
  templateUrl: './user-checkouts-component.html',
  styleUrls: ['./user-checkouts-component.css'],
  imports: [CommonModule, FormsModule]
})
export class UserCheckoutsComponent implements OnInit {
  @Input() borrowedBooks: any[] = [];
  editMode = false;

  constructor(
  ) {}

ngOnInit(): void {

    }
}
