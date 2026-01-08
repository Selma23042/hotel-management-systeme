export interface Invoice {
  id: number;
  invoiceNumber: string;
  bookingId: number;
  customerId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  roomCharges: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  paymentMethod?: string | null;
  paidAt?: Date | null;
  createdAt: Date;
}

export interface PaymentRequest {
  paymentMethod: string;
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK'
}