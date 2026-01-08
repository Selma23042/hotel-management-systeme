export interface Booking {
  id: number;
  customerId: number;
  customerName: string;
  roomId: number;
  roomNumber: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
  createdAt: Date;
}

export interface BookingRequest {
  customerId: number;
  roomId: number;
  checkInDate: string; // Format: YYYY-MM-DD
  checkOutDate: string; // Format: YYYY-MM-DD
  numberOfGuests: number;
  specialRequests?: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}