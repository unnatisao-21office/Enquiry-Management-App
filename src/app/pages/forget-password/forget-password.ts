import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-forget-password',
  imports: [RouterLink],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {
  constructor(private readonly router: Router) { }
  public goToCheckEmail() {
    this.router.navigate(['/check-email']);
  }
  public navigatetoLogin() {
    this.router.navigate(['/login']);
  }
}
