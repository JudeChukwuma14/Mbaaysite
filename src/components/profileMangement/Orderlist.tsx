
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, ChevronDown, MapPin, User, Phone, Mail, Package, Calendar, CreditCard } from "lucide-react"
import { getOrdersWithSession } from "@/utils/getOrderApi"
import { formatDate, getPaymentStatusColor, getStatusColor } from "@/utils/orderUtils"
import { confirmOrderReceived } from "@/utils/orderApi"

// Mock data structure
interface Order {
  id: string
  buyer: {
    fullName: string
    email: string
    phone: string
  }
  shippingAddress: {
    street: string
    city: string
    region: string
    country: string
    postalCode: string
  }
  product: {
    name: string
    category: string
    subCategory: string
    image: string
    price: number
  }
  quantity: number
  totalPrice: number
  paymentStatus: "Paid" | "Pending" | "Failed"
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Completed"
  paymentOption: string
  createdAt: string
}



export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrdersWithSession();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);


  const handleStatusChange = async (orderId: string, newStatus: Order["orderStatus"]) => {
    try {
      if (newStatus === "Delivered") {
        await confirmOrderReceived(orderId);
      }
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update order status");
    }
  };

  const handleViewDetails = (orderId: string) => {
    // Handle view details action
    console.log(`Viewing details for order ${orderId}`)
  }


  if (loading) return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 md:p-6">
      <div className="text-center">
        <p className="text-lg text-gray-700">Loading orders...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 md:p-6">
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


  return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Orders List */}
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
                            Price: <span className="font-medium">₦{order.product.price.toFixed(2)}</span>
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
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Amount:</span>
                        <span className="text-lg font-bold text-gray-900">₦{order.totalPrice.toFixed(2)}</span>
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
                          >
                            Change Status
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, "Delivered")}
                            disabled={order.orderStatus === "Delivered"}
                          >
                            Mark as Delivered
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

        {/* Empty State (if no orders) */}
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
  )
}
