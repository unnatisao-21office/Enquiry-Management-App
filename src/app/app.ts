import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  protected readonly title = signal('enquirymanagement');
  private router = inject(Router);

  isLoggedIn(): boolean {
    return localStorage.getItem('enquiryApp') === 'admin';
  }

  logout(): void {
    localStorage.removeItem('enquiryApp');
    this.router.navigate(['/login']);
  }
}
