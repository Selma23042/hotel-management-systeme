import { Routes } from '@angular/router';

export const ROOMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./room-list/room-list').then(m => m.RoomListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./room-detail/room-detail').then(m => m.RoomDetailComponent)
  }
];