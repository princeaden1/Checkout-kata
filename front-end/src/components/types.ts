
// Interfaces
export interface PricingRule {
    sku: string;
    unitPrice: number;
    specialOffer?: {
      quantity: number;
      price: number;
    };
  }
  
  export interface BasketItem {
    sku: string;
    quantity: number;
  }
  
  export interface CheckoutResult {
    subtotal: number;
    discount: number;
    total: number;
    items: Array<{
      sku: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      discountApplied: number;
    }>;
  }