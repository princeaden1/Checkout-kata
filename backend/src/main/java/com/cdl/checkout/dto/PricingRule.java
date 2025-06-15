package com.cdl.checkout.dto;

public class PricingRule {
    public String sku;
    private int unitPrice;
    private SpecialOffer specialOffer;

    public PricingRule() {
    }

    public PricingRule(String sku, int unitPrice, SpecialOffer specialOffer) {
        this.sku = sku;
        this.unitPrice = unitPrice;
        this.specialOffer = specialOffer;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(int unitPrice) {
        this.unitPrice = unitPrice;
    }

    public SpecialOffer getSpecialOffer() {
        return specialOffer;
    }

    public void setSpecialOffer(SpecialOffer specialOffer) {
        this.specialOffer = specialOffer;
    }
}