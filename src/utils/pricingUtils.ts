import { convertPrice, fetchExchangeRates, formatPrice } from "./currencyCoverter";

export interface Pricing {
  subtotal: string;
  shipping: string;
  tax: string;
  discount: string;
  total: string;
}

export const calculatePricing = async (
  cartItems: { id: string; name: string; price: number | string; quantity: number | string; image: string }[],
  discountRate: number | string | undefined,
  currency: string = "NGN"
): Promise<Pricing> => {
  // Ensure exchange rates are available
  try {
    await fetchExchangeRates("NGN");
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return {
      subtotal: "0.00",
      shipping: "0.00",
      tax: "0.00",
      discount: "0.00",
      total: "0.00",
    };
  }

  // Validate inputs
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    console.error("Invalid cartItems: expected non-empty array, got", cartItems);
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
    if (isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) {
      console.warn("Invalid item data:", { item, price, quantity });
      return sum;
    }
    return sum + price * quantity;
  }, 0);

  if (isNaN(subtotalNGN) || subtotalNGN < 0) {
    console.error("Invalid subtotalNGN:", subtotalNGN);
    return {
      subtotal: "0.00",
      shipping: "0.00",
      tax: "0.00",
      discount: "0.00",
      total: "0.00",
    };
  }

  // Convert subtotal to target currency
  let subtotal: number;
  try {
    subtotal = convertPrice(subtotalNGN, "NGN", currency);
    if (isNaN(subtotal) || subtotal < 0) {
      console.error("Invalid converted subtotal:", subtotal, "Currency:", currency);
      return {
        subtotal: "0.00",
        shipping: "0.00",
        tax: "0.00",
        discount: "0.00",
        total: "0.00",
      };
    }
  } catch (error) {
    console.error("Currency conversion failed:", error);
    return {
      subtotal: "0.00",
      shipping: "0.00",
      tax: "0.00",
      discount: "0.00",
      total: "0.00",
    };
  }

  // Calculate tax on subtotal in target currency
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  if (isNaN(tax) || tax < 0) {
    console.error("Invalid tax:", tax);
    return {
      subtotal: formatPrice(subtotal),
      shipping: "0.00",
      tax: "0.00",
      discount: "0.00",
      total: "0.00",
    };
  }

  // Validate discountRate
  let validDiscountRate = Number(discountRate);
  if (isNaN(validDiscountRate) || validDiscountRate < 0) {
    console.warn("Invalid discountRate:", discountRate);
    validDiscountRate = 0;
  }
  const discount = subtotal * validDiscountRate;
  if (isNaN(discount) || discount < 0) {
    console.error("Invalid discount:", discount);
    return {
      subtotal: formatPrice(subtotal),
      shipping: "0.00",
      tax: formatPrice(tax),
      discount: "0.00",
      total: "0.00",
    };
  }

  // Total user pays in target currency
  const total = Math.max(subtotal + tax - discount, 0);

  return {
    subtotal: formatPrice(subtotal),
    shipping: "0.00",
    tax: formatPrice(tax),
    discount: formatPrice(discount),
    total: formatPrice(total),
  };
};