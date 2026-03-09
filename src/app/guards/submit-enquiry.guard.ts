import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const submitEnquiryGuard: CanActivateFn = () => {
    const router = inject(Router);
    const role = localStorage.getItem('enquiryApp');

    if (role === 'user') {
        return true;
    }

    if (role === 'admin') {
        return router.createUrlTree(['/enquiry-list']);
    }

    return router.createUrlTree(['/login']);
};