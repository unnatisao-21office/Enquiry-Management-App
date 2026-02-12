import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private router: Router) { }

  navigateToSubmitEnquiry() {
    this.router.navigate(['/submit-enquiry']);
  }
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
