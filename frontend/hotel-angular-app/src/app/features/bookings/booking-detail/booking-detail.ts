import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './booking-detail.html',
  styleUrls: ['./booking-detail.scss']
})
export class BookingDetailComponent implements OnInit {
  booking: any = null;
  isLoading = true;
  bookingId!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.params['id'];
    this.loadBookingDetails();
  }

  loadBookingDetails(): void {
    // Votre logique de chargement
  }
}