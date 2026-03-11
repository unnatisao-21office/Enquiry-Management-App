import { Component, OnInit, inject } from '@angular/core';
import { App } from '../../app';
import { IStatusModel } from '../../model/interface/status.model';
import { MasterService } from '../../../services/master-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICategoryModel } from '../../model/interface/category.model';
type AppRole = 'admin' | 'user' | null;

@Component({
  selector: 'app-enquiry-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enquiry-status.html',
  styleUrl: './enquiry-status.css',
})

export class EnquiryStatus implements OnInit {
  private readonly masterService = inject(MasterService);
  public role: AppRole = null;
  public allEnquiries: any[] = [];
  public filteredEnquiries: any[] = [];

  public categories: ICategoryModel[] = [];
  public statuses: IStatusModel[] = [];



  public statusSummary: { name: string; count: number }[] = [];

  private getRoleFromStorage(): AppRole {
    const raw = localStorage.getItem('enquiryApp');
    if (raw === 'admin' || raw === 'user') {
      return raw;
    } else {
      return null;
    }
  }
  public filters = {
    search: '',
    statusId: 'all',
    categoryId: 'all',
    converted: 'all',
  };
  public ngOnInit(): void {
    this.role = this.getRoleFromStorage();
    this.filteredEnquiries = [...this.allEnquiries];
  }

  public getTotalCount(): number {
    return this.allEnquiries.length;
  }

  public get visibleCount(): number {
    return this.filteredEnquiries.length;
  }

  public isAdmin(): boolean {
    return this.role === 'admin';
  }
  public isUser(): boolean {
    return this.role === 'user';
  }


  public applyFilters(): void {
    const searchText = this.filters.search.trim().toLowerCase();

    this.filteredEnquiries = this.allEnquiries.filter((enquiry) => {
      const statusMatch =
        this.filters.statusId === 'all' ||
        Number(enquiry.statusId) === Number(this.filters.statusId);

      const categoryMatch =
        this.filters.categoryId === 'all' ||
        Number(enquiry.categoryId) === Number(this.filters.categoryId);

      const convertedMatch =
        this.filters.converted === 'all' ||
        (this.filters.converted === 'yes' && enquiry.isConverted) ||
        (this.filters.converted === 'no' && !enquiry.isConverted);

      const searchMatch =
        !searchText ||
        String(enquiry.enquiryId).includes(searchText) ||
        enquiry.customerName.toLowerCase().includes(searchText) ||
        enquiry.customerEmail.toLowerCase().includes(searchText) ||
        enquiry.customerPhone.toLowerCase().includes(searchText);

      return statusMatch && categoryMatch && convertedMatch && searchMatch;
    });

    this.buildStatusSummary();
  }

  public clearFilters(): void {
    this.filters = {
      search: '',
      statusId: 'all',
      categoryId: 'all',
      converted: 'all',
    };
    this.applyFilters();
  }
  private buildStatusSummary(): void {
    this.statusSummary = this.statuses.map((status) => ({
      name: status.statusName,
      count: this.filteredEnquiries.filter(
        (enquiry) => Number(enquiry.statusId) === Number(status.statusId)
      ).length,
    }));
  }
}
