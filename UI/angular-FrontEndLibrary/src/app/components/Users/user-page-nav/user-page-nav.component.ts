import { Component, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ILoggedInUser } from '../../../Models/interfaces';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-user-page-nav',
  standalone: true,
  templateUrl: './user-page-nav.component.html',
  styleUrls: ['./user-page-nav.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class UserPageNavComponent implements OnInit {
  @Input() currentUrl: string = '';
  @Input() hasNewNotification: boolean = false;
  editMode = false;

  constructor(
  ) {}

ngOnInit(): void {

    }
      isActive(path: string): boolean {
    return this.currentUrl.includes(path);
  }
}
