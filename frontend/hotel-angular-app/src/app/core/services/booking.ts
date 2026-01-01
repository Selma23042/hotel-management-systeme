import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, BookingRequest } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  getBookingsByCustomer(customerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  getBookingsByRoom(roomId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/room/${roomId}`);
  }

  createBooking(request: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, request);
  }

  confirmBooking(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/${id}/confirm`, null);
  }

  cancelBooking(id: number): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}/cancel`, null);
  }

  completeBooking(id: number): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}/complete`, null);
  }
}