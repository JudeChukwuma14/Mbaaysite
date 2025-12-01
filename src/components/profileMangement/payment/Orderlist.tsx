// src/components/OrderList.tsx
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Eye,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
  Calendar,
  CreditCard,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getOrdersWithSession, Order } from "@/utils/getOrderApi";
import { confirmOrderReceived } from "@/utils/orderApi";
import {
  formatDate,
  getPaymentStatusColor,
  getStatusColor,
} from "@/utils/orderUtils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { ReviewPromptModal } from "../review/ReviewPromptModal";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  productId: string;
  name: string;
  category: string;
  subCategory: string;
  image: string;
  price: number;
  quantity: number;
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(
    null
  );
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // NEW REVIEW STATE
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [orderToReview, setOrderToReview] = useState<Order | null>(null);

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const vendor = useSelector((state: RootState) => state.vendor);
  const role = user.token ? "user" : vendor.token ? "vendor" : null;
  const token =
    role === "user" ? user.token : role === "vendor" ? vendor.token : null;
  const isAuthenticated = !!token && !!role;

  useEffect(() => {
    console.log("Redux state:", { user, vendor, role, token });
  }, [user, vendor, role, token]);

  useEffect(() => {
    if (!isAuthenticated || !token || !role) {
      console.log("Authentication failed:", { isAuthenticated, token, role });
      navigate("/selectpath", { replace: true });
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await getOrdersWithSession(token, role);
        console.log("Loaded orders from API:", data);
        setOrders(data);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load orders";
        console.error("Error loading orders:", err);
        setError(errorMessage);
        if (
          errorMessage.includes("Authentication token is missing") ||
          errorMessage.includes("Access denied") ||
          errorMessage.includes("User ID is required") ||
          errorMessage.includes("Failed to fetch orders")
        ) {
          navigate("/selectpath", { replace: true });
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [navigate, isAuthenticated, token, role]);

  const handleConfirmReceipt = async (orderId: string) => {
    setConfirmingOrderId(orderId); // Set loading state
    try {
      await confirmOrderReceived(orderId);

      let confirmedOrder: Order | undefined;
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId) {
            confirmedOrder = {
              ...order,
              paymentStatus: "Paid",
              orderStatus: "Delivered",
            };
            return confirmedOrder;
          }
          return order;
        })
      );

      toast.success("Order confirmed and vendor paid.");

      // Trigger Review Modal
      if (confirmedOrder) {
        setOrderToReview(confirmedOrder);
        setIsReviewModalOpen(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm payment");
    } finally {
      setConfirmingOrderId(null);
    }
  };

  // Function to close the modal and reset state
  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setOrderToReview(null);
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Calculate total items in an order
  const calculateTotalItems = (order: Order) => {
    // If order has items array, use its length
    if ((order as any).items && Array.isArray((order as any).items)) {
      return (order as any).items.length;
    }
    // Otherwise, it's a single product order
    return 1;
  };

  // Calculate total price for an order
  const calculateOrderTotal = (order: Order) => {
    // If order has items array, sum all items
    if ((order as any).items && Array.isArray((order as any).items)) {
      return (order as any).items.reduce((total: number, item: OrderItem) => {
        return total + (item.price * item.quantity);
      }, 0);
    }
    // Otherwise, use the single product total
    return order.totalPrice;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-t-orange-600 border-gray-200 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700">Loading your orders...</p>
          <p className="text-sm text-gray-500">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-red-600">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry Loading Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-600">View and manage your order history</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="px-3 py-1">
              Total Orders: {orders.length}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Total Items: {orders.reduce((total, order) => total + calculateTotalItems(order), 0)}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const totalItems = calculateTotalItems(order);
            const orderTotal = calculateOrderTotal(order);
            const hasMultipleItems = totalItems > 1;

            return (
              <Card
                key={order.id}
                className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          #{order.orderId.slice(-8).toUpperCase()}
                        </span>
                        {hasMultipleItems && (
                          <Badge variant="secondary" className="text-xs">
                            {totalItems} items
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={`${getStatusColor(order.orderStatus)} border`}
                        >
                          {order.orderStatus}
                        </Badge>
                        <Badge
                          className={`${getPaymentStatusColor(
                            order.paymentStatus
                          )} border`}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Customer Details Column */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                        <User className="w-4 h-4" />
                        Customer Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-gray-900">
                          {order.buyer.fullName}
                        </p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{order.buyer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-3 h-3" />
                          {order.buyer.phone}
                        </div>
                      </div>
                      <div className="pt-2">
                        <h4 className="flex items-center gap-2 font-medium text-gray-900">
                          <MapPin className="w-4 h-4" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p className="truncate">{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.region}{" "}
                            {order.shippingAddress.postalCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Product Details Column */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                          <Package className="w-4 h-4" />
                          {hasMultipleItems ? "Order Items" : "Product Details"}
                        </h3>
                        {hasMultipleItems && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="flex items-center gap-1 text-xs"
                          >
                            {expandedOrderId === order.id ? (
                              <>
                                <ChevronUp className="w-3 h-3" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                Show All Items
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {hasMultipleItems && (order as any).items ? (
                        <>
                          {/* Show first item by default */}
                          <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={(order as any).items[0].image || "https://via.placeholder.com/80"}
                              alt={(order as any).items[0].name}
                              width={80}
                              height={80}
                              className="object-cover border border-gray-200 rounded-lg"
                            />
                            <div className="flex-1 space-y-2">
                              <h4 className="font-medium text-gray-900">
                                {(order as any).items[0].name}
                              </h4>
                              <div className="text-sm text-gray-600">
                                <p>
                                  {(order as any).items[0].category} →{" "}
                                  {(order as any).items[0].subCategory}
                                </p>
                                <p>
                                  Quantity:{" "}
                                  <span className="font-medium">
                                    {(order as any).items[0].quantity}
                                  </span>
                                </p>
                                <p>
                                  Price:{" "}
                                  <span className="font-medium">
                                    {new Intl.NumberFormat("en-NG", {
                                      style: "currency",
                                      currency: "NGN",
                                    }).format((order as any).items[0].price)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Show other items when expanded */}
                          <AnimatePresence>
                            {expandedOrderId === order.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                              >
                                {(order as any).items.slice(1).map((item: OrderItem) => (
                                  <div key={item.productId} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                                    <img
                                      src={item.image || "https://via.placeholder.com/80"}
                                      alt={item.name}
                                      width={80}
                                      height={80}
                                      className="object-cover border border-gray-200 rounded-lg"
                                    />
                                    <div className="flex-1 space-y-2">
                                      <h4 className="font-medium text-gray-900">
                                        {item.name}
                                      </h4>
                                      <div className="text-sm text-gray-600">
                                        <p>
                                          {item.category} → {item.subCategory}
                                        </p>
                                        <p>
                                          Quantity:{" "}
                                          <span className="font-medium">
                                            {item.quantity}
                                          </span>
                                        </p>
                                        <p>
                                          Price:{" "}
                                          <span className="font-medium">
                                            {new Intl.NumberFormat("en-NG", {
                                              style: "currency",
                                              currency: "NGN",
                                            }).format(item.price)}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {!expandedOrderId && totalItems > 1 && (
                            <p className="text-sm text-gray-500">
                              + {totalItems - 1} more item{totalItems - 1 > 1 ? 's' : ''}
                            </p>
                          )}
                        </>
                      ) : (
                        // Single product display
                        <div className="flex gap-4">
                          <img
                            src={order.product.image}
                            alt={order.product.name}
                            width={80}
                            height={80}
                            className="object-cover border border-gray-200 rounded-lg"
                          />
                          <div className="flex-1 space-y-2">
                            <h4 className="font-medium text-gray-900">
                              {order.product.name}
                            </h4>
                            <div className="text-sm text-gray-600">
                              <p>
                                {order.product.category} →{" "}
                                {order.product.subCategory}
                              </p>
                              <p>
                                Quantity:{" "}
                                <span className="font-medium">
                                  {order.quantity}
                                </span>
                              </p>
                              <p>
                                Price:{" "}
                                <span className="font-medium">
                                  {new Intl.NumberFormat("en-NG", {
                                    style: "currency",
                                    currency: "NGN",
                                  }).format(order.product.price)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Order Summary Column */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                        <CreditCard className="w-4 h-4" />
                        Order Summary
                      </h3>
                      {order.orderStatus !== "Delivered" && (
                        <p className="text-sm text-gray-600">
                          Waiting for vendor to mark this order as Delivered.
                        </p>
                      )}
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Amount:
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
                            }).format(orderTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Payment Method:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {order.paymentOption === "Pay Before Delivery"
                              ? "Credit Card"
                              : "Cash on Delivery"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order.id)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>

                        {order.orderStatus !== "Delivered" ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleConfirmReceipt(order.id)}
                            disabled={confirmingOrderId === order.id}
                            className="flex items-center gap-2"
                          >
                            {confirmingOrderId === order.id ? (
                              <div className="w-4 h-4 border-2 rounded-full border-t-white animate-spin" />
                            ) : (
                              "Confirm Order"
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setOrderToReview(order);
                              setIsReviewModalOpen(true);
                            }}
                            className="flex items-center gap-2"
                          >
                            Write Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {orders.length === 0 && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="py-12 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No orders found
                </h3>
                <p className="mb-6 text-gray-600">Start shopping to see your orders here.</p>
                <Button onClick={() => navigate("/products")}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && orderToReview && (
        <ReviewPromptModal
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          order={orderToReview}
        />
      )}
    </div>
  );
}