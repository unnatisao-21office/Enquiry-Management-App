import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-summary.html',
  styleUrl: './category-summary.css',
})
export class CategorySummary {
  @Input() public categorySummary: { name: string; count: number }[] = [];
}