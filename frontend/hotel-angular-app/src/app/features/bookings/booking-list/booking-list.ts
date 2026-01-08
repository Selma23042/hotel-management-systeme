import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Services et modèles
import { BookingService } from '../../../core/services/booking';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './booking-list.html',
  styleUrls: ['./booking-list.scss']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  loading = true;
  selectedStatus: string = 'ALL';

  displayedColumns: string[] = ['roomNumber', 'dates', 'guests', 'totalPrice', 'status', 'actions'];

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    
    // Charger les réservations du client connecté
    const customerId = 1; // TODO: Récupérer depuis le service d'authentification
    
    this.bookingService.getBookingsByCustomer(customerId).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement réservations:', error);
        this.showMessage('Erreur lors du chargement des réservations');
        this.loading = false;
      }
    });
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

  cancelBooking(booking: Booking): void {
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      this.showMessage('Cette réservation ne peut pas être annulée');
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir annuler la réservation #${booking.id} ?`)) {
      this.bookingService.cancelBooking(booking.id).subscribe({
        next: (updatedBooking) => {
          // Mettre à jour la réservation dans la liste
          const index = this.bookings.findIndex(b => b.id === booking.id);
          if (index !== -1) {
            this.bookings[index] = updatedBooking;
            this.applyFilter();
          }
          this.showMessage('Réservation annulée avec succès');
        },
        error: (error) => {
          console.error('Erreur annulation:', error);
          this.showMessage('Erreur lors de l\'annulation');
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'CONFIRMED': 'Confirmée',
      'COMPLETED': 'Terminée',
      'CANCELLED': 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'status-warn',
      'CONFIRMED': 'status-success',
      'COMPLETED': 'status-accent',
      'CANCELLED': 'status-error'
    };
    return colors[status] || 'status-primary';
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}