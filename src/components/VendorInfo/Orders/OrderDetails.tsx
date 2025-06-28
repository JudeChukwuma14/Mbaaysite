import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import { useSelector } from "react-redux";
// import type { RootState } from "@/redux/store";
import { useOneOrder } from "@/hook/useOrders";
import type { Orders } from "@/utils/orderVendorApi";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationCoordinates {
  lat: number;
  lng: number;
}

const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  // const user: any = useSelector((state: RootState) => state.vendor);

  // New state for map functionality
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(
    null
  );
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  // Fetch order details
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useOneOrder(orderId);

  // Geocoding function using Nominatim
  const geocodeAddress = async (address: string) => {
    if (!address) return;

    setIsGeocodingLoading(true);
    setGeocodingError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        setCoordinates({
          lat: Number.parseFloat(location.lat),
          lng: Number.parseFloat(location.lon),
        });
      } else {
        setGeocodingError("Location not found");
        // Fallback to Lagos, Nigeria coordinates
        setCoordinates({ lat: 6.5244, lng: 3.3792 });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setGeocodingError("Failed to load location");
      // Fallback to Lagos, Nigeria coordinates
      setCoordinates({ lat: 6.5244, lng: 3.3792 });
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  // Geocode address when order data is available
  useEffect(() => {
    if (order?.buyerInfo?.address) {
      geocodeAddress(order.buyerInfo.address);
    }
  }, [order?.buyerInfo?.address]);

  const calculateTotal = (items: Orders["items"]) => {
    const subtotal = items?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
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

  const getStatusColor = (status: Orders["status"]) => {
    switch (status) {
      case "Processing":
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

  // const mapContainerStyle = {
  //   width: "100%",
  //   height: "100%",
  // };

  // Default location (you can update this based on delivery address)

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
            <p className="text-gray-600">Order #{order._id}</p>
          </div>
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

          <div className="h-64 rounded overflow-hidden bg-gray-200 relative">
            {isGeocodingLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  <span className="text-gray-600">Loading map...</span>
                </div>
              </div>
            ) : coordinates ? (
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                className="rounded"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[coordinates.lat, coordinates.lng]}>
                  <Popup>
                    <div className="text-center">
                      <strong>Delivery Location</strong>
                      <br />
                      {order.buyerInfo?.address}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {geocodingError || "Unable to load map"}
                  </p>
                  {order.buyerInfo?.address && (
                    <button
                      onClick={() => geocodeAddress(order.buyerInfo.address)}
                      className="mt-2 px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              Delivery Address
            </h4>
            <p className="text-gray-600">{order?.buyerInfo?.address}</p>
            {coordinates && (
              <p className="text-sm text-gray-500 mt-1">
                Coordinates: {coordinates.lat.toFixed(6)},{" "}
                {coordinates.lng.toFixed(6)}
              </p>
            )}
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
            {order.buyerInfo.first_name}
          </h3>
          <p className="text-gray-600 mb-4">Customer</p>
          <div className="flex space-x-3">
            <motion.a
              href={`tel:${order.buyerInfo.phone}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
            </motion.a>
            <motion.a
              href={`https://wa.me/${order.buyerInfo.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp className="w-5 h-5" />
            </motion.a>
            <motion.a
              href={`mailto:${order.buyerInfo.email}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Phone: {order.buyerInfo.phone}
            </p>
            <p className="text-sm text-gray-600">
              Email: {order.buyerInfo.email}
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
            {order?.items?.map((item: any, index: any) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
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
                      {order.product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Product ID: {order.product._id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="font-bold">{formatCurrency(order.price)}</p>
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
              <p className="text-gray-600">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Payment Status</h4>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  order.payStatus === "Successful"
                    ? "bg-green-600 text-green-100"
                    : order.payStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-green-800"
                }`}
              >
                {order.payStatus}
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
