import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout/dashboard-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  // 🔐 Routes protégées avec Layout (Navbar + Sidebar)
  {
    path: '',
    component: DashboardLayoutComponent,  // 👈 Layout parent
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
      }
    ]
  },
  // 🔓 Routes publiques sans Layout (Auth)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];