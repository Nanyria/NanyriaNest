import { Component, Input } from '@angular/core';

import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-nav',
  standalone: true,
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css'],
  imports: [RouterModule],
})
export class AdminNavComponent {
  @Input() currentUrl: string = '';
  adminNavOpen = false;

  toggleNav() {
    this.adminNavOpen = !this.adminNavOpen;
  }

  isActive(path: string): boolean {
    return this.currentUrl.includes(path);
  }
}
