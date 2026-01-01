import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services et modèles
import { RoomService } from '../../../core/services/room';
import { Room } from '../../../core/models/room.model';

// Composant enfant
import { RoomCardComponent } from '../room-card/room-card';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RoomCardComponent // Importer le composant enfant !
  ],
  templateUrl: './room-list.html',
  styleUrls: ['./room-list.scss']
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  loading = true;

  selectedType: string = 'ALL';
  selectedStatus: string = 'AVAILABLE';
  minPrice: number = 0;
  maxPrice: number = 1000;

  roomTypes = [
    { value: 'ALL', label: 'Tous les types' },
    { value: 'SINGLE', label: 'Simple' },
    { value: 'DOUBLE', label: 'Double' },
    { value: 'SUITE', label: 'Suite' },
    { value: 'DELUXE', label: 'Deluxe' }
  ];

  constructor(
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.rooms];

    if (this.selectedType !== 'ALL') {
      filtered = filtered.filter(room => room.roomType === this.selectedType);
    }

    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(room => room.status === this.selectedStatus);
    }

    filtered = filtered.filter(room => 
      room.pricePerNight >= this.minPrice && room.pricePerNight <= this.maxPrice
    );

    this.filteredRooms = filtered;
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onPriceChange(): void {
    this.applyFilters();
  }

  onBookRoom(room: Room): void {
    this.router.navigate(['/bookings/new'], { 
      queryParams: { roomId: room.id }
    });
  }
}