import { DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd} from '@angular/router';
import { filter } from 'rxjs/operators';
type AppRole = 'admin' | 'user' | null;
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly themeStorageKey = 'enquiryTheme';
  public isDarkMode = true;
  public role: AppRole = null;

  public ngOnInit(): void {
    const storedTheme = localStorage.getItem(this.themeStorageKey);
    this.isDarkMode = storedTheme !== 'light';
    this.applyTheme(this.isDarkMode);

    this.syncRole();
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.syncRole());
  }

  private syncRole(): void {
    this.role = this.getRoleFromStorage();
  }

  public isLoggedIn(): boolean {
    return this.role !== null;
  }

  public isAdmin(): boolean {
    return this.role === 'admin';
  }

  public isUser(): boolean {
    return this.role === 'user';
  }


  public logout(): void {
    localStorage.removeItem('enquiryApp');
    this.router.navigate(['/login']);
    this.role = null;
  }


  public toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode);
    localStorage.setItem(this.themeStorageKey, this.isDarkMode ? 'dark' : 'light');
  }
  private applyTheme(isDarkMode: boolean): void {
    this.document.body.classList.toggle('light-mode', !isDarkMode);
  }

  private getRoleFromStorage(): AppRole {
    const raw = localStorage.getItem('enquiryApp');
    if (raw === 'admin') {
      return 'admin';
    } else if (raw === 'user') {
      return 'user';
    }
    return null;
  }
}
