import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard-home/dashboard-home')
          .then(m => m.DashboardHomeComponent)
      }
    ]
  }
];