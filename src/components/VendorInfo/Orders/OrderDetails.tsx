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
  console.log("Order Details:", order);

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

  type ProductType = {
    price: number;
    quantity?: number;
    image?: string;
    name?: string;
    _id?: string;
  };

  const calculateTotal = (
    product: ProductType | ProductType[],
    quantity?: number
  ) => {
    let subtotal = 0;
    if (Array.isArray(product)) {
      subtotal = product.reduce(
        (sum, item) => sum + item.price * (item.quantity ?? 1),
        0
      );
    } else if (product?.price) {
      subtotal = product.price * (quantity ?? 1);
    }
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
      <main className="min-h-screen p-5 bg-gray-100">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
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
      <main className="min-h-screen p-5 bg-gray-100">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <div className="text-center">
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Failed to load order details
            </h3>
            <p className="mb-4 text-gray-600">
              {error instanceof Error
                ? error.message
                : "Order not found or an unexpected error occurred"}
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => refetch()}
                className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
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

  const { subtotal, tax, total } = calculateTotal(
    order.product,
    order.quantity
  );

  return (
    <main className="min-h-screen p-5 bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="p-2 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
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
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Map and Delivery Status */}
        <div className="relative p-5 bg-white rounded-lg shadow lg:col-span-2">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
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

          <div className="relative h-64 overflow-hidden bg-gray-200 rounded">
            {isGeocodingLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
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
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">
                    {geocodingError || "Unable to load map"}
                  </p>
                  {order.buyerInfo?.address && (
                    <button
                      onClick={() => geocodeAddress(order.buyerInfo.address)}
                      className="px-3 py-1 mt-2 text-sm text-white bg-orange-500 rounded hover:bg-orange-600"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 mt-4 rounded-lg bg-gray-50">
            <h4 className="mb-2 font-semibold text-gray-800">
              Delivery Address
            </h4>
            <p className="text-gray-600">{order?.buyerInfo?.address}</p>
            {coordinates && (
              <p className="mt-1 text-sm text-gray-500">
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
          className="flex flex-col items-center p-5 bg-white rounded-lg shadow"
        >
          <div className="w-[220px] h-[200px] mb-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
            <User className="w-20 h-20 text-white" />
          </div>
          <h3 className="text-lg font-bold text-center">
            {order.buyerInfo.first_name}
          </h3>
          <p className="mb-4 text-gray-600">Customer</p>
          <div className="flex space-x-3">
            <motion.a
              href={`tel:${order.buyerInfo.phone}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 text-white transition-colors bg-orange-500 rounded-full hover:bg-orange-600"
            >
              <Phone className="w-5 h-5" />
            </motion.a>
            <motion.a
              href={`https://wa.me/${order.buyerInfo.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 text-white transition-colors bg-green-500 rounded-full hover:bg-green-600"
            >
              <FaWhatsapp className="w-5 h-5" />
            </motion.a>
            <motion.a
              href={`mailto:${order.buyerInfo.email}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
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
        <div className="p-5 bg-white rounded-lg shadow lg:col-span-2">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
            <Package className="w-5 h-5 text-orange-500" />
            Order Items
          </h2>
          <div className="space-y-4">
            {order?.product && (
              <div className="flex items-center justify-between pb-4 border-b last:border-b-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 overflow-hidden bg-gray-200 rounded-lg">
                    {order?.product.image ? (
                      <img
                        src={order?.product.image || "/placeholder.svg"}
                        alt={order.product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {order.product?.name || "Unknown Product"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Product ID: {order.product?._id || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Quantity: {order.quantity}
                  </p>
                  <p className="font-bold">
                    {formatCurrency(order?.product.price)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total:{" "}
                    {formatCurrency(order?.product.price * order.quantity)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="pt-4 mt-6 border-t">
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between pt-2 text-lg font-bold border-t">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="p-5 bg-white rounded-lg shadow">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
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
                    ? "bg-blue-500 text-white"
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
