import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginobj: any = {
    email: '',
    password: ''
  }

  router = inject(Router);

  onLogin() {
    if (this.loginobj.email === "admin@gmail.com" && this.loginobj.password === "admin123") {
      alert('Login successful!');
      localStorage.setItem('enquiryApp', 'admin');

      this.router.navigate(['/enquiry-list']);
    } else {
      alert('Invalid email or password. Please try again.');
    }
  }
}
