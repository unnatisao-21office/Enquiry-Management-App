import { DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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

  public ngOnInit(): void {
    const storedTheme = localStorage.getItem(this.themeStorageKey);
    this.isDarkMode = storedTheme !== 'light';
    this.applyTheme(this.isDarkMode);
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('enquiryApp') === 'admin';
  }

  public logout(): void {
    localStorage.removeItem('enquiryApp');
    this.router.navigate(['/login']);

  }

  public toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode);
    localStorage.setItem(this.themeStorageKey, this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme(isDarkMode: boolean): void {
    const body = this.document.body;
    body.classList.toggle('light-mode', !isDarkMode);
  }
}
