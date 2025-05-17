import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserActionsService } from '../../../Services/user-actions.service';
import { AuthService } from '../../../Services/auth.service';
import { User } from '../../../Models/interfaces';
import { CardComponent } from '../../card/card.component';
import { UserSettingsComponent } from '../user-settings/user-settings-component';
import { UserReservationsComponent } from '../user-reservations/user-reservations-component';
import { UserReadlistComponent } from '../user-readlist/user-readlist-component';
import { UserCheckoutsComponent } from '../user-checkouts/user-checkouts-component';


@Component({
  selector: 'app-user-page',
  standalone: true,
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    UserSettingsComponent,
    UserReservationsComponent,
    UserReadlistComponent,
    UserCheckoutsComponent
  ]
})
export class UserPageComponent implements OnInit {
  user: User | null = null;
  borrowedBooks: any[] = [];
  reservedBooks: any[] = [];
  editMode = false;
  selectedSection: 'messages' |'settings' | 'readlist' | 'reservations' | 'checkouts' = 'settings';

  constructor(
    private userService: UserActionsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId(); 
    if (userId) {
      this.loadUserData(userId);
    }
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
}