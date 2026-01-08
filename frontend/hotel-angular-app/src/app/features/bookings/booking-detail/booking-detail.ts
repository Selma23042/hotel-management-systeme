import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Services et modèles
import { BookingService } from '../../../core/services/booking';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './booking-detail.html',
  styleUrls: ['./booking-detail.scss']
})
export class BookingDetailComponent implements OnInit {
  booking?: Booking;
  isLoading = true;
  bookingId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.params['id'];
    this.loadBookingDetails();
  }

  loadBookingDetails(): void {
    this.isLoading = true;
    
    this.bookingService.getBookingById(+this.bookingId).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement réservation:', error);
        this.isLoading = false;
        this.showMessage('Erreur lors du chargement de la réservation');
      }
    });

    // VERSION AVEC DONNÉES DE TEST (à utiliser si le backend n'est pas prêt)
    /*
    setTimeout(() => {
      this.booking = {
        id: +this.bookingId,
        customerId: 1,
        customerName: 'John Doe',
        roomId: 101,
        roomNumber: '101',
        checkInDate: new Date('2024-02-15'),
        checkOutDate: new Date('2024-02-20'),
        numberOfGuests: 2,
        totalPrice: 750,
        status: 'CONFIRMED',
        specialRequests: 'Vue sur mer, lit double',
        createdAt: new Date()
      };
      this.isLoading = false;
    }, 1000);
    */
  }

  confirmBooking(): void {
    if (!this.booking) return;

    if (confirm('Voulez-vous confirmer cette réservation ?')) {
      this.bookingService.confirmBooking(this.booking.id).subscribe({
        next: (updatedBooking) => {
          this.booking = updatedBooking;
          this.showMessage('Réservation confirmée avec succès !');
        },
        error: (error) => {
          console.error('Erreur confirmation:', error);
          this.showMessage('Erreur lors de la confirmation');
        }
      });
    }
  }

  cancelBooking(): void {
    if (!this.booking) return;

    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.bookingService.cancelBooking(this.booking.id).subscribe({
        next: (updatedBooking) => {
          this.booking = updatedBooking;
          this.showMessage('Réservation annulée');
        },
        error: (error) => {
          console.error('Erreur annulation:', error);
          this.showMessage('Erreur lors de l\'annulation');
        }
      });
    }
  }

  completeBooking(): void {
    if (!this.booking) return;

    if (confirm('Marquer cette réservation comme terminée ?')) {
      this.bookingService.completeBooking(this.booking.id).subscribe({
        next: (updatedBooking) => {
          this.booking = updatedBooking;
          this.showMessage('Réservation terminée');
        },
        error: (error) => {
          console.error('Erreur completion:', error);
          this.showMessage('Erreur lors de la finalisation');
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