import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EnquiryStatus } from './pages/enquiry-status/enquiry-status';
import { EnquiryList } from './pages/enquiry-list/enquiry-list';
import { EnquiryCategory } from './pages/enquiry-category/enquiry-category';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { SubmitEnquiry } from './pages/submit-enquiry/submit-enquiry';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'       
        },{
           path: 'home',
           component: Home
        },
        {
            path: 'enquiry-status',
            component: EnquiryStatus
        },{
            path: 'enquiry-list',
            component: EnquiryList
        },{
            path: 'enquiry-category',
            component: EnquiryCategory
        },{
            path: 'dashboard',
            component: Dashboard
        },{
            path: 'login',
            component: Login
        },{
            path: 'submit-enquiry',
            component: SubmitEnquiry
        }
    
];
