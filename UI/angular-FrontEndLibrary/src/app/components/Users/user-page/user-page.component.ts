import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserActionsService } from '../../../Services/user-actions.service';
import { AuthService } from '../../../Services/auth.service';
import { ILoggedInUser } from '../../../Models/interfaces';
import { CardComponent } from '../../card/card.component';
import { UserSettingsComponent } from '../user-settings/user-settings-component';
import { UserReservationsComponent } from '../user-reservations/user-reservations-component';
import { UserReadlistComponent } from '../user-readlist/user-readlist-component';
import { UserCheckoutsComponent } from '../user-checkouts/user-checkouts-component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-page',
  standalone: true,
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    RouterModule
  ]
})
export class UserPageComponent implements OnInit {
  user: ILoggedInUser | null = null;
  borrowedBooks: any[] = [];
  reservedBooks: any[] = [];
  readList: any[] = [];
  editMode = false;

  @ViewChild(UserReadlistComponent) readlistComp?: UserReadlistComponent;
  @ViewChild(UserSettingsComponent) settingsComp?: UserSettingsComponent;

  constructor(
    private userService: UserActionsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }


  loadUserData(userId: string) {

    this.userService.getBorrowedBooks(userId).subscribe(data => this.borrowedBooks = data);
    this.userService.getReservedBooks(userId).subscribe(data => this.reservedBooks = data);
  }

  updateUserInfo() {
    const userId = this.authService.getUserId();
    if (this.user && userId) {
      this.userService.updateUser(userId, this.user).subscribe(updated => {
        this.user = updated;
        this.editMode = false;
      });
    }
  }

  refreshReadlist() {
    // this.readlistComp?.refresh();
  }
}