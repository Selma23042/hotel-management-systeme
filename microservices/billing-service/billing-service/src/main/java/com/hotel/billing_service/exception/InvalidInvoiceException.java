package com.hotel.billing_service.exception;


public class InvalidInvoiceException extends RuntimeException {
    public InvalidInvoiceException(String message) {
        super(message);
    }
}