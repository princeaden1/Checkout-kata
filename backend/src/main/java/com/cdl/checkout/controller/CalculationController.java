package com.cdl.checkout.controller;

import com.cdl.checkout.dto.CalculationRequest;
import com.cdl.checkout.dto.CalculationResponse;
import com.cdl.checkout.service.CalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class CalculationController {

    @Autowired
    private CalculationService calculationService;

    @PostMapping("/calculate")
    public CalculationResponse calculateTotal(@RequestBody CalculationRequest request) {
        return calculationService.calculateTotal(request);
    }

    @GetMapping("/health")
    public String health() {
        return "Calculation service is running!";
    }
}