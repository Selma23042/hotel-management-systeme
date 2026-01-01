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
      error: () => {
        this.loading = false;
      }
    });
  }
}