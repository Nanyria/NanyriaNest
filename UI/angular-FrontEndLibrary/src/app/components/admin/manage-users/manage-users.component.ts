import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ManageUsersComponent implements OnInit {

  editMode = false;

  constructor(
  ) {}

ngOnInit(): void {

    }
}
