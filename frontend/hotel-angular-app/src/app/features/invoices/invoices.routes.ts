import { Routes } from '@angular/router';

export const INVOICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./invoice-list/invoice-list').then(m => m.InvoiceListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./invoice-detail/invoice-detail').then(m => m.InvoiceDetail)
  }
];