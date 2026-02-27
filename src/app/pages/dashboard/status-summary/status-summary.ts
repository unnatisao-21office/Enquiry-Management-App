import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-summary.html',
  styleUrl: './status-summary.css',
})
export class StatusSummary {
  @Input() public statusSummary: { name: string; count: number }[] = [];
}
