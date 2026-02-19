import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MasterService } from '../../../services/master-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private readonly masterService = inject(MasterService);

  public enquiries: any[] = [];
  public categories: any[] = [];
  public statuses: any[] = [];

  public totalEnquiries = 0;
  public convertedCount = 0;
  public pendingFollowUpCount = 0;
  public todayEnquiriesCount = 0;

  public statusSummary: { name: string; count: number }[] = [];
  public categorySummary: { name: string; count: number }[] = [];
  public recentEnquiries: any[] = [];

  public ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.masterService.getAllEnquiries().subscribe({
      next: (enquiryData: any) => {
        this.enquiries = Array.isArray(enquiryData) ? enquiryData : [];
        this.totalEnquiries = this.enquiries.length;
        this.convertedCount = this.enquiries.filter((enquiry) => enquiry.isConverted).length;
        this.pendingFollowUpCount = this.enquiries.filter((enquiry) => {
          const followUpDate = new Date(enquiry.followUpDate);
          return followUpDate >= new Date() && !enquiry.isConverted;
        }).length;

        const today = new Date();
        this.todayEnquiriesCount = this.enquiries.filter((enquiry) => {
          const enquiryDate = new Date(enquiry.enquiryDate);
          return enquiryDate.toDateString() === today.toDateString();
        }).length;

        this.masterService.getAllStatus().subscribe({
          next: (statusData: any[]) => {
            this.statuses = statusData;
            this.statusSummary = this.statuses.map((status) => ({
              name: status.statusName,
              count: this.enquiries.filter(
                (enquiry) => Number(enquiry.statusId) === Number(status.statusId)
              ).length,
            }));
          },
        });

        this.masterService.getAllCategory().subscribe({
          next: (categoryData: any[]) => {
            this.categories = categoryData;
            this.categorySummary = this.categories.map((category) => ({
              name: category.categoryName,
              count: this.enquiries.filter(
                (enquiry) => Number(enquiry.categoryId) === Number(category.categoryId)
              ).length,
            }));
          },
        });

        this.recentEnquiries = [...this.enquiries]
          .sort((a, b) => new Date(b.enquiryDate).getTime() - new Date(a.enquiryDate).getTime())
          .slice(0, 5);
      },
    });
  }

}
