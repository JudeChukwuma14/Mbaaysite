// src/components/CancelPostponeForm.tsx
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getOrdersWithSession, OrderItem } from "@/utils/getOrderApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Check, Calendar, Mail, User, Phone, MapPin } from "lucide-react";

type FormData = {
  orderId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  action: "cancel" | "postpone";
  cancellationReason?: string;
  postponementFromDate?: string;
  postponementToDate?: string;
  reason: string;
  selectedItems: {
    productId: string;
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    maxQuantity: number;
    selected: boolean;
    image: string;
  }[];
};

export default function CancelPostponeForm() {
  const [isMounted, setIsMounted] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [userOrders, setUserOrders] = useState<any[]>([]);

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const userOne = useSelector((state: RootState) => state.user);
  const vendor = useSelector((state: RootState) => state.vendor);
  const role = userOne.token ? "user" : vendor.token ? "vendor" : null;
  const token = role === "user" ? userOne.token : role === "vendor" ? vendor.token : null;
  const isAuthenticated = !!token && !!role;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      action: "cancel",
      selectedItems: [],
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
    },
  });

  const action = watch("action");
  const selectedItems = watch("selectedItems");
  const selectedOrderId = watch("orderId");

  useEffect(() => {
    setIsMounted(true);
    // Set initial user data from Redux store
    if (user) {
      setValue("email", user.email || "");
      setValue("firstName", user.name );
      setValue("lastName", "");
      setValue("phone", user.phoneNumber || "");
      
      // Set address fields if available
    
      if (user.location.country) {
        setValue("country", user.location.country);
      }
      if (user.location.city) {
        setValue("city", user.location.city);
      }
    
    }
  }, [user, setValue]);

  // Fetch user orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated || !token) {
        navigate("/selectpath", { replace: true });
        return;
      }

      try {
        setIsLoadingOrder(true);
        const orders = await getOrdersWithSession(token, role);
        setUserOrders(orders);
        
        // If we have orders, set the first one as default
        if (orders.length > 0) {
          const firstOrder = orders[0];
          setValue("orderId", firstOrder.id);
          setOrderDetails(firstOrder);
          
          // Set address from order if user data is missing
          if (!user?.location && firstOrder.shippingAddress) {
            setValue("address", firstOrder.shippingAddress.street || "");
            setValue("city", firstOrder.shippingAddress.city || "");
            setValue("state", firstOrder.shippingAddress.region || "");
            setValue("country", firstOrder.shippingAddress.country || "");
          }
          
          // Initialize selected items from the order's items array
          const initialSelectedItems = firstOrder.items.map((item: OrderItem) => ({
            productId: item.id,
            itemId: `${firstOrder.id}-${item.id}`,
            name: item.name,
            price: item.price,
            quantity: 1,
            maxQuantity: item.quantity,
            selected: false,
            image: item.image
          }));
          setValue("selectedItems", initialSelectedItems);
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load orders";
        setOrderError(errorMessage);
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
        setIsLoadingOrder(false);
      }
    };

    loadOrders();
  }, [navigate, isAuthenticated, token, role, setValue, user]);

  // Update order details when order selection changes
  useEffect(() => {
    if (selectedOrderId && userOrders.length > 0) {
      const selectedOrder = userOrders.find(order => order.id === selectedOrderId);
      if (selectedOrder) {
        setOrderDetails(selectedOrder);
        
        // Update selected items for the new order
        const updatedSelectedItems = selectedOrder.items.map((item: OrderItem) => ({
          productId: item.id,
          itemId: `${selectedOrder.id}-${item.id}`,
          name: item.name,
          price: item.price,
          quantity: 1,
          maxQuantity: item.quantity,
          selected: selectedItems.find(si => si.itemId === `${selectedOrder.id}-${item.id}`)?.selected || false,
          image: item.image
        }));
        setValue("selectedItems", updatedSelectedItems);
      }
    }
  }, [selectedOrderId, userOrders, setValue]);

  // Handle item selection
  const handleItemSelection = (itemId: string, selected: boolean) => {
    const updatedItems = selectedItems.map(item =>
      item.itemId === itemId ? { ...item, selected } : item
    );
    setValue("selectedItems", updatedItems);
  };

  // Handle select all items
  const handleSelectAll = (selectAll: boolean) => {
    const updatedItems = selectedItems.map(item => ({
      ...item,
      selected: selectAll
    }));
    setValue("selectedItems", updatedItems);
  };

  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const updatedItems = selectedItems.map(item => {
      if (item.itemId === itemId) {
        return {
          ...item,
          quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity))
        };
      }
      return item;
    });
    setValue("selectedItems", updatedItems);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Filter only selected items
      const selectedProducts = data.selectedItems
        .filter(item => item.selected)
        .map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }));

      // Validation - at least one item must be selected
      if (selectedProducts.length === 0) {
        toast.error("Please select at least one item to proceed");
        return;
      }

      const payload: any = {
        orderId: data.orderId.trim(),
        email: data.email.trim().toLowerCase(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        country: data.country.trim(),
        state: data.state.trim(),
        city: data.city.trim(),
      };

      if (data.action === "cancel") {
        payload.isCancellation = true;
        payload.isPostponement = false;
        payload.cancellationReason = data.reason;
      } else {
        payload.isCancellation = false;
        payload.isPostponement = true;
        payload.postponementFromDate = data.postponementFromDate;
        payload.postponementToDate = data.postponementToDate;
        payload.reason = data.reason;
      }

      console.log("Submitting payload:", payload);

      const res = await fetch("https://ilosiwaju-mbaay-2025.com/api/v1/order/cancel-or-postpone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Request failed");

      toast.success("Request submitted successfully! We'll email you soon.");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Failed. Please check your details.");
    }
  };

  const selectedCount = selectedItems.filter(item => item.selected).length;
  const hasMultipleOrders = userOrders.length > 1;
  const allSelected = selectedItems.length > 0 && selectedItems.every(item => item.selected);
  // const someSelected = selectedItems.some(item => item.selected) && !allSelected;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header - Simple version */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4 border-2 border-gray-200">
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Order</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Cancel or postpone specific items from your order
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
            {/* Order Selection */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
              <label className="block text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Select Order
              </label>
              {hasMultipleOrders ? (
                <div className="relative">
                  <select
                    {...register("orderId", { required: "Please select an order" })}
                    className={`${inputClass} appearance-none pr-10 text-base ${errors.orderId ? "border-red-300 focus:border-red-500" : ""
                      }`}
                  >
                    <option value="">Choose order</option>
                    {userOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        Order #{order.orderId?.slice(-8) || order.id.slice(-8)} - {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <input
                  {...register("orderId", { required: "Order ID is required" })}
                  readOnly
                  className={`${inputClass} bg-gray-100 text-base`}
                  value={userOrders[0]?.id || ""}
                />
              )}
              {errors.orderId && (
                <p className="text-red-600 text-sm flex items-center mt-2">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.orderId.message}
                </p>
              )}
            </div>

            {/* Customer Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("firstName", { required: "First name is required" })}
                    className={`${inputClass} ${errors.firstName ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("lastName", { required: "Last name is required" })}
                    className={`${inputClass} ${errors.lastName ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm">{errors.lastName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Please enter a valid email address"
                        }
                      })}
                      type="email"
                      className={`${inputClass} ${errors.email ? 'border-red-300 focus:border-red-500' : ''} pl-10`}
                      placeholder="you@example.com"
                    />
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("phone", { required: "Phone number is required" })}
                      type="tel"
                      className={`${inputClass} ${errors.phone ? 'border-red-300 focus:border-red-500' : ''} pl-10`}
                      placeholder="+234 123 456 7890"
                    />
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-sm">{errors.phone.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("address", { required: "Address is required" })}
                      className={`${inputClass} ${errors.address ? 'border-red-300 focus:border-red-500' : ''} pl-10`}
                      placeholder="123 Main Street"
                    />
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.address && (
                    <p className="text-red-600 text-sm">{errors.address.message}</p>
                  )}
                </div>

                {/* City, State, Country */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("city", { required: "City is required" })}
                    className={`${inputClass} ${errors.city ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder="Lagos"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("state", { required: "State is required" })}
                    className={`${inputClass} ${errors.state ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder="Lagos"
                  />
                  {errors.state && (
                    <p className="text-red-600 text-sm">{errors.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("country", { required: "Country is required" })}
                    className={`${inputClass} ${errors.country ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder="Nigeria"
                  />
                  {errors.country && (
                    <p className="text-red-600 text-sm">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items Selection - Show only when order is loaded */}
            {selectedOrderId && orderDetails && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <p className="text-lg font-semibold text-gray-900">Order Items</p>
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                      {orderDetails.items.length} item{orderDetails.items.length !== 1 ? 's' : ''} in order
                    </span>
                  </div>
                  {!isLoadingOrder && orderDetails && orderDetails.items.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleSelectAll(!allSelected)}
                        className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100"
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${allSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-400'}`}>
                          {allSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {isLoadingOrder && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading order details...</p>
                  </div>
                )}

                {orderError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600">{orderError}</p>
                  </div>
                )}

                {!isLoadingOrder && orderDetails && (
                  <div className="space-y-3">
                    {orderDetails.items.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-600">No items found in this order.</p>
                      </div>
                    ) : (
                      <>
                        {selectedItems.map((item) => (
                          <div
                            key={item.itemId}
                            className={`bg-white p-4 rounded-lg border-2 transition-all ${item.selected
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-1">
                                <input
                                  type="checkbox"
                                  checked={item.selected}
                                  onChange={(e) => handleItemSelection(item.itemId, e.target.checked)}
                                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400"
                                />
                                <img
                                  src={item.image || "https://via.placeholder.com/80"}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                                    <span>Price: ${item.price.toFixed(2)}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>Available: {item.maxQuantity}</span>
                                    {item.selected && (
                                      <>
                                        <span className="text-gray-400">•</span>
                                        <span className="font-medium text-orange-600">
                                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {item.selected && (
                                <div className="flex items-center space-x-4 ml-4">
                                  <div className="flex flex-col items-end">
                                    <span className="text-sm text-gray-600 mb-1">Quantity to {action}:</span>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={item.quantity <= 1}
                                      >
                                        -
                                      </button>
                                      <span className="w-12 text-center font-medium bg-gray-50 py-1 rounded">
                                        {item.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={item.quantity >= item.maxQuantity}
                                      >
                                        +
                                      </button>
                                      <span className="text-sm text-gray-500 ml-2">
                                        of {item.maxQuantity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {selectedCount > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Total refund amount: $
                          {selectedItems
                            .filter(item => item.selected)
                            .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                            .toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Items will be removed from your order</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Selection */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-lg font-semibold text-gray-900 mb-4">What would you like to do with selected items?</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${action === "cancel"
                    ? 'border-red-500 bg-red-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input
                    type="radio"
                    value="cancel"
                    {...register("action")}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 ${action === "cancel" ? 'border-red-500 bg-red-500' : 'border-gray-400'
                    }`}>
                    {action === "cancel" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Cancel Items</span>
                    <p className="text-sm text-gray-600 mt-1">Get refund for selected items</p>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${action === "postpone"
                    ? 'border-orange-500 bg-orange-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input
                    type="radio"
                    value="postpone"
                    {...register("action")}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 ${action === "postpone" ? 'border-orange-500 bg-orange-500' : 'border-gray-400'
                    }`}>
                    {action === "postpone" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Postpone Delivery</span>
                    <p className="text-sm text-gray-600 mt-1">Reschedule selected items</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Date Selection - Conditional */}
            {action === "postpone" && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Preferred New Delivery Dates</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700 mb-2">From Date <span className="text-red-500">*</span></label>
                    <input
                      {...register("postponementFromDate", {
                        required: action === "postpone" ? "Start date is required" : false
                      })}
                      type="date"
                      className={`${inputClass} ${errors.postponementFromDate ? 'border-red-300 focus:border-red-500' : ''}`}
                      min={isMounted ? new Date().toISOString().split('T')[0] : undefined}
                    />
                    {errors.postponementFromDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.postponementFromDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700 mb-2">To Date <span className="text-red-500">*</span></label>
                    <input
                      {...register("postponementToDate", {
                        required: action === "postpone" ? "End date is required" : false
                      })}
                      type="date"
                      className={`${inputClass} ${errors.postponementToDate ? 'border-red-300 focus:border-red-500' : ''}`}
                      min={isMounted ? new Date().toISOString().split('T')[0] : undefined}
                    />
                    {errors.postponementToDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.postponementToDate.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("reason", { required: "Please tell us why you're making this request" })}
                rows={5}
                className={`${inputClass} resize-none ${errors.reason ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="Please share your reason for cancellation or postponement (e.g., Changed my mind, wrong size, traveling, etc.)"
              />
              {errors.reason && (
                <p className="text-red-600 text-sm flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.reason.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting || !selectedOrderId || isLoadingOrder || selectedCount === 0}
              className={`w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg ${isSubmitting ? 'cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Request...
                </div>
              ) : (
                `Submit Request for ${selectedCount} Item${selectedCount !== 1 ? 's' : ''}`
              )}
            </button>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                We'll process your request and send a confirmation email within 24 hours.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Enhanced input styles
const inputClass = "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500";