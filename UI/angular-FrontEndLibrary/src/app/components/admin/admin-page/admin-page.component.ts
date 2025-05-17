import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminPageComponent implements OnInit {

  editMode = false;

  constructor(
  ) {}

ngOnInit(): void {

    }
}
