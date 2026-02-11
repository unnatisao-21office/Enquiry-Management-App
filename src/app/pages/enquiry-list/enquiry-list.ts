import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master-service';

@Component({
  selector: 'app-enquiry-list',
  imports: [CommonModule],
  templateUrl: './enquiry-list.html',
  styleUrl: './enquiry-list.css',
})
export class EnquiryList implements OnInit {

masterservice= inject(MasterService);

getAllEnquiriesList:any[] = [];

ngOnInit(): void {
  this.getAllEnquiries();
}

getAllEnquiries() {
  this.masterservice.getAllEnquiries().subscribe({
    next: (data: any) => {
      this.getAllEnquiriesList = data;
    }
  });
}

delete(id: string) {
  if (confirm('Are you sure you want to delete this enquiry?')) {
    // Remove from UI immediately for instant feedback
    const indexToRemove = this.getAllEnquiriesList.findIndex(e => e.enquiryId === id);
    if (indexToRemove > -1) {
      this.getAllEnquiriesList.splice(indexToRemove, 1);
    }

   
    this.masterservice.deleteEnquiry(id).subscribe({
      next: () => {
        console.log('Enquiry deleted successfully');
      }
    });
  }
}
}
