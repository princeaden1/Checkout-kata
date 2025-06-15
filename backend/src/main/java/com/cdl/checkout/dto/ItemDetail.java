package com.cdl.checkout.dto;

public class ItemDetail {
    private String sku;
    private int quantity;
    private int unitPrice;
    private int lineTotal;
    private int discountApplied;

    public ItemDetail() {
    }

    public ItemDetail(String sku, int quantity, int unitPrice, int lineTotal, int discountApplied) {
        this.sku = sku;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.lineTotal = lineTotal;
        this.discountApplied = discountApplied;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(int unitPrice) {
        this.unitPrice = unitPrice;
    }

    public int getLineTotal() {
        return lineTotal;
    }

    public void setLineTotal(int lineTotal) {
        this.lineTotal = lineTotal;
    }

    public int getDiscountApplied() {
        return discountApplied;
    }

    public void setDiscountApplied(int discountApplied) {
        this.discountApplied = discountApplied;
    }
}