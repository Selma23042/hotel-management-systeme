import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalInvoices: number;
  availableRooms: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private bookingUrl = `${environment.apiUrl}/api/bookings`;
  private billingUrl = `${environment.apiUrl}/api/billing`;
  private roomUrl = `${environment.apiUrl}/api/rooms`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les statistiques du dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      totalBookings: this.http.get<number>(`${this.bookingUrl}/count`),
      pendingBookings: this.http.get<number>(`${this.bookingUrl}/count/status/PENDING`),
      totalInvoices: this.http.get<number>(`${this.billingUrl}/invoices/count`),
      availableRooms: this.http.get<number>(`${this.roomUrl}/count/available`)
    }).pipe(
      map(response => ({
        totalBookings: response.totalBookings,
        pendingBookings: response.pendingBookings,
        totalInvoices: response.totalInvoices,
        availableRooms: response.availableRooms
      })),
      catchError(error => {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      })
    );
  }
}