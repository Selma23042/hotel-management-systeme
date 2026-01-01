import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Modèles
import { Room } from '../../../core/models/room.model';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './room-card.html',
  styleUrls: ['./room-card.scss']
})
export class RoomCardComponent {
  @Input() room!: Room;
  @Output() bookRoom = new EventEmitter<Room>();

  onBookRoom(): void {
    this.bookRoom.emit(this.room);
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

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'AVAILABLE': 'Disponible',
      'OCCUPIED': 'Occupée',
      'RESERVED': 'Réservée',
      'MAINTENANCE': 'Maintenance'
    };
    return labels[status] || status;
  }

  getRoomTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'SINGLE': 'Simple',
      'DOUBLE': 'Double',
      'SUITE': 'Suite',
      'DELUXE': 'Deluxe'
    };
    return labels[type] || type;
  }
}