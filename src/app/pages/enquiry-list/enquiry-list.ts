import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master-service';
import { IStatusModel } from '../../model/interface/status.model';
import { ICategoryModel } from '../../model/interface/category.model';

@Component({
  selector: 'app-enquiry-list',
  imports: [CommonModule],
  templateUrl: './enquiry-list.html',
  styleUrl: './enquiry-list.css',
})
export class EnquiryList implements OnInit {

  private readonly masterService = inject(MasterService);

  public getAllEnquiriesList: any[] = [];
  public categoryMap: { [key: number]: string } = {};
  public statusMap: { [key: number]: string } = {};

  public ngOnInit(): void {
    this.loadCategoriesAndStatus();
    this.getAllEnquiries();
  }

  public loadCategoriesAndStatus() {
    this.masterService.getAllCategory().subscribe({
      next: (categories: ICategoryModel[]) => {
        categories.forEach(cat => {
          this.categoryMap[cat.categoryId] = cat.categoryName;
        });
      }
    });

    this.masterService.getAllStatus().subscribe({
      next: (statuses: IStatusModel[]) => {
        statuses.forEach(status => {
          this.statusMap[status.statusId] = status.statusName;
        });
      }
    });
  }




  public getAllEnquiries() {
    this.masterService.getAllEnquiries().subscribe({
      next: (data: any) => {
        this.getAllEnquiriesList = data.map((enquiry: any) => ({
          ...enquiry,
          category: this.categoryMap[enquiry.categoryId] || 'N/A',
          status: this.statusMap[enquiry.statusId] || 'N/A'
        }));
      }
    });
  }

  public delete(id: string) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      const indexToRemove = this.getAllEnquiriesList.findIndex(e => e.id === id);
      if (indexToRemove > -1) {
        this.getAllEnquiriesList.splice(indexToRemove, 1);
      }

      this.masterService.deleteEnquiry(id).subscribe({
        next: () => {
          console.log('Enquiry deleted successfully');
        }
      });
    }
  }
}