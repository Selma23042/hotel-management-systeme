import { Routes } from '@angular/router';

export const BOOKINGS_ROUTES: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./booking-list/booking-list').then(m => m.BookingListComponent) 
  },
  { 
    path: 'new', 
    loadComponent: () => import('./booking-create/booking-create').then(m => m.BookingCreateComponent) 
  },
  { 
    path: ':id', 
    loadComponent: () => import('./booking-detail/booking-detail').then(m => m.BookingDetailComponent) 
  }
];