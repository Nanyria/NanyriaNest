import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  templateUrl: './user-settings-component.html',
  styleUrls: ['./user-settings-component.css'],
  imports: [CommonModule, FormsModule]
})
export class UserSettingsComponent implements OnInit {

  editMode = false;

  constructor(
  ) {}

ngOnInit(): void {

    }
}
