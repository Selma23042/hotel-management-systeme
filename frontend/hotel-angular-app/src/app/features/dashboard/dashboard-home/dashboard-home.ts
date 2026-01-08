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
import { DashboardService, DashboardStats } from '../../../core/services/dashboard';

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
  stats: DashboardStats = {
    totalBookings: 0,
    pendingBookings: 0,
    totalInvoices: 0,
    availableRooms: 0
  };
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        console.log('Dashboard stats loaded successfully:', data);
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des statistiques. Veuillez réessayer.';
        this.loading = false;
        console.error('Error loading dashboard stats:', err);
        
        // Données par défaut en cas d'erreur (optionnel)
        this.stats = {
          totalBookings: 0,
          pendingBookings: 0,
          totalInvoices: 0,
          availableRooms: 0
        };
      }
    });
  }

  refreshStats(): void {
    this.loadDashboardData();
  }
}