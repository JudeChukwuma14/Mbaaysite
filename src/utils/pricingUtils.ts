interface CartItem {
  id: string;
  price: number;
  quantity: number;
}

interface Pricing {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export const calculatePricing = (
  cartItems: CartItem[],
  discountRate: number = 0
): Pricing => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.085; // 8.5% tax
  const discount = subtotal * discountRate;
  const total = subtotal + shipping + tax - discount;

  return {
    subtotal,
    shipping,
    tax,
    discount,
    total,
  };
};