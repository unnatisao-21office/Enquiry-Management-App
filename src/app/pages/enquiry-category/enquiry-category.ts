import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICategoryModel } from '../../model/interface/category.model';
import { MasterService } from '../../../services/master-service';

type CategoryWithCount = ICategoryModel & { enquiryCount: number };

@Component({
  selector: 'app-enquiry-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enquiry-category.html',
  styleUrl: './enquiry-category.css',
})
export class EnquiryCategory implements OnInit {
  private readonly masterService = inject(MasterService);
  public categories: CategoryWithCount[] = [];
  public enquiries: any[] = [];

  public selectedCategory: CategoryWithCount | null = null;
  public selectedCategoryEnquiries: any[] = [];

  public ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.masterService.getAllCategory().subscribe({
      next: (categories) => {
        const categoryList = Array.isArray(categories) ? categories : [];
        this.categories = categoryList.map((category) => ({
          ...category,
          enquiryCount: 0,
        }));

        this.loadEnquiries();
      },
      error: () => {
        this.categories = [];
        this.enquiries = [];
      },
    });
  }

  private loadEnquiries(): void {
    this.masterService.getAllEnquiries().subscribe({
      next: (enquiries) => {
        this.enquiries = Array.isArray(enquiries) ? enquiries : [];
        this.updateCategoryCounts();
      },
      error: () => {
        this.enquiries = [];
        this.updateCategoryCounts();
      },
    });
  }

  private updateCategoryCounts(): void {
    this.categories = this.categories.map((category) => ({
      ...category,
      enquiryCount: this.enquiries.filter(
        (enquiry: any) => Number(enquiry.categoryId) === Number(category.categoryId)
      ).length,
    }));
  }

  public viewEnquiries(category: CategoryWithCount): void {
    this.selectedCategory = category;
    this.selectedCategoryEnquiries = this.enquiries.filter(
      (enquiry: any) => Number(enquiry.categoryId) === Number(category.categoryId)
    );
  }

  public clearSelectedCategory(): void {
    this.selectedCategory = null;
    this.selectedCategoryEnquiries = [];
  }

}
