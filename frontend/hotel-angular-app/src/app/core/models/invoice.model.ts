export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE_PAYMENT = 'ONLINE_PAYMENT'
}

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
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  paidAt?: Date;
  createdAt: Date;
}

export interface PaymentRequest {
  paymentMethod: string;
  transactionReference?: string;
}