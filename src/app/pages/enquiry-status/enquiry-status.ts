import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MasterService } from '../../../services/master-service';
import { ICategoryModel } from '../../model/interface/category.model';
import { IStatusModel } from '../../model/interface/status.model';

type AppRole = 'admin' | 'user' | null;

type EnquiryRow = {
  id?: string;
  enquiryId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  categoryId: number;
  categoryName: string;
  statusId: number;
  statusName: string;
  enquiryType: string;
  isConverted: boolean;
  enquiryDate: string;
  followUpDate: string;
  feedback: string;
};

type EnquiryFilters = {
  search: string;
  statusId: string;
  categoryId: string;
  converted: 'all' | 'yes' | 'no';
};

@Component({
  selector: 'app-enquiry-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enquiry-status.html',
  styleUrl: './enquiry-status.css',
})
export class EnquiryStatus implements OnInit {
  private readonly masterService: MasterService = inject(MasterService);

  public role: AppRole = null;
  public isLoading: boolean = false;
  public searchText: string = '';
  public errorMessage: string = '';

  public categories: ICategoryModel[] = [];
  public statuses: IStatusModel[] = [];

  public allEnquiries: EnquiryRow[] = [];
  public filteredEnquiries: EnquiryRow[] = [];

  public statusSummary: { name: string; count: number }[] = [];

  public categoryMap: Record<number, string> = {};
  public statusMap: Record<number, string> = {};

  public filters: EnquiryFilters = {
    search: '',
    statusId: 'all',
    categoryId: 'all',
    converted: 'all',
  };

  public ngOnInit(): void {
    this.role = this.getRoleFromStorage();
    this.loadPageData();
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

  public statusBadgeClass(statusName: string): string {
    const normalized = statusName.trim().toLowerCase();

    if (normalized.includes('new')) {
      return 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40';
    }

    if (normalized.includes('progress')) {
      return 'bg-amber-500/20 text-amber-200 border border-amber-400/40';
    }

    if (normalized.includes('follow')) {
      return 'bg-violet-500/20 text-violet-200 border border-violet-400/40';
    }

    if (
      normalized.includes('order') ||
      normalized.includes('closed') ||
      normalized.includes('resolved')
    ) {
      return 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40';
    }

    return 'bg-slate-500/20 text-slate-200 border border-slate-400/40';
  }

  private loadPageData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      categories: this.masterService.getAllCategory(),
      statuses: this.masterService.getAllStatus(),
      enquiries: this.masterService.getAllEnquiries(),
    }).subscribe({
      next: ({ categories, statuses, enquiries }) => {
        this.categories = Array.isArray(categories) ? categories : [];
        this.statuses = Array.isArray(statuses) ? statuses : [];

        this.categoryMap = {};
        this.statusMap = {};

        this.categories.forEach((category) => {
          this.categoryMap[Number(category.categoryId)] = category.categoryName;
        });

        this.statuses.forEach((status) => {
          this.statusMap[Number(status.statusId)] = status.statusName;
        });

        const safeEnquiries = Array.isArray(enquiries) ? enquiries : [];
        this.allEnquiries = safeEnquiries
          .map((enquiry) => this.toEnquiryRow(enquiry))
          .sort((a, b) => this.toTime(b.enquiryDate) - this.toTime(a.enquiryDate));

        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load enquiry status. Please try again.';
        this.isLoading = false;
      },
    });
  }

  private buildStatusSummary(): void {
    this.statusSummary = this.statuses.map((status) => ({
      name: status.statusName,
      count: this.filteredEnquiries.filter(
        (enquiry) => Number(enquiry.statusId) === Number(status.statusId)
      ).length,
    }));
  }

  private toEnquiryRow(enquiry: any): EnquiryRow {
    const statusId = Number(enquiry?.statusId) || 0;
    const categoryId = Number(enquiry?.categoryId) || 0;

    return {
      id: enquiry?.id,
      enquiryId: Number(enquiry?.enquiryId) || 0,
      customerName: String(enquiry?.customerName ?? ''),
      customerEmail: String(enquiry?.customerEmail ?? ''),
      customerPhone: String(enquiry?.customerPhone ?? ''),
      message: String(enquiry?.message ?? ''),
      categoryId,
      categoryName: this.categoryMap[categoryId] || 'N/A',
      statusId,
      statusName: this.statusMap[statusId] || 'N/A',
      enquiryType: String(enquiry?.enquiryType ?? ''),
      isConverted: Boolean(enquiry?.isConverted),
      enquiryDate: String(enquiry?.enquiryDate ?? ''),
      followUpDate: String(enquiry?.followUpDate ?? ''),
      feedback: String(enquiry?.feedback ?? ''),
    };
  }

  private toTime(value: string): number {
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private getRoleFromStorage(): AppRole {
    const raw = localStorage.getItem('enquiryApp');
    if (raw === 'admin') {
      return 'admin';
    }

    if (raw === 'user') {
      return 'user';
    }

    return null;
  }
}









