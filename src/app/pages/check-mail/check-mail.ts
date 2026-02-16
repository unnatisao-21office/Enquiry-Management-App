import { Component } from '@angular/core';

@Component({
  selector: 'app-check-mail',
  imports: [],
  templateUrl: './check-mail.html',
  styleUrl: './check-mail.css',
})
export class CheckMail {
  public goToLogin() {
    window.location.href = '/login';
  }
}
