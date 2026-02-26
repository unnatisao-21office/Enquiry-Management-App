import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-enquiries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-enquiries.html',
  styleUrl: './recent-enquiries.css',
})
export class RecentEnquiries {
  @Input() public recentEnquiries: any[] = [];
}
