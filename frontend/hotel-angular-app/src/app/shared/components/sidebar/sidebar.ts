import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Angular Material
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Tableau de bord', route: '/dashboard' },
    { icon: 'meeting_room', label: 'Chambres', route: '/rooms' },
    { icon: 'book_online', label: 'Réservations', route: '/bookings' },
    { icon: 'receipt', label: 'Factures', route: '/invoices' },
    { icon: 'person', label: 'Mon Profil', route: '/profile' }
  ];

  constructor(public router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}