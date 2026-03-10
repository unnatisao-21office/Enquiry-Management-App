import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminCategoryGuard: CanActivateFn = () => {
    const router = inject(Router);
    const role = localStorage.getItem('enquiryApp');

    if (role === 'admin') {
        return true;
    }

    if (role === 'user') {
        window.alert('Only admin can manage enquiry categories.');
        return router.createUrlTree(['/home']);
    }

    window.alert('You must first login');
    return router.createUrlTree(['/login']);
};