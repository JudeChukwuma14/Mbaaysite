"use client";

import { useParams } from "react-router-dom";
import {
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useOneOrder, useUpdateOrderStatus } from "@/hook/useOrders";
import { Order } from "@/utils/orderVendorApi";

const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const user: any = useSelector((state: RootState) => state.vendor);

  // Fetch order details
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useOneOrder(orderId!, user?.token);

  // Update order status mutation
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const calculateTotal = (items: Order["items"]) => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "On Delivery":
        return "bg-yellow-400 text-white";
      case "Delivered":
        return "bg-green-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      case "Pending":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleStatusUpdate = (newStatus: Order["status"]) => {
    if (!orderId || !user.token) return;

    updateOrderStatusMutation.mutate({
      orderId,
      status: newStatus,
      token: user.token,
    });
  };

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  // Default location (you can update this based on delivery address)
  const defaultLocation = { lat: 6.5244, lng: 3.3792 };

  // Loading state
  if (isLoading) {
    return (
      <main className="p-5 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="text-lg text-gray-600">
              Loading order details...
            </span>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (isError || !order) {
    return (
      <main className="p-5 bg-gray-100 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load order details
            </h3>
            <p className="text-gray-600 mb-4">
              {error instanceof Error
                ? error.message
                : "Order not found or an unexpected error occurred"}
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => refetch()}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { subtotal, tax, total } = calculateTotal(order.items);

  return (
    <main className="p-5 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order #{order.orderId}</p>
          </div>
        </div>

        {/* Status Update Buttons */}
        <div className="flex gap-2">
          {order.status !== "Delivered" && order.status !== "Cancelled" && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStatusUpdate("On Delivery")}
                disabled={updateOrderStatusMutation.isPending}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors"
              >
                Mark as On Delivery
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStatusUpdate("Delivered")}
                disabled={updateOrderStatusMutation.isPending}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                Mark as Delivered
              </motion.button>
            </>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Map and Delivery Status */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-5 relative">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Delivery Status
          </h2>
          <div
            className={`absolute top-5 right-5 px-4 py-2 rounded-full ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </div>
          <div className="h-64 rounded overflow-hidden bg-gray-200">
            <LoadScript
              googleMapsApiKey={
                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY"
              }
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultLocation}
                zoom={14}
              >
                <Marker position={defaultLocation} />
              </GoogleMap>
            </LoadScript>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              Delivery Address
            </h4>
            <p className="text-gray-600">{order.deliveryAddress.fullAddress}</p>
          </div>
        </div>

        {/* Customer Details */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white rounded-lg shadow p-5 flex flex-col items-center"
        >
          <div className="w-[220px] h-[200px] mb-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
            <User className="w-20 h-20 text-white" />
          </div>
          <h3 className="font-bold text-lg text-center">
            {order.customer.name}
          </h3>
          <p className="text-gray-600 mb-4">Customer</p>
          <div className="flex space-x-3">
            <motion.a
              href={`tel:${order.customer.phone}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
            </motion.a>
            <motion.a
              href={`https://wa.me/${order.customer.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp className="w-5 h-5" />
            </motion.a>
            <motion.a
              href={`mailto:${order.customer.email}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Phone: {order.customer.phone}
            </p>
            <p className="text-sm text-gray-600">
              Email: {order.customer.email}
            </p>
          </div>
        </motion.div>

        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-5">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {item.productName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Product ID: {item.productId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="font-bold">{formatCurrency(item.price)}</p>
                  <p className="text-sm text-gray-600">
                    Total: {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-4 border-t">
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Order Information
          </h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Order Date</h4>
              <p className="text-gray-600">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Payment Status</h4>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  order.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-800"
                    : order.paymentStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Order Status</h4>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Last Updated</h4>
              <p className="text-gray-600">{formatDate(order.updatedAt)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default OrderDetailsPage;
