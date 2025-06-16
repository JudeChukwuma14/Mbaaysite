// src/utils/pricingUtils.ts
export interface Pricing {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  commission: number; // Added commission
  total: number; // Total after commission
}

export const calculatePricing = (
  cartItems: { id: string; name: string; price: number; quantity: number; image: string }[],
  discountRate: number
): Pricing => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.1; // 10% tax (adjust as needed)
  const tax = subtotal * taxRate;
  const discount = subtotal * discountRate;
  const totalBeforeCommission = subtotal + tax - discount;
  const commissionRate = 0.02; // 2% commission for Mbaay
  const commission = totalBeforeCommission * commissionRate;
  const total = totalBeforeCommission - commission;

  return {
    subtotal,
    shipping: 0, // Free shipping as per your code
    tax,
    discount,
    commission,
    total: Math.max(total, 0), // Ensure total is non-negative
  };
};