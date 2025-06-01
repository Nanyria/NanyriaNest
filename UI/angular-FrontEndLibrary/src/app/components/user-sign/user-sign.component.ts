import { Component, Output, EventEmitter } from '@angular/core';
import { UserNavComponent } from '../Users/user-nav/user-nav.component';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ILoggedInUser } from '../../Models/interfaces';
import { AuthService } from '../../Services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-sign',
  standalone: true,
  imports: [UserNavComponent, RouterModule],
  templateUrl: './user-sign.component.html',
  styleUrl: './user-sign.component.css'
})
export class UserSignComponent {
  @Output() navOpenChange = new EventEmitter<boolean>();
  currentUrl = '';
  currentUser: ILoggedInUser | null = null;
  navOpen = false;
  
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
get hasNewNotification(): boolean {
  return !!this.currentUser?.notifications?.some(n => !n.isRead);
}
  get isAdmin(): boolean {
    return !!this.currentUser?.adminRole || !!this.currentUser?.isSuperAdmin;
  }
  onNavOpenChange(open: boolean) {
  this.navOpen = open;
  this.navOpenChange.emit(open);
}
}