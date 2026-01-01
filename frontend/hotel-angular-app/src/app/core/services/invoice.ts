import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Invoice, PaymentRequest } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/billing/invoices`;

  constructor(private http: HttpClient) {}

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  getInvoiceByBookingId(bookingId: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/booking/${bookingId}`);
  }

  getInvoicesByCustomer(customerId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  processPayment(id: number, request: PaymentRequest): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/${id}/pay`, request);
  }

  cancelInvoice(id: number): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.apiUrl}/${id}/cancel`, null);
  }
}