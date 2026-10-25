import { Component, ChangeDetectionStrategy } from '@angular/core';

import { LoginComponent } from '../Users/login-page/login.component';
import { RegisterUserComponent } from '../Users/register-user/register-user.component';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [LoginComponent, RegisterUserComponent],
  templateUrl: './start-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./start-page.component.css'],
})
export class StartPageComponent {
  showRegister = false;
}
