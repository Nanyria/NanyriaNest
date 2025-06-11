import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, ILoggedInUser, UserDto,  } from '../../../Models/interfaces';
import { BookStatusEnum, BookStatusDisplayNames ,GenreEnums, GenreDisplayNames, BookTypeEnums, BookTypeDisplayNames } from '../../../Helpers/Enums/enum';
import { UserService } from '../../../Services/user.service';
@Component({
  selector: 'app-manage-users',
  standalone: true,
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ManageUsersComponent implements OnInit {

  editMode = false;

  users: UserDto[] = [];
  @Input() currentUserId!: string; 
  @Input() user!: ILoggedInUser; 
  editUser: UserDto | null = null;
  roleOptions = [
    { value: 'Användare', label: 'Användare' },
    { value: 'Administratör', label: 'Administratör' },
    { value: 'SuperAdmin', label: 'Super Admin' }
  ];
  @Output() onEdit = new EventEmitter<UserDto>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onUpdateStatus = new EventEmitter<{
    bookId: string;
    userId: string;
    bookStatus: BookStatusEnum;
  }>();
  @Output() onSave = new EventEmitter<Book>();
  @Output() onCancel = new EventEmitter<void>();

  BookTypeDisplayNames = BookTypeDisplayNames;
  bookTypes = Object.values(BookTypeEnums).filter(v => typeof v === 'number') as BookTypeEnums[];
  BookStatusDisplayNames = BookStatusDisplayNames;
  bookStatuses = Object.values(BookStatusEnum).filter(v => typeof v === 'number') as BookStatusEnum[];; 
  GenreDisplayNames = GenreDisplayNames;
  genreOptions = Object.values(GenreEnums).filter(v => typeof v === 'number') as GenreEnums[];
  isSuperAdmin: boolean = false;

    constructor( private userService: UserService, 
  ) {}

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
      this.userService.getAllUsers().subscribe(
        (response: { isSuccess: boolean; result: UserDto[] }) => {
          console.log('Users fetched:', response);
          if (response.isSuccess && Array.isArray(response.result)) {
            this.users = response.result;
            console.log('Users array:', this.users);
          } else {
            this.users = [];
          }
        },
        (error) => {
          console.error("Error fetching users", error);
        this.users  = [];
      }
    );
  }

  handleFormSubmit(user: UserDto) {
    if (this.editUser) {
      this.userService.updateUserAsAdmin(this.editUser.userId, user).subscribe(() => {
        this.getAllUsers();
        this.resetForm();
      });
    } else {
      this.userService.createAdminUser(user).subscribe(() => {
        this.getAllUsers();
        this.resetForm();
      });
    }
  }

  populateForm(user: UserDto) {
    this.editUser = { ...user };
  }
  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.getAllUsers();
    });
  }
  resetForm(){
    this.editUser = null;
  }
  saveUser(user: UserDto) {
    if (this.editUser) {
      this.userService.updateUserAsAdmin(this.editUser.userId, user).subscribe(() => {
        this.getAllUsers();
        this.resetForm();
      });
    } else {
      this.userService.createAdminUser(user).subscribe(() => {
        this.getAllUsers();
        this.resetForm();
      });
    }
  }
}