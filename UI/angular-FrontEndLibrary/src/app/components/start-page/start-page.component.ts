import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../Users/login-page/login.component';
import { RegisterUserComponent } from '../Users/register-user/register-user.component';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterUserComponent],
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent {
  showRegister = false;
}