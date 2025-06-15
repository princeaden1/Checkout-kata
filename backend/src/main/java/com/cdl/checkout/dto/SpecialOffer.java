package com.cdl.checkout.dto;

public class SpecialOffer {
    private int quantity;
    private int price;

    public SpecialOffer() {
    }

    public SpecialOffer(int quantity, int price) {
        this.quantity = quantity;
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}