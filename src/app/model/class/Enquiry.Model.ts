export class EnquiryModel {
    public enquiryId: number;
    public customerName: string;
    public customerEmail: string;
    public customerPhone: string;
    public message: string;
    public categoryId: number;
    public statusId: number;
    public enquiryType: string;
    public isConverted: boolean;
    public enquiryDate: Date;
    public followUpDate: Date;
    public feedback: string;

    constructor() {
        this.enquiryId = 0;
        this.customerName = '';
        this.customerEmail = '';
        this.customerPhone = '';
        this.message = '';
        this.categoryId = 0;
        this.statusId = 0;
        this.enquiryType = '';
        this.isConverted = false;
        this.enquiryDate = new Date();//''
        this.followUpDate = new Date();
        this.feedback = '';
    }

}
