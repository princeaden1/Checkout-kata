package com.cdl.checkout.data;

import java.util.List;

public class CalculationRequest {
    private List<Basket> items;
    private List<PricingRule> pricingRules;

    public CalculationRequest() {
    }

    public List<Basket> getItems() {
        return items;
    }

    public void setItems(List<Basket> items) {
        this.items = items;
    }

    public List<PricingRule> getPricingRules() {
        return pricingRules;
    }

    public void setPricingRules(List<PricingRule> pricingRules) {
        this.pricingRules = pricingRules;
    }
}