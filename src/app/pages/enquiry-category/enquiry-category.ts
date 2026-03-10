import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICategoryModel } from '../../model/interface/category.model';
import { MasterService } from '../../../services/master-service';

type CategoryWithCount = ICategoryModel & { enquiryCount: number };
type EnquiryItem = {
  id?: string;
  categoryId?: number | string;
  customerName?: string;
  name?: string;
  enquiryType?: string;
  subject?: string;
};
type CategoryFormModel = {
  categoryName: string;
  isActive: boolean;
};

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
  public enquiries: EnquiryItem[] = [];

  public selectedCategory: CategoryWithCount | null = null;
  public selectedCategoryEnquiries: EnquiryItem[] = [];

  public categoryForm: CategoryFormModel = {
    categoryName: '',
    isActive: true,
  };

  public editingCategory: CategoryWithCount | null = null;
  public formError = '';
  public successMessage = '';
  public isSubmitting = false;

 
  public ngOnInit(): void {
    this.loadData();
  }

 
  private loadData(selectedCategoryId: number | undefined = this.selectedCategory?.categoryId): void {
    this.masterService.getAllCategory().subscribe({
      next: (categories) => {
        const safeCategories = Array.isArray(categories) ? categories : [];

        this.categories = safeCategories.map((category) => ({
          ...category,
          enquiryCount: 0,
        }));

        this.loadEnquiries(selectedCategoryId);
      },
      error: () => {
        this.categories = [];
        this.enquiries = [];
        this.clearSelectedCategory();
      },
    });
  }


  private loadEnquiries(selectedCategoryId?: number): void {
    this.masterService.getAllEnquiries().subscribe({
      next: (enquiries) => {
        this.enquiries = Array.isArray(enquiries) ? (enquiries as EnquiryItem[]) : [];
        this.refreshCountsAndSelection(selectedCategoryId);
      },
      error: () => {
        this.enquiries = [];
        this.refreshCountsAndSelection(selectedCategoryId);
      },
    });
  }

  
  private refreshCountsAndSelection(selectedCategoryId?: number): void {
    this.updateCategoryCounts();

    if (selectedCategoryId === undefined) {
      return;
    }

    const selected = this.categories.find((category) =>
      this.isSameCategory(category.categoryId, selectedCategoryId)
    );

    if (!selected) {
      this.clearSelectedCategory();
      return;
    }

    this.viewEnquiries(selected);
  }

 
  private updateCategoryCounts(): void {
    this.categories = this.categories.map((category) => {
      const enquiryCount = this.enquiries.filter((enquiry) =>
        this.isSameCategory(enquiry.categoryId, category.categoryId)
      ).length;

      return {
        ...category,
        enquiryCount,
      };
    });
  }


  private isSameCategory(
    firstCategoryId: number | string | undefined,
    secondCategoryId: number | string | undefined
  ): boolean {
    return Number(firstCategoryId) === Number(secondCategoryId);
  }

  
  private getNextCategoryId(): number {
    const categoryIds = this.categories.map((item) => Number(item.categoryId) || 0);
    const maxCategoryId = categoryIds.length > 0 ? Math.max(...categoryIds) : 0;
    return maxCategoryId + 1;
  }

  
  private getCategoryApiId(category: ICategoryModel): string | null {
    if (category.id === undefined || category.id === null) {
      return null;
    }

    const idText = String(category.id).trim();
    return idText.length > 0 ? idText : null;
  }


  private resetForm(): void {
    this.categoryForm = {
      categoryName: '',
      isActive: true,
    };
    this.editingCategory = null;
    this.formError = '';
  }

  
  private onSaveSuccess(message: string): void {
    this.successMessage = message;
    this.isSubmitting = false;
    this.resetForm();
    this.loadData();
  }

 
  private getCategoryNameError(categoryName: string): string | null {
    if (!categoryName) {
      return 'Category name is required';
    }

    const hasDuplicateName = this.categories.some((category) => {
      const isCurrentCategoryBeingEdited =
        this.editingCategory !== null &&
        this.isSameCategory(category.categoryId, this.editingCategory.categoryId);

      return (
        !isCurrentCategoryBeingEdited &&
        category.categoryName.trim().toLowerCase() === categoryName.toLowerCase()
      );
    });

    if (hasDuplicateName) {
      return 'Category name already exists';
    }

    return null;
  }

  // for the CRUD operations we have separate methods for creating and updating categories
  private saveNewCategory(categoryName: string): void {
    const payload: ICategoryModel = {
      categoryId: this.getNextCategoryId(),
      categoryName,
      isActive: this.categoryForm.isActive,
    };

    this.masterService.saveCategory(payload).subscribe({
      next: () => {
        this.onSaveSuccess('Category created successfully');
      },
      error: () => {
        this.formError = 'Failed to create category. Please try again.';
        this.isSubmitting = false;
      },
    });
  }


  private saveEditedCategory(categoryName: string): void {
    if (!this.editingCategory) {
      this.isSubmitting = false;
      return;
    }

    const apiId = this.getCategoryApiId(this.editingCategory);
    if (!apiId) {
      this.formError = 'Unable to update this category due to missing id';
      this.isSubmitting = false;
      return;
    }

    const payload: ICategoryModel = {
      id: apiId,

      categoryId: this.editingCategory.categoryId,
      categoryName,
      isActive: this.categoryForm.isActive,
    };

    this.masterService.updateCategory(apiId, payload).subscribe({
      next: () => {
        this.onSaveSuccess('Category updated successfully');
      },
      error: () => {
        this.formError = 'Failed to update category. Please try again.';
        this.isSubmitting = false;
      },
    });
  }


  public onSubmitCategory(): void {
    this.formError = '';
    this.successMessage = '';

    const categoryName = this.categoryForm.categoryName.trim();
    const validationError = this.getCategoryNameError(categoryName);

    if (validationError) {
      this.formError = validationError;
      return;
    }

    this.isSubmitting = true;

    if (this.editingCategory) {
      this.saveEditedCategory(categoryName);
      return;
    }

    this.saveNewCategory(categoryName);
  }


  public editCategory(category: CategoryWithCount): void {
    this.successMessage = '';
    this.formError = '';
    this.editingCategory = category;
    this.categoryForm = {
      categoryName: category.categoryName,
      isActive: category.isActive,
    };
  }

 
  public cancelEdit(): void {
    this.successMessage = '';
    this.resetForm();
  }

  
  public deleteCategory(category: CategoryWithCount): void {
    this.formError = '';
    this.successMessage = '';

    if (category.enquiryCount > 0) {
      window.alert('This category has enquiries and cannot be deleted.');
      return;
    }

    const apiId = this.getCategoryApiId(category);
    if (!apiId) {
      window.alert('Unable to delete this category due to missing id');
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${category.categoryName}"?`
    );

    if (!isConfirmed) {
      return;
    }

    this.masterService.deleteCategory(apiId).subscribe({
      next: () => {
        if (this.selectedCategory && this.isSameCategory(this.selectedCategory.categoryId, category.categoryId)) {
          this.clearSelectedCategory();
        }

        if (this.editingCategory && this.isSameCategory(this.editingCategory.categoryId, category.categoryId)) {
          this.cancelEdit();
        }

        this.successMessage = 'Category deleted successfully';
        this.loadData();
      },
      error: () => {
        this.formError = 'Failed to delete category. Please try again.';
      },
    });
  }

 
  public viewEnquiries(category: CategoryWithCount): void {
    this.selectedCategory = category;
    this.selectedCategoryEnquiries = this.enquiries.filter(
      (enquiry) => this.isSameCategory(enquiry.categoryId, category.categoryId)
    );
  }

 
  public clearSelectedCategory(): void {
    this.selectedCategory = null;
    this.selectedCategoryEnquiries = [];
  }

}
