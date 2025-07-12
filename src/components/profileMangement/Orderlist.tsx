// src/components/OrderList.tsx
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, MapPin, User, Phone, Mail, Package, Calendar, CreditCard } from "lucide-react";
import { getOrdersWithSession, Order } from "@/utils/getOrderApi";
import { confirmOrderReceived } from "@/utils/orderApi";
import { formatDate, getPaymentStatusColor, getStatusColor } from "@/utils/orderUtils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrders, setConfirmedOrders] = useState<string[]>([]);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const vendor = useSelector((state: RootState)=>state.vendor)
  const isAuthenticated = !!user.token || !!vendor.token
  const token = user.token || vendor.token

  // Debug Redux state
  useEffect(() => {
    console.log("Redux state:", { user, token });
    console.log("Redux state vendor", {vendor, token})
  }, [user, vendor, token]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      console.log("Authentication failed:", { isAuthenticated, token });
      toast.info("Please log in to view your orders.");
      navigate("/selectpath", { replace: true });
      return;
    }

    const loadOrders = async () => {
      try {
        console.log("Calling getOrdersWithSession with:", { token });
        const data = await getOrdersWithSession(token);
        setOrders(data);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load orders";
        setError(errorMessage);
        if (
          errorMessage.includes("Authentication token is missing") ||
          errorMessage.includes("Access denied") ||
          errorMessage.includes("User ID is required") ||
          errorMessage.includes("Failed to fetch orders")
        ) {
          toast.error("Session expired or invalid authentication. Please log in again.");
          navigate("/selectpath", { replace: true });
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [navigate, isAuthenticated, token]);

  const handleConfirmReceipt = async (orderId: string) => {
    try {
      await confirmOrderReceived(orderId);
      setConfirmedOrders((prev) => [...prev, orderId]);
      toast.success("Payment confirmed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm payment");
    }
  };
  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <p className="text-lg text-gray-700">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center text-red-500">
          <p className="text-lg font-medium">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
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
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md"
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-900">
                      #{order.orderId}
                    </span>
                    <Badge className={`${getStatusColor(order.orderStatus)} border`}>
                      {order.orderStatus}
                    </Badge>
                    <Badge
                      className={`${getPaymentStatusColor(order.paymentStatus)} border`}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                        {order.buyer.email}
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
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.region}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <Package className="w-4 h-4" />
                      Product Details
                    </h3>
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
                            {order.product.category} → {order.product.subCategory}
                          </p>
                          <p>
                            Quantity: <span className="font-medium">{order.quantity}</span>
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
                  </div>

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
                        <span className="text-sm text-gray-600">Total Amount:</span>
                        <span className="text-lg font-bold text-gray-900">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          }).format(order.totalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payment Method:</span>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfirmReceipt(order.id)}
                        disabled={confirmedOrders.includes(order.id)} // Disable if confirmed
                        className="flex items-center gap-2"
                      >
                        {confirmedOrders.includes(order.id) ? "Confirmed" : "Confirm Payment"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {orders.length === 0 && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No orders found
                </h3>
                <p className="text-gray-600">Place an order to see it here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}