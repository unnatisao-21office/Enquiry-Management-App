import { Component, inject, OnInit, signal } from '@angular/core';
import { MasterService } from '../../../services/master-service';
import { EnquiryModel } from '../../model/class/Enquiry.Model';
import { ICategoryModel } from '../../model/interface/category.model';

import { IStatusModel } from '../../model/interface/status.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submit-enquiry',
  imports: [FormsModule],
  templateUrl: './submit-enquiry.html',
  styleUrl: './submit-enquiry.css',
  standalone: true,
})
export class SubmitEnquiry implements OnInit {
masterService = inject(MasterService);
statusList=signal<IStatusModel[]>([]);
categoryList=signal<ICategoryModel[]>([]);
newEnquiryObj: EnquiryModel = new EnquiryModel();
validationErrors = signal<{ [key: string]: string }>({});


ngOnInit(): void {
  this.getStatus();
  this.getCategories();
} 
 

getStatus() {
  this.masterService.getAllStatus().subscribe({
    next: (res: IStatusModel[]) => {
      this.statusList.set(res);
    }
  });
}

getCategories() {
  this.masterService.getAllCategory().subscribe({
    next: (res: ICategoryModel[]) => {
      this.categoryList.set(res);
    }
  });
}

isFormValid(): boolean {
  const trimmedFullName = this.newEnquiryObj.customerName?.trim() || '';
  const trimmedEmail = this.newEnquiryObj.customerEmail?.trim() || '';
  const trimmedMobile = this.newEnquiryObj.customerPhone?.trim() || '';
  const trimmedMessage = this.newEnquiryObj.message?.trim() || '';

  return (
    !!trimmedFullName &&
    /^[a-zA-Z\s'-]+$/.test(trimmedFullName) &&
    !!trimmedEmail &&
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmedEmail) &&
    !!trimmedMobile &&
    /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(trimmedMobile) &&
    !!this.newEnquiryObj.enquiryType &&
    !!this.newEnquiryObj.statusId &&
    !!this.newEnquiryObj.categoryId &&
    !!trimmedMessage
  );
}

saveEnquiry() {
   const errors: { [key:string]: string } = {};
   
   const trimmedFullName = this.newEnquiryObj.customerName.trim();
   const trimmedEmail = this.newEnquiryObj.customerEmail.trim();
   const trimmedMobile = this.newEnquiryObj.customerPhone.trim();
   const trimmedEnquiryDetails = this.newEnquiryObj.message.trim();
 
    if (!trimmedFullName) {
      errors['customerName'] = 'Full Name is required';
    } else if (!/^[a-zA-Z\s'-]+$/.test(trimmedFullName)) {
      errors['customerName'] = 'Full Name must contain letters only';
    }
    
    if (!trimmedEmail) {
      errors['customerEmail'] = 'Email is required';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmedEmail)) {
      errors['customerEmail'] = 'Please enter a valid email address';
    }

    if (!trimmedMobile) {
      errors['customerPhone'] = 'Phone is required';
    }else if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(trimmedMobile)) {
      errors['customerPhone'] = 'Please enter a valid phone number';
    }
   
    if(!trimmedEnquiryDetails) {
      errors['message'] = 'Enquiry Details is required';
    }

    if(!this.newEnquiryObj.enquiryType){
      errors['enquiryType'] = 'Enquiry Type is required';
    }

    if(!this.newEnquiryObj.statusId){
      errors['statusId'] = 'Status is required';
    }

    if(!this.newEnquiryObj.categoryId){
      errors['categoryId'] = 'Category is required';
    }

    if(this.newEnquiryObj.followUpDate && this.newEnquiryObj.enquiryDate) {
      const followUp = new Date(this.newEnquiryObj.followUpDate);
      const enquiryDate = new Date(this.newEnquiryObj.enquiryDate);   
      if(followUp < enquiryDate) {
        errors['followUpDate'] = 'Follow-up date cannot be before enquiry date';
      }
    }

    
  this.validationErrors.set(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    

   this.masterService.saveEnquiry(this.newEnquiryObj).subscribe({
      next: (res: any) => {
        alert("Enquiry saved successfully!");
      },error:(error: any) => {
        alert("Failed to save enquiry. Please try again.");
      }
   });  
}
}
