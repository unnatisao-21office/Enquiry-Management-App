import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.css',
})
export class DashboardHeader {
  public enquiries: any[] = [];
  public totalEnquiries: number = 0;
}
