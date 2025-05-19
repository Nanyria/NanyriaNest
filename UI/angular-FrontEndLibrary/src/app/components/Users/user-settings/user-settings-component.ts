import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ILoggedInUser } from '../../../Models/interfaces';
import { AuthService } from '../../../Services/auth.service';
import { UserActionsService } from '../../../Services/user-actions.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  templateUrl: './user-settings-component.html',
  styleUrls: ['./user-settings-component.css'],
  imports: [CommonModule, FormsModule]
})
export class UserSettingsComponent  {
  editMode = false;
  changePasswordMode = false;
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  user: ILoggedInUser | null = null;

  constructor(
    private authService: AuthService,
    private userActionsService: UserActionsService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  submitPasswordChange() {
    if (!this.user) return;
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      alert('Alla fält måste fyllas i.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      alert('Nya lösenorden matchar inte.');
      return;
    }

    // Prepare the update payload
    const updatePayload = {
      userId: this.user!.userId,
      Password: this.newPassword,
      ldPassword: this.oldPassword,
    };

    this.userActionsService.updateUser(this.user!.userId, updatePayload).subscribe({
      next: () => {
        alert('Lösenordet har ändrats!');
        this.changePasswordMode = false;
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: () => {
        alert('Kunde inte ändra lösenordet.');
      }
    });
  }

  submitNameChange() {
    if (!this.user) return;
    if (!this.user.firstName || !this.user.lastName) {
      alert('Förnamn och efternamn måste fyllas i.');
      return;
    }

    const updatePayload = {
      userId: this.user.userId,
      firstName: this.user.firstName,
      lastName: this.user.lastName
    };

    this.userActionsService.updateUser(this.user.userId, updatePayload).subscribe({
      next: () => {
        alert('Namn har uppdaterats!');
        this.editMode = false;
      },
      error: () => {
        alert('Kunde inte uppdatera namn.');
      }
    });
  }
}
