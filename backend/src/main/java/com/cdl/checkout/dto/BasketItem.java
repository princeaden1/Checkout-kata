package com.cdl.checkout.dto;


/**
 * Data Transfer Object representing an item in the shopping basket
 */
public class BasketItem {
    public String sku;
    private int quantity;

    public BasketItem() {
    }

    public BasketItem(String sku, int quantity) {
        this.sku = sku;
        this.quantity = quantity;
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
}
