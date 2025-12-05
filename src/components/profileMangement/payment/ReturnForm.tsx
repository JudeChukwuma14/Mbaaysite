// src/components/ReturnForm.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { getOrdersWithSession, OrderItem } from "@/utils/getOrderApi";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";

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
  returnReason: string;
  productCondition: "new" | "lightly_used" | "defective" | "wrong_item";
  returnMethod: "dropoff" | "pickup" | "courier";
  additionalComments?: string;
};

export default function ReturnForm() {
  const user = useSelector((state: RootState) => state.user.user);
  const userOne = useSelector((state: RootState) => state.user);
  const vendor = useSelector((state: RootState) => state.vendor);
  const role = userOne.token ? "user" : vendor.token ? "vendor" : null;
  const token =
    role === "user" ? userOne.token : role === "vendor" ? vendor.token : null;
  const isAuthenticated = !!token && !!role;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  const [selectedReturnItems, setSelectedReturnItems] = useState<
    {
      productId: string;
      itemId: string;
      name: string;
      price: number;
      quantity: number;
      maxQuantity: number;
      selected: boolean;
      image: string;
    }[]
  >([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const orderId = watch("orderId");
  const productCondition = watch("productCondition");
  const returnMethod = watch("returnMethod");

  // Fetch user orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated || !token) {
        navigate("/selectpath", { replace: true });
        return;
      }

      try {
        setIsLoadingOrders(true);
        const orders = await getOrdersWithSession(token, role);
        setUserOrders(orders);

        if (orders.length > 0) {
          const firstOrder = orders[0];
          setValue("orderId", firstOrder.id);
          setSelectedOrderDetails(firstOrder);

          // Initialize return items
          const initialReturnItems = firstOrder.items.map(
            (item: OrderItem, index: number) => ({
              productId: item.productId || item.id,
              itemId: `${firstOrder.id}-${item.productId || item.id}`,
              name: item.name,
              price: item.price,
              quantity: item.quantity, // Default to full quantity
              maxQuantity: item.quantity,
              selected: true, // Default all items selected for return
              image: item.image,
            })
          );
          setSelectedReturnItems(initialReturnItems);
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load orders";
        toast.error(errorMessage);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    loadOrders();
  }, [navigate, isAuthenticated, token, role, setValue]);

  // Auto-fill user info from Redux
  useEffect(() => {
    if (user) {
      setValue("email", user.email || "");
      setValue("firstName", user.name || "");
      setValue("lastName", "");
      setValue("phone", user.phoneNumber || "");

      if (user.location?.country) {
        setValue("country", user.location.country);
      }
      if (user.location?.city) {
        setValue("city", user.location.city);
      }
    }
  }, [user, setValue]);

  // Update order details when order changes
  useEffect(() => {
    if (orderId && userOrders.length > 0) {
      const selectedOrder = userOrders.find((order) => order.id === orderId);
      if (selectedOrder) {
        setSelectedOrderDetails(selectedOrder);

        // Update return items for the new order
        const updatedReturnItems = selectedOrder.items.map(
          (item: OrderItem) => ({
            productId: item.productId || item.id,
            itemId: `${selectedOrder.id}-${item.productId || item.id}`,
            name: item.name,
            price: item.price,
            quantity: item.quantity, // Default to full quantity
            maxQuantity: item.quantity,
            selected: true, // Default all items selected
            image: item.image,
          })
        );
        setSelectedReturnItems(updatedReturnItems);
      }
    }
  }, [orderId, userOrders]);

  // Handle item selection toggle
  const handleItemToggle = (itemId: string) => {
    setSelectedReturnItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setSelectedReturnItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity)),
            }
          : item
      )
    );
  };

  // Handle select all items
  const handleSelectAll = (selectAll: boolean) => {
    setSelectedReturnItems((prev) =>
      prev.map((item) => ({ ...item, selected: selectAll }))
    );
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Filter selected items and prepare returnedProducts array
      const returnedProducts = selectedReturnItems
        .filter((item) => item.selected)
        .map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          // Include additional fields if needed by backend
          name: item.name,
          price: item.price,
        }));

      // Validation - at least one item must be selected
      if (returnedProducts.length === 0) {
        toast.error("Please select at least one item to return");
        return;
      }

      // Payload with returnedProducts array
      const payload = {
        orderId: data.orderId.trim(),
        email: data.email.trim().toLowerCase(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        country: data.country.trim(),
        state: data.state.trim(),
        city: data.city.trim(),
        returnReason: data.returnReason,
        productCondition: data.productCondition,
        returnMethod: data.returnMethod,
        additionalComments: data.additionalComments || "",
        returnedProducts: returnedProducts,
      };

      console.log("📤 Submitting return request:", payload);

      const res = await fetch(
        "https://ilosiwaju-mbaay-2025.com/api/v1/order/return",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      console.log("📥 API Response:", result);

      if (!res.ok) throw new Error(result.message || "Return request failed");

      toast.success(result.message);

      // Reset form
      reset();
    } catch (err: any) {
      console.error("Return submission error:", err);
      toast.error(
        <div className="flex flex-col items-start">
          <span className="font-medium">Submission Failed</span>
          <span className="text-sm mt-1">
            {err.message || "Please try again"}
          </span>
        </div>,
        { autoClose: 4000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const hasMultipleOrders = userOrders.length > 1;
  const selectedCount = selectedReturnItems.filter(
    (item) => item.selected
  ).length;
  const totalItemsCount = selectedReturnItems.length;
  const allSelected =
    selectedReturnItems.length > 0 &&
    selectedReturnItems.every((item) => item.selected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-3 sm:mb-4">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-[1.6rem] font-bold text-gray-900 mb-2">
            Request Order Return
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto px-2">
            Select items to return • 30-day return policy • Free returns
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 shadow-sm mx-2 sm:mx-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8"
          >
            {/* Order Selection */}
            <div className="bg-red-50 rounded-xl p-4 sm:p-6 border-2 border-red-200">
              <label className="block text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Select Order
              </label>
              {isLoadingOrders ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading orders...</p>
                </div>
              ) : hasMultipleOrders ? (
                <div className="relative">
                  <select
                    {...register("orderId", {
                      required: "Please select an order",
                    })}
                    className={`${inputClass} appearance-none pr-10 text-base ${
                      errors.orderId
                        ? "border-red-300 focus:border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">Choose order</option>
                    {userOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        Order #{order.orderId?.slice(-8) || order.id.slice(-8)}{" "}
                        - {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
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
              ) : userOrders.length > 0 ? (
                <input
                  {...register("orderId", { required: "Order ID is required" })}
                  readOnly
                  className={`${inputClass} bg-gray-100 text-base`}
                  value={userOrders[0]?.id || ""}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">No orders found</p>
                </div>
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

            {/* Order Items Selection */}
            {selectedOrderDetails && selectedReturnItems.length > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 sm:p-6 border border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Select Items to Return
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedCount} of {totalItemsCount} items selected
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSelectAll(!allSelected)}
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <div
                        className={`w-4 h-4 border rounded flex items-center justify-center ${
                          allSelected
                            ? "bg-red-500 border-red-500"
                            : "border-gray-400"
                        }`}
                      >
                        {allSelected && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span>{allSelected ? "Deselect All" : "Select All"}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {selectedReturnItems.map((item) => (
                    <div
                      key={item.itemId}
                      className={`bg-white p-4 rounded-lg border-2 transition-all ${
                        item.selected
                          ? "border-red-500 bg-red-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <button
                            type="button"
                            onClick={() => handleItemToggle(item.itemId)}
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              item.selected
                                ? "bg-red-500 border-red-500"
                                : "border-gray-400 bg-white"
                            }`}
                          >
                            {item.selected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </button>
                          <img
                            src={item.image || "https://via.placeholder.com/60"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {item.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                              <span>Price: ₦{item.price.toLocaleString()}</span>
                              <span className="text-gray-400">•</span>
                              <span>Max: {item.maxQuantity}</span>
                              {item.selected && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="font-medium text-red-600">
                                    Subtotal: ₦
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {item.selected && (
                          <div className="flex items-center space-x-4 ml-4">
                            <div className="flex flex-col items-end">
                              <span className="text-sm text-gray-600 mb-1">
                                Return Quantity:
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.itemId,
                                      item.quantity - 1
                                    )
                                  }
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
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.itemId,
                                      item.quantity + 1
                                    )
                                  }
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
                </div>

                {/* Return Summary */}
                {selectedCount > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedCount} item{selectedCount !== 1 ? "s" : ""}{" "}
                          selected for return
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Total refund amount: ₦
                          {selectedReturnItems
                            .filter((item) => item.selected)
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Items will be processed for refund
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <InputField
                label="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                error={errors.firstName}
              />
              <InputField
                label="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                error={errors.lastName}
              />
              <InputField
                label="Email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email address",
                  },
                })}
                error={errors.email}
              />
              <InputField
                label="Phone Number"
                {...register("phone", { required: "Phone number is required" })}
                error={errors.phone}
              />
            </div>

            {/* Address Information */}
            <div className="space-y-4 sm:space-y-6">
              <InputField
                label="Street Address"
                {...register("address", { required: "Address is required" })}
                error={errors.address}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <InputField
                  label="Country"
                  {...register("country", { required: "Country is required" })}
                  error={errors.country}
                />
                <InputField
                  label="State/Province"
                  {...register("state", { required: "State is required" })}
                  error={errors.state}
                />
                <InputField
                  label="City"
                  {...register("city", { required: "City is required" })}
                  error={errors.city}
                />
              </div>
            </div>

            {/* Return Reason */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Return <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("returnReason", {
                    required: "Please select a reason",
                  })}
                  className={`${inputClass} appearance-none pr-10 text-base ${
                    errors.returnReason
                      ? "border-red-300 focus:border-red-500"
                      : ""
                  }`}
                >
                  <option value="">Select reason</option>
                  <option value="Wrong size/color">Wrong size/color</option>
                  <option value="Defective/Damaged">Defective/Damaged</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Arrived too late">Arrived too late</option>
                  <option value="Not as described">Not as described</option>
                  <option value="Other">Other</option>
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
              {errors.returnReason && (
                <p className="text-red-600 text-sm flex items-center mt-1">
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
                  {errors.returnReason.message}
                </p>
              )}
            </div>

            {/* Product Condition */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                Product Condition <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { value: "new", label: "New & Unused" },
                  { value: "lightly_used", label: "Lightly Used" },
                  { value: "defective", label: "Defective" },
                  { value: "wrong_item", label: "Wrong Item" },
                ].map((cond) => (
                  <label
                    key={cond.value}
                    className={`flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      productCondition === cond.value
                        ? "border-red-500 bg-red-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={cond.value}
                      {...register("productCondition", {
                        required: "Please select product condition",
                      })}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 ${
                        productCondition === cond.value
                          ? "border-red-500 bg-red-500"
                          : "border-gray-400"
                      }`}
                    >
                      {productCondition === cond.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {cond.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.productCondition && (
                <p className="text-red-600 text-sm flex items-center mt-3">
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
                  {errors.productCondition.message}
                </p>
              )}
            </div>

            {/* Return Method */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                Preferred Return Method <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { value: "dropoff", label: "Drop-off" },
                  { value: "pickup", label: "Schedule Pickup" },
                  { value: "courier", label: "Courier" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      returnMethod === method.value
                        ? "border-red-500 bg-red-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={method.value}
                      {...register("returnMethod", {
                        required: "Please select return method",
                      })}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 ${
                        returnMethod === method.value
                          ? "border-red-500 bg-red-500"
                          : "border-gray-400"
                      }`}
                    >
                      {returnMethod === method.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.returnMethod && (
                <p className="text-red-600 text-sm flex items-center mt-3">
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
                  {errors.returnMethod.message}
                </p>
              )}
            </div>

            {/* Additional Comments */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Comments
              </label>
              <textarea
                {...register("additionalComments")}
                rows={4}
                className={`${inputClass} resize-none text-base`}
                placeholder="Any extra details about your return..."
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={loading || !orderId || selectedCount === 0}
              className={`w-full py-3 sm:py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg ${
                loading ? "cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting Return Request...
                </div>
              ) : selectedCount === 0 ? (
                "Please select items to return"
              ) : (
                `Submit Return Request for ${selectedCount} Item${
                  selectedCount !== 1 ? "s" : ""
                }`
              )}
            </button>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-gray-500 px-2">
                We'll review your request and send return instructions within 24
                hours.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
const InputField = ({ label, error, type = "text", ...inputProps }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      type={type}
      className={`${inputClass} text-base ${
        error ? "border-red-300 focus:border-red-500" : ""
      }`}
      {...inputProps}
    />
    {error && (
      <p className="text-red-600 text-sm flex items-center">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {error.message}
      </p>
    )}
  </div>
);

// Enhanced mobile-friendly input styles
const inputClass =
  "w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-base";
