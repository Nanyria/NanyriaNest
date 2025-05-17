import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ManageBooksComponent implements OnInit {

  editMode = false;

  constructor(
  ) {}

ngOnInit(): void {

    }
}
