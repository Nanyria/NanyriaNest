/**
 * This code was generated by Builder.io.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { BookshelfComponent } from '../bookshelf/bookshelf.component';
import { HeaderSignComponent } from '../header-sign/header-sign.component';
import { UserSignComponent } from '../user-sign/user-sign.component';
import { UserNavComponent } from '../Users/user-nav/user-nav.component';
import { BookshelfRightComponent} from "../bookshelf-right/bookshelf-right.component";
import { BookshelfLeftComponent } from '../bookshelf-left/bookshelf-left.component';
import { AdminNavComponent } from '../admin/admin-nav/admin-nav.component';
import { AuthService } from '../../Services/auth.service';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ILoggedInUser } from '../../Models/interfaces';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, NavComponent, BookshelfComponent, HeaderSignComponent, UserSignComponent, AdminNavComponent]
})
export class HeaderComponent {
    userNavOpen = false;
      currentUrl = '';
    currentUser: ILoggedInUser | null = null;

    constructor(private router: Router, private authService: AuthService) {
      this.authService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
      });
    }

  get isAdmin(): boolean {
    return !!this.currentUser?.adminRole || !!this.currentUser?.isSuperAdmin;
  }
}