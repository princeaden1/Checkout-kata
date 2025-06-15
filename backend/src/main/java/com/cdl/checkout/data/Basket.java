package com.cdl.checkout.data;


/**
 * Data Transfer Object representing an item in the shopping basket
 */
public class Basket {
    public String sku;
    private int quantity;

    public Basket() {
    }

    public Basket(String sku, int quantity) {
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
