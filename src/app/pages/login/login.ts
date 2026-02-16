import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EMAIL_REGEX } from '../../constant';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
})
export class Login {
  public loginobj: any = {
    email: '',
    password: ''
  }

  private readonly router = inject(Router);

  public onLogin() {
    const trimmedEmail = this.loginobj.email.trim();
    const trimmedPassword = this.loginobj.password.trim();

    if (!trimmedEmail) {
      alert('Email is required');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!trimmedPassword) {
      alert('Password is required');
      return;
    }

    if (trimmedEmail === "admin@gmail.com" && trimmedPassword === "admin123") {
      alert('Login successful!');
      localStorage.setItem('enquiryApp', 'admin');
      this.router.navigate(['/enquiry-list']);
    } else {
      alert('Invalid email or password. Please try again.');
    }
  }

  public navigateToForgetPassword() {
    this.router.navigate(['/forget-password']);
  }
}