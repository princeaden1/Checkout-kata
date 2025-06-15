package com.cdl.checkout.service;

import org.springframework.stereotype.Service;

import com.cdl.checkout.data.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CalculationService {

    public CalculationResponse calculateTotal(CalculationRequest request) {
        // Create lookup map for pricing rules
        Map<String, PricingRule> pricingMap = request.getPricingRules().stream()
                .collect(Collectors.toMap(PricingRule::getSku, rule -> rule));

        int subtotal = 0;
        int totalDiscount = 0;
        List<items> itemDetails = new ArrayList<>();

        // Process each basket item
        for (Basket item : request.getItems()) {
            PricingRule rule = pricingMap.get(item.sku);
            if (rule == null)
                continue;

            // Calculate for this item
            ItemCalculation calc = calculateItemTotal(item, rule);

            subtotal += calc.regularTotal;
            totalDiscount += calc.discountApplied;

            itemDetails.add(new items(
                    item.getSku(),
                    item.getQuantity(),
                    rule.getUnitPrice(),
                    calc.lineTotal,
                    calc.discountApplied));
        }

        int finalTotal = subtotal - totalDiscount;

        return new CalculationResponse(subtotal, totalDiscount, finalTotal, itemDetails);
    }

    private ItemCalculation calculateItemTotal(Basket item, PricingRule rule) {
        int regularTotal = item.getQuantity() * rule.getUnitPrice();
        int lineTotal = 0;
        int discountApplied = 0;
        int remainingQuantity = item.getQuantity();

        // Apply special offers if available
        if (rule.getSpecialOffer() != null && remainingQuantity >= rule.getSpecialOffer().getQuantity()) {
            SpecialOffer offer = rule.getSpecialOffer();
            int offerSets = remainingQuantity / offer.getQuantity();
            int specialTotal = offerSets * offer.getPrice();
            int regularForOfferItems = offerSets * offer.getQuantity() * rule.getUnitPrice();

            lineTotal += specialTotal;
            discountApplied += regularForOfferItems - specialTotal;
            remainingQuantity -= offerSets * offer.getQuantity();
        }

        // Add remaining items at regular price
        lineTotal += remainingQuantity * rule.getUnitPrice();

        return new ItemCalculation(regularTotal, lineTotal, discountApplied);
    }

    // Helper class
    private static class ItemCalculation {
        final int regularTotal;
        final int lineTotal;
        final int discountApplied;

        ItemCalculation(int regularTotal, int lineTotal, int discountApplied) {
            this.regularTotal = regularTotal;
            this.lineTotal = lineTotal;
            this.discountApplied = discountApplied;
        }
    }
}