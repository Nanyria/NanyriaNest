import { Component, EventEmitter, Output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { ILoggedInUser } from '../../../Models/interfaces';

interface NavItem {
  label: string;
  icon: string;
  route?: string; // No route = placeholder for a feature without backend support
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterModule, NgTemplateOutlet],
})
export class SidebarComponent {
  @Output() navigate = new EventEmitter<void>();
  currentUser: ILoggedInUser | null = null;

  mainItems: NavItem[] = [
    { label: 'Home', icon: 'bi-house-door', route: '/home' },
    { label: 'Library', icon: 'bi-book', route: '/library' },
    { label: 'Discover', icon: 'bi-compass' },
    { label: 'Reviews', icon: 'bi-chat-left-text' },
    { label: 'Reading list', icon: 'bi-heart', route: '/user-page/readlist' },
    { label: 'Challenges', icon: 'bi-award' },
  ];

  collectionItems: NavItem[] = [
    { label: 'Borrowed books', icon: 'bi-book-half', route: '/user-page/checkouts' },
    { label: 'Reservations', icon: 'bi-bookmark', route: '/user-page/reservations' },
  ];

  adminItems: NavItem[] = [
    { label: 'Manage books', icon: 'bi-journal-plus', route: '/admin/manage-books' },
    { label: 'Manage users', icon: 'bi-people', route: '/admin/manage-users' },
  ];

  constructor(private authService: AuthService) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  get isAdmin(): boolean {
    return !!this.currentUser?.adminRole || !!this.currentUser?.isSuperAdmin;
  }
}
