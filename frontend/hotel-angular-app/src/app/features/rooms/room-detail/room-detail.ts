import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

// Services et modèles
import { RoomService } from '../../../core/services/room';
import { Room } from '../../../core/models/room.model';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './room-detail.html',
  styleUrls: ['./room-detail.scss']
})
export class RoomDetailComponent implements OnInit {
  room?: Room;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRoom(+id);
    }
  }

  loadRoom(id: number): void {
    this.loading = true;
    this.roomService.getRoomById(id).subscribe({
      next: (room) => {
        this.room = room;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement chambre:', error);
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'AVAILABLE': 'Disponible',
      'OCCUPIED': 'Occupée',
      'RESERVED': 'Réservée',
      'MAINTENANCE': 'Maintenance'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'AVAILABLE': 'status-success',
      'OCCUPIED': 'status-warn',
      'RESERVED': 'status-accent',
      'MAINTENANCE': 'status-disabled'
    };
    return colors[status] || 'status-primary';
  }

  getRoomTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'Standard':'Standard',
      'SUITE': 'Suite',
      'DELUXE': 'Chambre Deluxe'
    };
    return labels[type] || type;
  }
}