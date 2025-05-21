import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserActionsService } from '../../../Services/user-actions.service';
import { AuthService } from '../../../Services/auth.service';
import { ILoggedInUser } from '../../../Models/interfaces';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ManageBooksComponent } from '../manage-books/manage-books.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
@Component({
  selector: 'app-admin-page',
  standalone: true,
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class AdminPageComponent implements OnInit {
  user: ILoggedInUser | null = null;
  editMode = false;
  hasNewNotification = false;
  currentUrl: string = '';
  @ViewChild(ManageBooksComponent) manageBooksComp?: ManageBooksComponent;
  @ViewChild(ManageUsersComponent) manageUsersComp?: ManageUsersComponent;
  constructor(
    private userService: UserActionsService,
    private authService: AuthService,
    private router: Router, // <-- inject Router
    private route: ActivatedRoute
  ) {
    // Subscribe to router events to update currentUrl
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User:', this.user);
    });
        this.currentUrl = this.router.url;
  }
}
