// src/utils/pricingUtils.ts
export interface Pricing {
  subtotal: string; // Original product amount before commission
  shipping: string;
  tax: string;
  discount: string;
  commission: string; // Mbaay's commission (deducted from subtotal)
  total: string; // Total user pays (after commission, tax, discount)
}

export const calculatePricing = (
  cartItems: { id: string; name: string; price: number | string; quantity: number | string; image: string }[],
  discountRate: number | string | undefined
): Pricing => {
  // Validate inputs
  if (!Array.isArray(cartItems)) {
    console.error("Invalid cartItems: expected array, got", cartItems);
    return {
      subtotal: "0.00",
      shipping: "0.00",
      tax: "0.00",
      discount: "0.00",
      commission: "0.00",
      total: "0.00",
    };
  }

  // Calculate original subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    if (isNaN(price) || isNaN(quantity)) {
      console.warn("Invalid item data:", { item, price, quantity });
      return sum;
    }
    return sum + price * quantity;
  }, 0);

  // Deduct 10% commission from subtotal
  const commissionRate = 0.1; // 10% for Mbaay
  const commission = subtotal * commissionRate;
  const adjustedSubtotal = subtotal - commission;

  // Calculate tax and discount on adjusted subtotal
  const taxRate = 0.1; // 10% tax
  const tax = adjustedSubtotal * taxRate;

  // Validate discountRate
  let validDiscountRate = Number(discountRate);
  if (isNaN(validDiscountRate) || validDiscountRate < 0) {
    console.warn("Invalid discountRate:", discountRate);
    validDiscountRate = 0;
  }
  const discount = adjustedSubtotal * validDiscountRate;

  // Total user pays
  const total = Math.max(adjustedSubtotal + tax - discount, 0);

  return {
    subtotal: subtotal.toFixed(2),
    shipping: "0.00", // Free shipping
    tax: tax.toFixed(2),
    discount: discount.toFixed(2),
    commission: commission.toFixed(2),
    total: total.toFixed(2),
  };
};