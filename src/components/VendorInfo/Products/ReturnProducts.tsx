import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
} from "lucide-react";

const returnRequests = [
  {
    id: "RET-001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    productName: "Wireless Bluetooth Headphones",
    productImage: "/wireless-headphones.png",
    orderNumber: "ORD-12345",
    returnReason: "Defective - Left speaker not working",
    requestDate: "2024-01-15",
    status: "pending",
    refundAmount: "$89.99",
    description:
      "The left speaker stopped working after 2 weeks of use. Customer has provided video evidence of the issue.",
  },
  {
    id: "RET-002",
    customerName: "Mike Chen",
    customerEmail: "mike.chen@email.com",
    productName: "Fitness Smartwatch",
    productImage: "/fitness-smartwatch.png",
    orderNumber: "ORD-12346",
    returnReason: "Wrong size - Too small",
    requestDate: "2024-01-14",
    status: "approved",
    refundAmount: "$199.99",
    description:
      "Customer ordered medium size but needs large. Product is in original packaging, unused.",
  },
  {
    id: "RET-003",
    customerName: "Emma Davis",
    customerEmail: "emma.davis@email.com",
    productName: "Portable Bluetooth Speaker",
    productImage: "/bluetooth-speaker.png",
    orderNumber: "ORD-12347",
    returnReason: "Not as described - Sound quality poor",
    requestDate: "2024-01-13",
    status: "rejected",
    refundAmount: "$45.99",
    description:
      "Customer claims sound quality is poor, but product is working as designed. Return period has expired.",
  },
  {
    id: "RET-004",
    customerName: "David Wilson",
    customerEmail: "david.w@email.com",
    productName: "Wireless Bluetooth Headphones",
    productImage: "/wireless-headphones.png",
    orderNumber: "ORD-12348",
    returnReason: "Damaged in shipping",
    requestDate: "2024-01-12",
    status: "completed",
    refundAmount: "$89.99",
    description:
      "Package arrived with damaged headphones. Refund processed and replacement sent.",
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-blue-100 text-blue-800 border-blue-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-green-100 text-green-800 border-green-200",
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  completed: Package,
};

const ReturnProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReturn, setSelectedReturn] = useState<
    (typeof returnRequests)[0] | null
  >(null);

  const filteredReturns = returnRequests.filter((request) => {
    const matchesSearch =
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (returnId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`[v0] Updating return ${returnId} to status: ${newStatus}`);
  };
  return (
    <div className="space-y-6 overflow-x-hidden max-w-full p-0">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Return Management
          </h1>
          <p className="mt-1 text-gray-600">
            Manage product returns from your customers
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>{returnRequests.length} total returns</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <Input
            placeholder="Search by customer, product, or return ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Pending</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {returnRequests.filter((r) => r.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                Approved
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {returnRequests.filter((r) => r.status === "approved").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-gray-600">
                Rejected
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {returnRequests.filter((r) => r.status === "rejected").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                Completed
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {returnRequests.filter((r) => r.status === "completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Returns List */}
      <Card>
        <CardHeader>
          <CardTitle>Return Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReturns.map((request) => {
              const StatusIcon =
                statusIcons[request.status as keyof typeof statusIcons];
              return (
                <div
                  key={request.id}
                  className="p-4 transition-colors border rounded-lg hover:bg-gray-50 overflow-x-hidden"
                >
                  <div className="flex items-start justify-between flex-wrap">
                    <div className="flex gap-4 flex-1">
                      <img
                        src={
                          request.productImage ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={request.productName}
                        className="object-cover w-16 h-16 border rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 break-all">
                            {request.id}
                          </h3>
                          <Badge
                            className={
                              statusColors[
                                request.status as keyof typeof statusColors
                              ]
                            }
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="mb-1 text-sm text-gray-600 break-all">
                          <span className="font-medium">
                            {request.customerName}
                          </span>{" "}
                          • {request.customerEmail}
                        </p>
                        <p className="mb-1 font-medium text-gray-900">
                          {request.productName}
                        </p>
                        <p className="mb-2 text-sm text-gray-600">
                          Order: {request.orderNumber} • Requested:{" "}
                          {request.requestDate}
                        </p>
                        <p className="text-sm font-medium text-red-600">
                          Reason: {request.returnReason}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {request.refundAmount}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReturn(request)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(request.id, "approved")
                              }
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(request.id, "rejected")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Return Details Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Return Details - {selectedReturn.id}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReturn(null)}
                >
                  {"✕"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <img
                  src={
                    selectedReturn.productImage ||
                    "/placeholder.svg?height=96&width=96"
                  }
                  alt={selectedReturn.productName}
                  className="object-cover w-24 h-24 border rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {selectedReturn.productName}
                  </h3>
                  <p className="text-gray-600">
                    Order: {selectedReturn.orderNumber}
                  </p>
                  <p className="text-gray-600">
                    Refund Amount: {selectedReturn.refundAmount}
                  </p>
                  <Badge
                    className={`mt-2 ${
                      statusColors[
                        selectedReturn.status as keyof typeof statusColors
                      ]
                    }`}
                  >
                    {selectedReturn.status.charAt(0).toUpperCase() +
                      selectedReturn.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Customer Information</h4>
                  <p className="text-sm text-gray-600">
                    Name: {selectedReturn.customerName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {selectedReturn.customerEmail}
                  </p>
                  <p className="text-sm text-gray-600">
                    Request Date: {selectedReturn.requestDate}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Return Information</h4>
                  <p className="text-sm text-gray-600">
                    Reason: {selectedReturn.returnReason}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {selectedReturn.status}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Description</h4>
                <p className="p-3 text-sm text-gray-700 rounded-lg bg-gray-50">
                  {selectedReturn.description}
                </p>
              </div>

              {selectedReturn.status === "pending" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedReturn.id, "approved");
                      setSelectedReturn(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Approve Return
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleStatusUpdate(selectedReturn.id, "rejected");
                      setSelectedReturn(null);
                    }}
                  >
                    Reject Return
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Customer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReturnProducts;
