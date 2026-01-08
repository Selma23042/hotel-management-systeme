import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

// Services
import { RoomService } from '../../../core/services/room';
import { BookingService } from '../../../core/services/booking';
import { Room } from '../../../core/models/room.model';

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
  selectedRoom?: Room;
  roomId?: number;
  numberOfNights = 0;
  totalPrice = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getRoomIdFromParams();
  }

  initForm(): void {
    this.bookingForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numberOfGuests: [1, [Validators.required, Validators.min(1)]],
      specialRequests: ['']
    });

    // Écouter les changements de dates pour calculer le prix
    this.bookingForm.get('checkInDate')?.valueChanges.subscribe(() => {
      this.calculatePrice();
    });

    this.bookingForm.get('checkOutDate')?.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }

  getRoomIdFromParams(): void {
    this.route.queryParams.subscribe(params => {
      const roomIdParam = params['roomId'];
      console.log('🔍 RoomId reçu:', roomIdParam);
      
      if (roomIdParam) {
        this.roomId = +roomIdParam;
        this.loadRoomDetails(this.roomId);
      } else {
        this.showMessage('Aucune chambre sélectionnée');
        this.router.navigate(['/rooms']);
      }
    });
  }

  loadRoomDetails(roomId: number): void {
    console.log('📡 Chargement de la chambre:', roomId);
    this.loading = true;
    
    this.roomService.getRoomById(roomId).subscribe({
      next: (room) => {
        console.log('✅ Chambre chargée:', room);
        this.selectedRoom = room;
        this.loading = false;
        
        // Vérifier la disponibilité
        if (room.status !== 'AVAILABLE') {
          this.showMessage('Cette chambre n\'est plus disponible');
          setTimeout(() => {
            this.router.navigate(['/rooms']);
          }, 2000);
        }

        // Calculer le prix initial si des dates sont déjà définies
        this.calculatePrice();
      },
      error: (error) => {
        console.error('❌ Erreur chargement chambre:', error);
        this.showMessage('Erreur lors du chargement de la chambre');
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/rooms']);
        }, 2000);
      }
    });
  }

  calculatePrice(): void {
    const checkInDate = this.bookingForm.get('checkInDate')?.value;
    const checkOutDate = this.bookingForm.get('checkOutDate')?.value;

    console.log('💰 Calcul prix - CheckIn:', checkInDate, 'CheckOut:', checkOutDate);

    if (checkInDate && checkOutDate && this.selectedRoom) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      // Calculer le nombre de nuits
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      console.log('📅 Différence en jours:', diffDays);

      if (diffDays > 0) {
        this.numberOfNights = diffDays;
        this.totalPrice = diffDays * this.selectedRoom.pricePerNight;
        console.log('✅ Prix calculé:', this.totalPrice, 'DT pour', this.numberOfNights, 'nuits');
      } else {
        this.numberOfNights = 0;
        this.totalPrice = 0;
        console.log('⚠️ Nombre de jours invalide');
      }
    } else {
      this.numberOfNights = 0;
      this.totalPrice = 0;
      console.log('⚠️ Données manquantes pour le calcul');
    }
  }

  calculateTotalPrice(): number {
    return this.totalPrice;
  }

  onSubmit(): void {
    console.log('🚀 Soumission du formulaire');
    console.log('📝 Formulaire valide?', this.bookingForm.valid);
    console.log('📝 Valeurs:', this.bookingForm.value);

    if (this.bookingForm.invalid) {
      this.showMessage('Veuillez remplir tous les champs requis');
      return;
    }

    if (!this.selectedRoom || !this.roomId) {
      this.showMessage('Chambre non sélectionnée');
      return;
    }

    if (this.totalPrice <= 0) {
      this.showMessage('Veuillez sélectionner des dates valides');
      return;
    }

    // Validation des dates
    const checkInDate = new Date(this.bookingForm.value.checkInDate);
    const checkOutDate = new Date(this.bookingForm.value.checkOutDate);
    
    if (checkOutDate <= checkInDate) {
      this.showMessage('La date de départ doit être après la date d\'arrivée');
      return;
    }

    // Vérifier la capacité
    const numberOfGuests = this.bookingForm.value.numberOfGuests;
    if (numberOfGuests > this.selectedRoom.capacity) {
      this.showMessage(`Cette chambre peut accueillir maximum ${this.selectedRoom.capacity} personne(s)`);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Préparer les données (format YYYY-MM-DD pour le backend)
    const bookingRequest = {
      customerId: 1, // TODO: Récupérer depuis AuthService
      roomId: this.roomId,
      checkInDate: this.formatDateForBackend(checkInDate),
      checkOutDate: this.formatDateForBackend(checkOutDate),
      numberOfGuests: numberOfGuests,
      specialRequests: this.bookingForm.value.specialRequests || ''
    };

    console.log('📤 Envoi de la réservation:', bookingRequest);

    // Créer la réservation
    this.bookingService.createBooking(bookingRequest).subscribe({
      next: (booking) => {
        console.log('✅ Réservation créée:', booking);
        this.loading = false;
        this.showMessage('Réservation créée avec succès !');
        
        // Rediriger vers les détails de la réservation
        setTimeout(() => {
          this.router.navigate(['/bookings', booking.id]);
        }, 1500);
      },
      error: (error) => {
        console.error('❌ Erreur création réservation:', error);
        this.loading = false;
        
        // Afficher le message d'erreur du serveur
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Erreur lors de la création de la réservation';
        }
        
        this.showMessage(this.errorMessage);
      }
    });
  }

  private formatDateForBackend(date: Date): string {
    // Format: YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  getRoomTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'STANDARD': 'Standard',
      'DELUXE': 'Deluxe',
      'SUITE': 'Suite'
    };
    return labels[type] || type;
  }
}