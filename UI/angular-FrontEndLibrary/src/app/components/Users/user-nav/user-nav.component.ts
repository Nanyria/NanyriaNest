import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-user-nav',
  standalone: true,
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css'],
  imports: [CommonModule, RouterModule]
})
export class UserNavComponent {
  @Input() currentUrl: string = '';
  @Input() hasNewNotification: boolean = false; // <-- Add this line
  userNavOpen = false;

  constructor(private router: Router) {}

  toggleNav() {
    this.userNavOpen = !this.userNavOpen;
  }
  logout() {
    // Adjust this to use your AuthService if needed
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  isActive(path: string): boolean {
    return this.currentUrl.includes(path);
  }
}
