package com.cdl.checkout.dto;

import java.util.List;

public class CalculationRequest {
    private List<BasketItem> items;
    private List<PricingRule> pricingRules;

    public CalculationRequest() {
    }

    public List<BasketItem> getItems() {
        return items;
    }

    public void setItems(List<BasketItem> items) {
        this.items = items;
    }

    public List<PricingRule> getPricingRules() {
        return pricingRules;
    }

    public void setPricingRules(List<PricingRule> pricingRules) {
        this.pricingRules = pricingRules;
    }
}