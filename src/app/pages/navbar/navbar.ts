import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);

  isLoggedIn(): boolean {
    return localStorage.getItem('enquiryApp') === 'admin';
  }

  logout(): void {
    localStorage.removeItem('enquiryApp');
    this.router.navigate(['/login']);
  }
}
