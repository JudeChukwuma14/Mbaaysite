import { convertPrice, fetchExchangeRates } from "./currencyCoverter";

export interface Pricing {
  subtotal: string; // Original product amount in selected currency
  shipping: string;
  tax: string;
  discount: string;
  total: string; // Total user pays (subtotal + tax - discount) in selected currency
}

export const calculatePricing = async (
  cartItems: { id: string; name: string; price: number | string; quantity: number | string; image: string }[],
  discountRate: number | string | undefined,
  currency: string = "NGN" // Default to NGN if no currency provided
): Promise<Pricing> => {
  // Ensure exchange rates are available
  await fetchExchangeRates("NGN"); // Base currency is NGN

  // Validate inputs
  if (!Array.isArray(cartItems)) {
    console.error("Invalid cartItems: expected array, got", cartItems);
    return {
      subtotal: "0.00",
      shipping: "0.00",
      tax: "0.00",
      discount: "0.00",
      total: "0.00",
    };
  }

  // Calculate subtotal in base currency (NGN)
  const subtotalNGN = cartItems.reduce((sum, item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    if (isNaN(price) || isNaN(quantity)) {
      console.warn("Invalid item data:", { item, price, quantity });
      return sum;
    }
    return sum + price * quantity;
  }, 0);

  // Convert subtotal to target currency
  const subtotal = convertPrice(subtotalNGN, "NGN", currency);

  // Calculate tax on subtotal in target currency
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;

  // Validate discountRate
  let validDiscountRate = Number(discountRate);
  if (isNaN(validDiscountRate) || validDiscountRate < 0) {
    console.warn("Invalid discountRate:", discountRate);
    validDiscountRate = 0;
  }
  const discount = subtotal * validDiscountRate;

  // Total user pays in target currency
  const total = Math.max(subtotal + tax - discount, 0);

  return {
    subtotal: subtotal.toFixed(2),
    shipping: "0.00", // Free shipping
    tax: tax.toFixed(2),
    discount: discount.toFixed(2),
    total: total.toFixed(2),
  };
};