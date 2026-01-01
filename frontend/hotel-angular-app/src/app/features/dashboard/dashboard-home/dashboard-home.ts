import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { AuthService, User } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.scss']
})
export class DashboardHomeComponent implements OnInit {
  currentUser$!: Observable<User | null>;
  stats: any = {
    totalBookings: 0,
    pendingBookings: 0,
    totalInvoices: 0,  // Ajouté ici
    availableRooms: 0
  };
  loading = true;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    // Simuler le chargement des données
    setTimeout(() => {
      this.stats = {
        totalBookings: 156,
        pendingBookings: 12,
        totalInvoices: 89,  // Ajouté ici aussi
        availableRooms: 24
      };
      this.loading = false;
    }, 1000);
  }
}