import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { ILoggedInUser } from '../../../Models/interfaces';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
  imports: [RouterModule],
})
export class TopbarComponent {
  @Output() menuToggle = new EventEmitter<void>();
  currentUser: ILoggedInUser | null = null;
  userMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef,
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  get hasNewNotification(): boolean {
    return !!this.currentUser?.notifications?.some((n) => !n.isRead);
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  // Close the user menu when clicking anywhere outside the topbar
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.userMenuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.userMenuOpen = false;
  }

  logout() {
    this.userMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['']);
  }
}
