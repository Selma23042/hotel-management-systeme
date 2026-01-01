import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  providers: [DatePipe],
  templateUrl: './booking-list.html',
  styleUrls: ['./booking-list.scss']
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  loading = false;
  selectedStatus: string = 'ALL';
  displayedColumns: string[] = ['id', 'guestName', 'room', 'dates', 'status', 'actions'];

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    // Implémentez votre logique ici
    setTimeout(() => {
      this.bookings = [];
      this.applyFilter();
      this.loading = false;
    }, 1000);
  }

  applyFilter(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredBookings = this.bookings;
    } else {
      this.filteredBookings = this.bookings.filter(
        booking => booking.status === this.selectedStatus
      );
    }
  }

  onStatusChange(): void {
    this.applyFilter();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'CONFIRMED': 'status-success',
      'PENDING': 'status-warn',
      'CANCELLED': 'status-error',
      'COMPLETED': 'status-accent'
    };
    return colors[status] || 'status-primary';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'CONFIRMED': 'Confirmée',
      'PENDING': 'En attente',
      'CANCELLED': 'Annulée',
      'COMPLETED': 'Terminée'
    };
    return labels[status] || status;
  }

  cancelBooking(booking: any): void {
    if (confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      // Logique d'annulation
      console.log('Annulation de la réservation:', booking);
    }
  }
}