import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard-layout/dashboard-layout').then(m => m.DashboardLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'rooms',
        loadChildren: () => import('./features/rooms/rooms.routes').then(m => m.ROOMS_ROUTES)
      },
      {
        path: 'bookings',
        loadChildren: () => import('./features/bookings/bookings.routes').then(m => m.BOOKINGS_ROUTES)
      },
      {
        path: 'invoices',
        loadChildren: () => import('./features/invoices/invoices.routes').then(m => m.INVOICES_ROUTES)
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile-view/profile.routes').then(m => m.PROFILE_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];