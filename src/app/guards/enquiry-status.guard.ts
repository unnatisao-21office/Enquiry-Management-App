import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const enquiryStatusGuard: CanActivateFn = () => {
    const router = inject(Router);
    const role = localStorage.getItem('enquiryApp');

    if (role === 'admin' || role === 'user') {
        return true;
    }

    window.alert('Please login to view enquiry status.');
    return router.createUrlTree(['/login']);
};