import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ILoggedInUser } from '../../../Models/interfaces';
import { WebIconsComponent } from '../../../../assets/images/webpage-images/web-icons.component';
@Component({
  selector: 'app-user-nav',
  standalone: true,
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css'],
  imports: [CommonModule, RouterModule, WebIconsComponent]
})
export class UserNavComponent {
  @Output() navOpenChange = new EventEmitter<boolean>();
  @Input() currentUrl: string = '';
  @Input() hasNewNotification: boolean = true; // <-- Add this line
  @Input() user: ILoggedInUser | null = null; // <-- Add this line
  userNavOpen = false;

  constructor(private router: Router) {}

  toggleNav() {
    this.userNavOpen = !this.userNavOpen;
    this.navOpenChange.emit(this.userNavOpen);
  }
  logout() {
    // Adjust this to use your AuthService if needed
    localStorage.clear();
    this.router.navigate(['']);
  }
  isActive(path: string): boolean {
    return this.currentUrl.includes(path);
  }
}
