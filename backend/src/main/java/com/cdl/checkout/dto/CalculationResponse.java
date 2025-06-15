package com.cdl.checkout.dto;

import java.util.List;

public class CalculationResponse {
    private int subtotal;
    private int discount;
    private int total;
    private List<ItemDetail> items;

    public CalculationResponse() {
    }

    public CalculationResponse(int subtotal, int discount, int total, List<ItemDetail> items) {
        this.subtotal = subtotal;
        this.discount = discount;
        this.total = total;
        this.items = items;
    }

    public int getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(int subtotal) {
        this.subtotal = subtotal;
    }

    public int getDiscount() {
        return discount;
    }

    public void setDiscount(int discount) {
        this.discount = discount;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public List<ItemDetail> getItems() {
        return items;
    }

    public void setItems(List<ItemDetail> items) {
        this.items = items;
    }
}