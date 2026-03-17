import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master-service';
import { IStatusModel } from '../../model/interface/status.model';
import { ICategoryModel } from '../../model/interface/category.model';
import { forkJoin } from 'rxjs';

type EnquiryListItem = {
  id: string;
  enquiryId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  enquiryType: string;
  enquiryDate: string;
  followUpDate: string;
  message: string;
  feedback: string;
  isConverted: boolean;
  category: string;
  status: string;
};

@Component({
  selector: 'app-enquiry-list',
  imports: [CommonModule],
  templateUrl: './enquiry-list.html',
  styleUrl: './enquiry-list.css',
})
export class EnquiryList implements OnInit {

  private readonly masterService = inject(MasterService);

  public getAllEnquiriesList: EnquiryListItem[] = [];
  public categoryMap: Record<number, string> = {};
  public statusMap: Record<number, string> = {};
  public searchText = '';
  public isLoading = false;

  public ngOnInit(): void {
    this.loadPageData();
  }

  public get filteredEnquiries(): EnquiryListItem[] {
    const search = this.searchText.trim().toLowerCase();
    if (!search) {
      return this.getAllEnquiriesList;
    }

    return this.getAllEnquiriesList.filter((enquiry) =>
      String(enquiry.enquiryId).includes(search) ||
      enquiry.customerName.toLowerCase().includes(search) ||
      enquiry.customerEmail.toLowerCase().includes(search) ||
      enquiry.customerPhone.toLowerCase().includes(search) ||
      enquiry.category.toLowerCase().includes(search) ||
      enquiry.status.toLowerCase().includes(search)
    );
  }

  public statusBadgeClass(status: string): string {
    const normalized = status.trim().toLowerCase();

    if (normalized.includes('new')) {
      return 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40';
    }

    if (normalized.includes('progress')) {
      return 'bg-amber-500/20 text-amber-200 border-amber-400/40';
    }

    if (
      normalized.includes('order') ||
      normalized.includes('closed') ||
      normalized.includes('resolved')
    ) {
      return 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40';
    }

    return 'bg-slate-500/20 text-slate-200 border-slate-400/40';
  }

  public convertedBadgeClass(isConverted: boolean): string {
    return isConverted
      ? 'bg-orange-500/20 text-orange-200 border-orange-400/40'
      : 'bg-slate-500/20 text-slate-300 border-slate-500/40';
  }

  private loadPageData(): void {
    this.isLoading = true;

    forkJoin({
      categories: this.masterService.getAllCategory(),
      statuses: this.masterService.getAllStatus(),
      enquiries: this.masterService.getAllEnquiries(),
    }).subscribe({
      next: ({ categories, statuses, enquiries }) => {
        const safeCategories: ICategoryModel[] = Array.isArray(categories)
          ? categories
          : [];
        const safeStatuses: IStatusModel[] = Array.isArray(statuses)
          ? statuses
          : [];
        const safeEnquiries: any[] = Array.isArray(enquiries) ? enquiries : [];

        this.categoryMap = {};
        this.statusMap = {};

        safeCategories.forEach((category) => {
          this.categoryMap[Number(category.categoryId)] = category.categoryName;
        });

        safeStatuses.forEach((status) => {
          this.statusMap[Number(status.statusId)] = status.statusName;
        });

        this.getAllEnquiriesList = safeEnquiries.map((enquiry) => {
          const categoryId = Number(enquiry?.categoryId) || 0;
          const statusId = Number(enquiry?.statusId) || 0;

          return {
            id: String(enquiry?.id ?? ''),
            enquiryId: Number(enquiry?.enquiryId) || 0,
            customerName: String(enquiry?.customerName ?? ''),
            customerEmail: String(enquiry?.customerEmail ?? ''),
            customerPhone: String(enquiry?.customerPhone ?? ''),
            enquiryType: String(enquiry?.enquiryType ?? ''),
            enquiryDate: String(enquiry?.enquiryDate ?? ''),
            followUpDate: String(enquiry?.followUpDate ?? ''),
            message: String(enquiry?.message ?? ''),
            feedback: String(enquiry?.feedback ?? ''),
            isConverted: Boolean(enquiry?.isConverted),
            category: this.categoryMap[categoryId] || 'N/A',
            status: this.statusMap[statusId] || 'N/A',
          };
        });

        this.isLoading = false;
      },
      error: () => {
        this.getAllEnquiriesList = [];
        this.isLoading = false;
      },
    });
  }

  public delete(id: string): void {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      const indexToRemove = this.getAllEnquiriesList.findIndex((enquiry) => enquiry.id === id);
      if (indexToRemove > -1) {
        this.getAllEnquiriesList.splice(indexToRemove, 1);
      }

      this.masterService.deleteEnquiry(id).subscribe({
        next: () => {
          console.log('Enquiry deleted successfully');
        },
      });
    }
  }
}