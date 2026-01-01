package com.hotel.billing_service.dto;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    
    @NotNull(message = "Payment method is required")
    private String paymentMethod;
    
    private String transactionReference;
}
