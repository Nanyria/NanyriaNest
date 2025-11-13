import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  ILoggedInUser, UserDto,  } from '../../../Models/interfaces';

import { BookStatusEnum, BookStatusDisplayNames ,GenreEnums, GenreDisplayNames, BookTypeEnums, BookTypeDisplayNames } from '../../../Helpers/Enums/enum';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserListComponent {
  @Input() users: UserDto[] = [];
  @Input() currentUserId!: string; 
  @Input() user!: ILoggedInUser; 
  @Input() editUser: UserDto | null = null;
  @Output() onEdit = new EventEmitter<UserDto>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onUpdateStatus = new EventEmitter<{
    bookId: string;
    userId: string;
    bookStatus: BookStatusEnum;
  }>();
  @Output() onSave = new EventEmitter<UserDto>();
  @Output() onCancel = new EventEmitter<void>();
  roleOptions = [
    { value: 'Användare', label: 'Användare' },
    { value: 'Administratör', label: 'Administratör' },
    { value: 'SuperAdmin', label: 'Super Admin' }
  ];

  isSuperAdmin: boolean = false;
  ngOnInit() {
    console.log('UserListComponent initialized');
    console.log('Users received:', this.users);
    if (this.user?.isSuperAdmin) {
      this.isSuperAdmin = true;
    }
  }
  editUserDetails(user: UserDto) {
    this.onEdit.emit(user);
  }

  deleteUser(userID: string) {
    this.onDelete.emit(userID);
  }

  saveUser(user: UserDto) {
    this.onSave.emit(user);
  }

  cancelEdit() {
    this.onCancel.emit();
  }

  getRoleLabel(roleValue: string): string {
    const found = this.roleOptions.find(r => r.value === roleValue);
    return found ? found.label : roleValue;
  }
}