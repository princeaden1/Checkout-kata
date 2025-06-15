package com.cdl.checkout.data;

import java.util.List;

public class CalculationResponse {
    private int subtotal;
    private int discount;
    private int total;
    private List<items> items;

    public CalculationResponse() {
    }

    public CalculationResponse(int subtotal, int discount, int total, List<items> items) {
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

    public List<items> getItems() {
        return items;
    }

    public void setItems(List<items> items) {
        this.items = items;
    }
}