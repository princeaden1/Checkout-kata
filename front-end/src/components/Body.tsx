import { useState, useEffect } from "react";
import {
  PlusIcon,
  CartIcon,
  MinusIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "./icons";
import type { PricingRule, BasketItem, CheckoutResult } from "./types";

function Body() {
  // Default pricing rules as per requirements
  const [pricingRules] = useState<PricingRule[]>([
    { sku: "A", unitPrice: 50, specialOffer: { quantity: 3, price: 130 } },
    { sku: "B", unitPrice: 30, specialOffer: { quantity: 2, price: 45 } },
    { sku: "C", unitPrice: 20 },
    { sku: "D", unitPrice: 15 },
  ]);

  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult>({
    subtotal: 0,
    discount: 0,
    total: 0,
    items: [],
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [useBackend, setUseBackend] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Calculate totals locally (frontend calculation)
  const calculateTotalsFrontend = (items: BasketItem[]): CheckoutResult => {
    let subtotal = 0;
    let discount = 0;
    const itemDetails: CheckoutResult["items"] = [];

    items.forEach((item) => {
      const rule = pricingRules.find((r) => r.sku === item.sku);
      if (!rule) return;

      let lineTotal = 0;
      let discountApplied = 0;
      let remainingQuantity = item.quantity;

      // Apply special offers first
      if (
        rule.specialOffer &&
        remainingQuantity >= rule.specialOffer.quantity
      ) {
        const specialOfferSets = Math.floor(
          remainingQuantity / rule.specialOffer.quantity
        );
        const specialOfferTotal = specialOfferSets * rule.specialOffer.price;
        const regularPriceForSameQuantity =
          specialOfferSets * rule.specialOffer.quantity * rule.unitPrice;

        lineTotal += specialOfferTotal;
        discountApplied += regularPriceForSameQuantity - specialOfferTotal;
        remainingQuantity -= specialOfferSets * rule.specialOffer.quantity;
      }

      // Add remaining items at regular price
      lineTotal += remainingQuantity * rule.unitPrice;

      subtotal += item.quantity * rule.unitPrice;
      discount += discountApplied;

      itemDetails.push({
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: rule.unitPrice,
        lineTotal,
        discountApplied,
      });
    });

    return {
      subtotal,
      discount,
      total: subtotal - discount,
      items: itemDetails,
    };
  };

  // Calculate totals using backend - NO FALLBACK VERSION
  const calculateTotalsBackend = async (
    items: BasketItem[]
  ): Promise<CheckoutResult> => {
    const payload = {
      items: items.map((item) => ({
        sku: item.sku,
        quantity: item.quantity,
      })),
      pricingRules,
    };

    try {
      setApiError(null); // Clear any previous errors

      const response = await fetch(
        "http://localhost:8080/api/checkout/calculate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error (${response.status}): ${errorText}`);
      }

      const result = await response.json();

      // Ensure the response matches our expected format
      return {
        subtotal: result.subtotal || 0,
        discount: result.discount || 0,
        total: result.total || 0,
        items: result.items || [],
      };
    } catch (error) {
      console.error("Backend calculation error:", error);
      setApiError(
        error instanceof Error ? error.message : "Backend connection failed"
      );

      // Return empty/error state instead of fallback
      return {
        subtotal: 0,
        discount: 0,
        total: 0,
        items: [],
      };
    }
  };

  // Update totals whenever basket changes
  useEffect(() => {
    const updateTotals = async () => {
      // Skip calculation if basket is empty
      if (basket.length === 0) {
        setCheckoutResult({
          subtotal: 0,
          discount: 0,
          total: 0,
          items: [],
        });
        return;
      }

      setIsCalculating(true);

      try {
        const result = useBackend
          ? await calculateTotalsBackend(basket)
          : calculateTotalsFrontend(basket);

        setCheckoutResult(result);
      } catch (error) {
        console.error("Calculation error:", error);
      } finally {
        setIsCalculating(false);
      }
    };

    updateTotals();
  }, [basket, useBackend, pricingRules]);

  // Add item to basket
  const addItem = (sku: string) => {
    setBasket((prev) => {
      const existingItem = prev.find((item) => item.sku === sku);
      if (existingItem) {
        return prev.map((item) =>
          item.sku === sku ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { sku, quantity: 1 }];
      }
    });
  };

  // Remove item from basket
  const removeItem = (sku: string) => {
    setBasket((prev) => {
      const existingItem = prev.find((item) => item.sku === sku);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) =>
          item.sku === sku ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter((item) => item.sku !== sku);
      }
    });
  };

  // Clear entire basket
  const clearBasket = () => {
    setBasket([]);
    setApiError(null); // Clear any API errors when clearing basket
  };

  const formatPrice = (pence: number) => {
    return `£${(pence / 100).toFixed(2)}`;
  };

  return (
    <main className="flex flex-col md:flex-row flex-1">
      {/* Left Column - 7/12 on medium+ screens, full width on small */}
      <div className="w-full md:w-8/12 bg-gray-300 p-6">
        <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-1 h-10 bg-blue-500 rounded-full"></div>
            <h2 className="text-sm font-bold text-gray-900">
              Available Stocks
            </h2>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <select
                  value={useBackend ? "backend" : "frontend"}
                  onChange={(e) => setUseBackend(e.target.value === "backend")}
                  className="appearance-none bg-blue-100 border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="frontend">Javascript</option>
                  <option value="backend">Java</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  useBackend
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {useBackend ? "Spring Boot" : "React"}
              </div>
            </div>
          </div>

          {/* API Error Display */}
          {apiError && useBackend && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
              <p className="text-red-700 text-xs font-medium">
                ⚠️ API Error: {apiError}
              </p>
              <p className="text-red-600 text-[11px] mt-1">
                Falling back to frontend calculation
              </p>
            </div>
          )}

          <div className="space-y-4">
            {pricingRules.map((rule) => (
              <div
                key={rule.sku}
                className="group border border-blue-200 hover:border-blue-300 rounded-xl p-5 bg-blue-100 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {rule.sku}
                        </h3>
                        <p className="text-gray-600 text-xs font-medium">
                          {formatPrice(rule.unitPrice)}
                        </p>
                      </div>
                    </div>
                    {rule.specialOffer && (
                      <div className="bg-blue-400 border border-green-200 rounded-lg p-3 mt-3">
                        <p className="text-white text-xs font-bold flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Special Deal: {rule.specialOffer.quantity} for{" "}
                          {formatPrice(rule.specialOffer.price)}
                        </p>
                        <p className="text-[11px] mt-1">
                          Save{" "}
                          {formatPrice(
                            rule.specialOffer.quantity * rule.unitPrice -
                              rule.specialOffer.price
                          )}
                          !
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => addItem(rule.sku)}
                    className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group-hover:shadow-blue-200"
                  >
                    <CartIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold">cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - 5/12 on medium+ screens, full width on small */}
      <div className="w-full md:w-4/12 bg-gray-300 p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-sm font-bold text-gray-900">Cart</h2>
              {basket.length > 0 && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {basket.reduce((sum, item) => sum + item.quantity, 0)} items
                </div>
              )}
            </div>
            {basket.length > 0 && (
              <button
                onClick={clearBasket}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
              >
                <TrashIcon className="w-4 h-4" />
                <span className="font-medium text-xs">Empty Basket</span>
              </button>
            )}
          </div>

          {basket.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCartIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-xs font-medium">
                Your Cart is empty
              </p>
              <p className="text-gray-400 text-[10px] mt-2">
                Add some products to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {basket.map((item) => {
                const rule = pricingRules.find((r) => r.sku === item.sku);
                const itemDetail = checkoutResult.items.find(
                  (i) => i.sku === item.sku
                );
                return (
                  <div
                    key={item.sku}
                    className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-2 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm">
                            Item {item.sku}
                          </h4>
                          <p className="text-gray-600 text-xs font-medium">
                            {formatPrice(rule?.unitPrice || 0)} each
                          </p>
                          {itemDetail && itemDetail.discountApplied > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <p className="text-green-600 font-semibold text-[11px]">
                                Discount: -
                                {formatPrice(itemDetail.discountApplied)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-gray-100 rounded-xl p-2">
                          <button
                            onClick={() => removeItem(item.sku)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded-lg transition-all duration-200"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs min-w-[30px] text-center text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addItem(item.sku)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-1 rounded-lg transition-all duration-200"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="font-bold text-xs text-gray-900">
                            {formatPrice(itemDetail?.lineTotal || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {basket.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 mt-2">
            <div className="text-sm text-gray-500 flex items-center space-x-2 mb-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  useBackend ? "bg-green-500" : "bg-blue-500"
                }`}
              ></div>
              <span>{useBackend ? "Java Spring Boot" : "React"}</span>
              {isCalculating && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent ml-2"></div>
              )}
            </div>

            {apiError && useBackend ? (
              <div className="bg-red-100 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-red-600 font-bold text-lg mb-2">
                  ⚠️ Backend Not Reachable
                </div>
                <p className="text-red-700 text-sm mb-4">{apiError}</p>
                <button
                  onClick={() => setUseBackend(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Switch to Frontend Calculation
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl space-y-4">
                <div className="flex justify-between items-center text-gray-700 text-xs">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-bold">
                    {formatPrice(checkoutResult.subtotal)}
                  </span>
                </div>
                {checkoutResult.discount > 0 && (
                  <div className="flex bg-green-400 border border-green-200 rounded-lg p-2 justify-between items-center text-white text-xs">
                    <span className="font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Total Discount:
                    </span>
                    <span className="font-bold">
                      -{formatPrice(checkoutResult.discount)}
                    </span>
                  </div>
                )}
                <div className="border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">
                      Total:
                    </span>
                    <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {formatPrice(checkoutResult.total)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-xs transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xs"
                onClick={() =>
                  alert(
                    `Payment processing...\nTotal: ${formatPrice(
                      checkoutResult.total
                    )}`
                  )
                }
              >
                Pay
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Body;
