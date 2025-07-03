import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, ChevronDown, MapPin, User, Phone, Mail, Package, Calendar, CreditCard } from "lucide-react";
import { getOrdersWithSession, Order } from "@/utils/getOrderApi";
import { confirmOrderReceived } from "@/utils/orderApi";
import { formatDate, getPaymentStatusColor, getStatusColor } from "@/utils/orderUtils";
import { useNavigate } from "react-router-dom";
import store, { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Please log in to view your orders.");
      navigate("/selectpath");
      return;
    }



    const loadOrders = async () => {
      try {
        const state = store.getState();
        console.log("Redux State on Load Orders:", {
          userToken: state.user?.token ? state.user.token.slice(0, 10) + "..." : "undefined",
          vendorToken: state.vendor?.token ? state.vendor.token.slice(0, 10) + "..." : "undefined",
          sessionId: state.session?.sessionId || "undefined",
        });
        const data = await getOrdersWithSession();
        console.log("Loaded Orders:", data);
        setOrders(data);
      } catch (err: any) {
        const errorMessage = err.message || String(err);
        setError(errorMessage);
        if (err.message === "Authentication token is missing. Please log in again." ||
          err.message.includes("Access denied. No token provided")) {
          toast.error("Session expired. Please log in again.");
          navigate("/selectpath");
        }
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [navigate, isAuthenticated]);

  const handleConfirmReceipt = async (orderId: string) => {
    if (!isAuthenticated) {
      toast.info("Please log in to confirm order receipt.");
      navigate("/selectpath");
      return;
    }
    setConfirmingOrderId(orderId);
    try {
      await confirmOrderReceived(orderId);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: "Completed" } : order
        )
      );
      toast.success("Order receipt confirmed successfully!");
    } catch (error: any) {
      if (error.message === "order is not marked as delivered yet") {
        toast.error("This order must be marked as Delivered by the vendor before you can confirm receipt.");
      } else if (error.message.includes("Access denied. No token provided")) {
        toast.error("Session expired. Please log in again.");
        navigate("/selectpath");
      } else {
        console.error("Confirm Receipt Error:", error.message, error.response?.data);
      }
    } finally {
      setConfirmingOrderId(null);
    }
  };
  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 md:p-6">
        <div className="text-center">
          <p className="text-lg text-gray-700">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 md:p-6">
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
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="transition-shadow bg-white border border-gray-200 shadow-sm hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-900">#{order.id}</span>
                    <Badge className={`${getStatusColor(order.orderStatus)} border`}>
                      {order.orderStatus}
                    </Badge>
                    <Badge className={`${getPaymentStatusColor(order.paymentStatus)} border`}>
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
                      <p className="font-medium text-gray-900">{order.buyer.fullName}</p>
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
                      <h4 className="flex items-center gap-2 mb-2 font-medium text-gray-900">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
                      </h4>
                      <div className="text-sm leading-relaxed text-gray-600">
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
                      <div className="flex-shrink-0">
                        <img
                          src={order.product.image}
                          alt={order.product.name}
                          width={80}
                          height={80}
                          className="object-cover border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium leading-tight text-gray-900">{order.product.name}</h4>
                        <div className="text-sm text-gray-600">
                          <p>
                            {order.product.category} → {order.product.subCategory}
                          </p>
                          <p className="mt-1">
                            Quantity: <span className="font-medium">{order.quantity}</span>
                          </p>
                          <p className="mt-1">
                            Price: <span className="font-medium">
                              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
                                order.product.price
                              )}
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
                        This order must be marked as Delivered by the vendor before you can confirm receipt.
                      </p>
                    )}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Amount:</span>
                        <span className="text-lg font-bold text-gray-900">
                          {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
                            order.totalPrice
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <span className="text-sm font-medium text-gray-900">{order.paymentOption}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order.id)}
                        className="flex items-center gap-2 text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                            disabled={order.orderStatus === "Cancelled" || order.orderStatus === "Delivered"}
                          >
                            Change Status
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleConfirmReceipt(order.id)}
                            disabled={
                              confirmingOrderId === order.id ||
                              order.orderStatus !== "Delivered"
                            }
                          >
                            {confirmingOrderId === order.id ? (
                              <div className="w-4 h-4 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                            ) : order.orderStatus !== "Delivered" ? (
                              "Waiting for Delivery"
                            ) : (
                              "Confirm Receipt"
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>Processing</DropdownMenuItem>
                          <DropdownMenuItem disabled>Shipped</DropdownMenuItem>
                          <DropdownMenuItem disabled>Cancelled</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No orders found</h3>
              <p className="text-gray-600">Orders will appear here when customers place them.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}