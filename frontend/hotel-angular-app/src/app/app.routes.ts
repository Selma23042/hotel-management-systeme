import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [AuthGuard]  // ✅ Ajoutez ceci
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    // Pas de guard ici - accessible sans connexion
  },
  {
    path: 'rooms',
    loadChildren: () => import('./features/rooms/rooms.routes').then(m => m.ROOMS_ROUTES),
    canActivate: [AuthGuard]  // ✅ Ajoutez ceci
  },
  {
    path: 'bookings',
    loadChildren: () => import('./features/bookings/bookings.routes').then(m => m.BOOKINGS_ROUTES),
    canActivate: [AuthGuard]  // ✅ Ajoutez ceci
  },
  {
    path: 'invoices',
    loadChildren: () => import('./features/invoices/invoices.routes').then(m => m.INVOICES_ROUTES),
    canActivate: [AuthGuard]  // ✅ Ajoutez ceci
  },
  {
    path: '**',
    redirectTo: '/auth/login'  // ✅ Changez vers login au lieu de dashboard
  }
];