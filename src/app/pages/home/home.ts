import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private readonly router: Router) { }

  public navigateToSubmitEnquiry() {
    this.router.navigate(['/submit-enquiry']);
  }
  public navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
