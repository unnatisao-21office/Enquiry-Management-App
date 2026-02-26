import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EnquiryStatus } from './pages/enquiry-status/enquiry-status';
import { EnquiryList } from './pages/enquiry-list/enquiry-list';
import { EnquiryCategory } from './pages/enquiry-category/enquiry-category';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { SubmitEnquiry } from './pages/submit-enquiry/submit-enquiry';
import { Navbar } from './pages/navbar/navbar';
import { ForgetPassword } from './pages/forget-password/forget-password';
import { CheckMail } from './pages/check-mail/check-mail';
import { DashboardHeader } from './pages/dashboard-header/dashboard-header';
import { StatsCard } from './pages/stats-card/stats-card';
import { StatusSummary } from './pages/dashboard/status-summary/status-summary';
import { CategorySummary } from './pages/dashboard/category-summary/category-summary';
import { RecentEnquiries } from './pages/dashboard/recent-enquiries/recent-enquiries';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }, {
        path: 'home',
        component: Home
    },
    {
        path: 'enquiry-status',
        component: EnquiryStatus
    }, {
        path: 'enquiry-list',
        component: EnquiryList
    }, {
        path: 'enquiry-category',
        component: EnquiryCategory
    }, {
        path: 'dashboard',
        component: Dashboard
    }, {
        path: 'login',
        component: Login
    }, {
        path: 'submit-enquiry',
        component: SubmitEnquiry
    }, {
        path: 'navbar',
        component: Navbar
    }, {
        path: 'forgot-password',
        component: ForgetPassword
    }, {
        path: 'check-email',
        component: CheckMail
    }, {
        path: 'dashboard-header',
        component: DashboardHeader
    }, {
        path: 'stats-card',
        component: StatsCard
    }, {
        path: 'status-summary',
        component: StatusSummary
    }, {
        path: 'category-summary',
        component: CategorySummary
    }, {
        path: 'recent-enquiries',
        component: RecentEnquiries
    }

];
