
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, ChevronDown, MapPin, User, Phone, Mail, Package, Calendar, CreditCard } from "lucide-react"
import { confirmOrderReceived, getOrdersWithSession } from "@/utils/getOrderApi"
import { formatDate, getPaymentStatusColor, getStatusColor } from "@/utils/orderUtils"

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-gray-700">Loading orders...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                    <Calendar className="h-4 w-4" />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-gray-900">{order.buyer.fullName}</p>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-3 w-3" />
                        {order.buyer.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-3 w-3" />
                        {order.buyer.phone}
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600 leading-relaxed">
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
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Product Details
                    </h3>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={order.product.image}
                          alt={order.product.name}
                          width={80}
                          height={80}
                          className="rounded-lg border border-gray-200 object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium text-gray-900 leading-tight">{order.product.name}</h4>
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
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Order Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Amount:</span>
                        <span className="text-lg font-bold text-gray-900">₦{order.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <span className="text-sm font-medium text-gray-900">{order.paymentOption}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order.id)}
                        className="flex items-center gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          >
                            Change Status
                            <ChevronDown className="h-4 w-4" />
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
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Orders will appear here when customers place them.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
