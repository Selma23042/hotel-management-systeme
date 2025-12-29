package com.hotel.demapi_gatewayo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DemapiGatewayoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemapiGatewayoApplication.class, args);
	}

}
