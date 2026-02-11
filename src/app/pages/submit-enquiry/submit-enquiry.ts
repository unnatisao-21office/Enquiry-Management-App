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
saveEnquiry() {
   this.masterService.saveEnquiry(this.newEnquiryObj).subscribe({
      next: (res: any) => {
        alert("Enquiry saved successfully!");
      },error:(error: any) => {
        alert("Failed to save enquiry. Please try again.");
      }
   });  
}
}
