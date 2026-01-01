import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Room, RoomRequest, RoomStatus, RoomType } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  getRoomsByStatus(status: RoomStatus): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/status/${status}`);
  }

  getRoomsByType(type: RoomType): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/type/${type}`);
  }

  getAvailableRoomsByType(type: RoomType): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/available/${type}`);
  }

  getRoomsByPriceRange(minPrice: number, maxPrice: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/price-range`, {
      params: { minPrice: minPrice.toString(), maxPrice: maxPrice.toString() }
    });
  }

  createRoom(request: RoomRequest): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, request);
  }

  updateRoom(id: number, request: RoomRequest): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, request);
  }

  updateRoomStatus(id: number, status: RoomStatus): Observable<Room> {
    return this.http.patch<Room>(`${this.apiUrl}/${id}/status`, null, {
      params: { status }
    });
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}