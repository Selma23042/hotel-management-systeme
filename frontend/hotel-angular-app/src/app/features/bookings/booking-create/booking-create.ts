import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-booking-create',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  providers: [DecimalPipe],
  templateUrl: './booking-create.html',
  styleUrls: ['./booking-create.scss']
})
export class BookingCreateComponent implements OnInit {
  bookingForm!: FormGroup;
  loading = false;
  errorMessage = '';
  minDate = new Date();
  selectedRoom: any = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSelectedRoom();
  }

  initForm(): void {
    this.bookingForm = this.fb.group({
      guestName: ['', Validators.required],
      roomId: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]]
    });
  }

  loadSelectedRoom(): void {
    // Charger les informations de la chambre sélectionnée
    // Par exemple depuis les query params ou un service
    this.selectedRoom = {
      id: 1,
      roomNumber: '101',
      roomType: 'Suite',
      pricePerNight: 150,
      imageUrl: 'assets/room.jpg'
    };
  }

  calculateTotalPrice(): number {
    if (!this.selectedRoom || !this.bookingForm.value.checkIn || !this.bookingForm.value.checkOut) {
      return 0;
    }

    const checkIn = new Date(this.bookingForm.value.checkIn);
    const checkOut = new Date(this.bookingForm.value.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * this.selectedRoom.pricePerNight : 0;
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      // Votre logique de création
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
}