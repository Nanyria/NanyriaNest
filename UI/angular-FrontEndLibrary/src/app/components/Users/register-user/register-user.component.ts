import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserActionsService } from "../../../Services/user-actions.service";
import { CreateUserDto } from "../../../Models/interfaces";
@Component({
  selector: "app-register-user",
  templateUrl: "./register-user.component.html",
  standalone: true,
  styleUrls: ["./register-user.component.css"],
  imports: [FormsModule, CommonModule]
})
export class RegisterUserComponent {
  user: CreateUserDto = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  registrationSuccess = false;
  confirmPassword: string = '';
  constructor(private userActionsService: UserActionsService) {}

  registerUser() {
    this.userActionsService.addUser(this.user).subscribe({
      next: (response) => {
        console.log("User registered successfully:", response);
        this.registrationSuccess = true;
      },
      error: (error) => {
        console.error("Error registering user:", error);
      }
    });
  }
  passwordValid(): boolean {
  const pw = this.user.password;
  // Example: at least 8 chars, one uppercase, one digit
  return pw.length >= 8 &&
         /[A-Z]/.test(pw) &&
         /\d/.test(pw);
}
}
