import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-readlist',
  standalone: true,
  templateUrl: './user-readlist-component.html',
  styleUrls: ['./user-readlist-component.css'],
  imports: [CommonModule, FormsModule]
})
export class UserReadlistComponent implements OnInit {

  editMode = false;

  constructor(
  ) {}

ngOnInit(): void {

    }
}
