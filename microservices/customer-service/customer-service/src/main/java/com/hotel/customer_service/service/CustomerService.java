package com.hotel.customer_service.service;

import com.hotel.customer_service.dto.*;
import com.hotel.customer_service.exception.CustomerAlreadyExistsException;
import com.hotel.customer_service.exception.CustomerNotFoundException;
import com.hotel.customer_service.exception.InvalidCredentialsException;
import com.hotel.customer_service.model.Customer;
import com.hotel.customer_service.repository.CustomerRepository;
import com.hotel.customer_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new CustomerAlreadyExistsException("Email already registered: " + request.getEmail());
        }
        
        Customer customer = new Customer();
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setCountry(request.getCountry());
        
        Customer savedCustomer = customerRepository.save(customer);
        String token = jwtService.generateToken(savedCustomer.getEmail());
        
        return new AuthResponseDTO(
            token,
            savedCustomer.getEmail(),
            savedCustomer.getFirstName(),
            savedCustomer.getLastName()
        );
    }
    
    public AuthResponseDTO login(LoginRequestDTO request) {
        Customer customer = customerRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        
        String token = jwtService.generateToken(customer.getEmail());
        
        return new AuthResponseDTO(
            token,
            customer.getEmail(),
            customer.getFirstName(),
            customer.getLastName()
        );
    }
    
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + id));
        return convertToDTO(customer);
    }
    
    public CustomerResponseDTO getCustomerByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() -> new CustomerNotFoundException("Customer not found with email: " + email));
        return convertToDTO(customer);
    }
    
    public List<CustomerResponseDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public CustomerResponseDTO updateCustomer(Long id, RegisterRequestDTO request) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id: " + id));
        
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setCountry(request.getCountry());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            customer.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        Customer updatedCustomer = customerRepository.save(customer);
        return convertToDTO(updatedCustomer);
    }
    
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
    
    private CustomerResponseDTO convertToDTO(Customer customer) {
        return new CustomerResponseDTO(
            customer.getId(),
            customer.getFirstName(),
            customer.getLastName(),
            customer.getEmail(),
            customer.getPhoneNumber(),
            customer.getAddress(),
            customer.getCity(),
            customer.getCountry(),
            customer.getCreatedAt()
        );
    }
}