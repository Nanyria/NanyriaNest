import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { ILoggedInUser } from '../../../Models/interfaces';
import {
  ADMIN_NAV,
  MAIN_NAV,
  NavGroup,
  NavItem,
  isNavGroup,
} from '../nav-items';

// Drawer with the main navigation, used on screens too narrow for the topbar menu
@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule, NgTemplateOutlet],
})
export class SidebarComponent {
  @Output() navigate = new EventEmitter<void>();
  currentUser: ILoggedInUser | null = null;

  // Plain links first, then each dropdown of the topbar as its own section
  readonly mainItems: NavItem[] = MAIN_NAV.filter(
    (entry): entry is NavItem => !isNavGroup(entry),
  );
  readonly groups: NavGroup[] = MAIN_NAV.filter(isNavGroup);
  readonly adminGroup = ADMIN_NAV;

  constructor(private authService: AuthService) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  get isAdmin(): boolean {
    return !!this.currentUser?.adminRole || !!this.currentUser?.isSuperAdmin;
  }
}
