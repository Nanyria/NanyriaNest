import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserNavComponent } from '../Users/user-nav/user-nav.component';
import { AdminNavComponent } from '../admin/admin-nav/admin-nav.component';
import { AuthService } from '../../Services/auth.service';
import { ILoggedInUser } from '../../Models/interfaces';
@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  imports: [CommonModule, RouterModule, UserNavComponent, AdminNavComponent ],
})
export class NavComponent {
  currentUrl = '';
  currentUser: ILoggedInUser | null = null;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentUrl = event.urlAfterRedirects;
      });

    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  get isAdmin(): boolean {
    return !!this.currentUser?.adminRole || !!this.currentUser?.isSuperAdmin;
  }
}