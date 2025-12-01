// // src/components/CancelPostponeForm.tsx
// import { useForm } from "react-hook-form";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { toast } from "react-toastify";

// type FormData = {
//   orderId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   address: string;
//   country: string;
//   state: string;
//   city: string;
//   action: "cancel" | "postpone";
//   fromDate?: string;
//   toDate?: string;
//   reason: string;
// };

// export default function CancelPostponeForm() {
//   const [loading, setLoading] = useState(false);
//   const user = useSelector((state: RootState) => state.user.user);
//   const [isMounted, setIsMounted] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//     reset,
//   } = useForm<FormData>({
//     defaultValues: { action: "cancel" },
//   });

//   const action = watch("action");

//   useEffect(() => setIsMounted(true), []);

//   // Auto-fill all user data
//   useEffect(() => {
//     if (user) {
//       setValue("orderId", user.orders?.[0] || "");
//       setValue("firstName", user.name || "");
//       setValue("lastName", "");
//       setValue("email", user.email || "");
//       setValue("phone", user.phoneNumber || "");
//       setValue("address",  "");
//       setValue("country", user.location?.country || "");
//       setValue("state", "");
//       setValue("city", user.location?.city || "");
//     }
//   }, [user, setValue]);

//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     try {
//       const payload = {
//         orderId: data.orderId,
//         email: data.email.trim().toLowerCase(),
//         firstName: data.firstName,
//         lastName: data.lastName,
//         phone: data.phone,
//         address: data.address,
//         country: data.country,
//         state: data.state,
//         city: data.city,
//         isCancellation: data.action === "cancel",
//         isPostponement: data.action === "postpone",
//         cancellationReason: data.action === "cancel" ? data.reason : undefined,
//         postponementFromDate: data.action === "postpone" ? data.fromDate : undefined,
//         postponementToDate: data.action === "postpone" ? data.toDate : undefined,
//       };

//       const res = await fetch("https://ilosiwaju-mbaay-2025.com/api/v1/order/cancel-or-postpone", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || "Request failed");

//       toast.success("Request submitted successfully!");
//       reset();
//     } catch (err: any) {
//       toast.error(err.message || "Failed to submit. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasMultipleOrders = user?.orders && user.orders.length > 1;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-6 sm:mb-8">
//           <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-3 sm:mb-4">
//             <svg
//               className="w-6 h-6 sm:w-8 sm:h-8 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
//               />
//             </svg>
//           </div>
//           <h1 className="text-2xl sm:text-[1.6rem] font-bold text-gray-900 mb-2">
//             Cancel or Postpone Order
//           </h1>
//           <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto px-2">
//             Update your order status with your current details
//           </p>
//         </div>

//         {/* Form Container */}
//         <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 shadow-sm mx-2 sm:mx-0">
//           <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

//             {/* Order Selection */}
//             <div className="bg-orange-50 rounded-xl p-4 sm:p-6 border-2 border-orange-200">
//               <label className="block text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
//                 Select Order
//               </label>
//               {hasMultipleOrders ? (
//                 <div className="relative">
//                   <select 
//                     {...register("orderId", { required: "Please select an order" })} 
//                     className={`${inputClass} appearance-none pr-10 text-base ${
//                       errors.orderId ? "border-red-300 focus:border-red-500" : ""
//                     }`}
//                   >
//                     <option value="">Choose order</option>
//                     {user.orders.map((id) => (
//                       <option key={id} value={id}>{id}</option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                     <svg
//                       className="h-5 w-5 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               ) : (
//                 <input
//                   {...register("orderId", { required: "Order ID is required" })}
//                   readOnly
//                   className={`${inputClass} bg-gray-100 text-base`}
//                   value={user?.orders?.[0] || ""}
//                 />
//               )}
//               {errors.orderId && (
//                 <p className="text-red-600 text-sm flex items-center mt-2">
//                   <svg
//                     className="w-4 h-4 mr-1"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   {errors.orderId.message}
//                 </p>
//               )}
//             </div>

//             {/* Personal Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//               <InputField 
//                 label="First Name" 
//                 {...register("firstName", { required: "First name is required" })} 
//                 error={errors.firstName} 
//               />
//               <InputField 
//                 label="Last Name" 
//                 {...register("lastName", { required: "Last name is required" })} 
//                 error={errors.lastName} 
//               />
//               <InputField 
//                 label="Email" 
//                 type="email" 
//                 {...register("email", { 
//                   required: "Email is required",
//                   pattern: {
//                     value: /\S+@\S+\.\S+/,
//                     message: "Please enter a valid email address"
//                   }
//                 })} 
//                 error={errors.email} 
//               />
//               <InputField 
//                 label="Phone Number" 
//                 {...register("phone", { required: "Phone number is required" })} 
//                 error={errors.phone} 
//               />
//             </div>

//             {/* Address */}
//             <div className="space-y-4 sm:space-y-6">
//               <InputField 
//                 label="Street Address" 
//                 {...register("address", { required: "Address is required" })} 
//                 error={errors.address} 
//               />
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
//                 <InputField 
//                   label="Country" 
//                   {...register("country", { required: "Country is required" })} 
//                   error={errors.country} 
//                 />
//                 <InputField 
//                   label="State/Province" 
//                   {...register("state", { required: "State is required" })} 
//                   error={errors.state} 
//                 />
//                 <InputField 
//                   label="City" 
//                   {...register("city", { required: "City is required" })} 
//                   error={errors.city} 
//                 />
//               </div>
//             </div>

//             {/* Action Selection */}
//             <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
//               <p className="text-lg font-semibold text-gray-900 mb-4">
//                 What would you like to do?
//               </p>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <label
//                   className={`flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
//                     action === "cancel"
//                       ? "border-red-500 bg-red-50 shadow-sm"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     value="cancel"
//                     {...register("action")}
//                     className="sr-only"
//                   />
//                   <div
//                     className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 ${
//                       action === "cancel"
//                         ? "border-red-500 bg-red-500"
//                         : "border-gray-400"
//                     }`}
//                   >
//                     {action === "cancel" && (
//                       <div className="w-2 h-2 bg-white rounded-full"></div>
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <span className="font-medium text-gray-900 block">
//                       Cancel Order
//                     </span>
//                     <p className="text-sm text-gray-600 mt-1">
//                       Full refund will be processed
//                     </p>
//                   </div>
//                 </label>

//                 <label
//                   className={`flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
//                     action === "postpone"
//                       ? "border-orange-500 bg-orange-50 shadow-sm"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     value="postpone"
//                     {...register("action")}
//                     className="sr-only"
//                   />
//                   <div
//                     className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 ${
//                       action === "postpone"
//                         ? "border-orange-500 bg-orange-500"
//                         : "border-gray-400"
//                     }`}
//                   >
//                     {action === "postpone" && (
//                       <div className="w-2 h-2 bg-white rounded-full"></div>
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <span className="font-medium text-gray-900 block">
//                       Postpone Delivery
//                     </span>
//                     <p className="text-sm text-gray-600 mt-1">
//                       Choose new delivery dates
//                     </p>
//                   </div>
//                 </label>
//               </div>
//             </div>

//             {/* Date Selection - Conditional */}
//             {action === "postpone" && (
//               <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 sm:p-6 rounded-xl border-2 border-orange-200 shadow-sm">
//                 <div className="flex items-center mb-4">
//                   <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg mr-3">
//                     <svg
//                       className="w-4 h-4 text-orange-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                       />
//                     </svg>
//                   </div>
//                   <h3 className="font-bold text-lg text-gray-900">
//                     Preferred New Delivery Dates
//                   </h3>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//                   <InputField 
//                     label="From Date" 
//                     type="date" 
//                     min={isMounted ? new Date().toISOString().split("T")[0] : undefined}
//                     {...register("fromDate", { 
//                       required: action === "postpone" ? "Start date is required" : false 
//                     })} 
//                     error={errors.fromDate} 
//                   />
//                   <InputField 
//                     label="To Date" 
//                     type="date" 
//                     min={isMounted ? new Date().toISOString().split("T")[0] : undefined}
//                     {...register("toDate", { 
//                       required: action === "postpone" ? "End date is required" : false 
//                     })} 
//                     error={errors.toDate} 
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Reason */}
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Reason for Request <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 {...register("reason", {
//                   required: "Please tell us why you're making this request",
//                 })}
//                 rows={4}
//                 className={`${inputClass} resize-none text-base ${
//                   errors.reason ? "border-red-300 focus:border-red-500" : ""
//                 }`}
//                 placeholder="Explain why you want to cancel or postpone..."
//               />
//               {errors.reason && (
//                 <p className="text-red-600 text-sm flex items-center mt-1">
//                   <svg
//                     className="w-4 h-4 mr-1"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   {errors.reason.message}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               disabled={loading}
//               className={`w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg ${
//                 loading ? "cursor-not-allowed" : ""
//               }`}
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Submitting Request...
//                 </div>
//               ) : (
//                 "Submit Request"
//               )}
//             </button>

//             {/* Help Text */}
//             <div className="text-center">
//               <p className="text-sm text-gray-500 px-2">
//                 We'll process your request and send a confirmation email within 24 hours.
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Reusable Input Component with mobile optimization
// const InputField = ({ label, error, type = "text", ...inputProps }: any) => (
//   <div className="space-y-2">
//     <label className="block text-sm font-semibold text-gray-700">
//       {label} <span className="text-red-500">*</span>
//     </label>
//     <input
//       type={type}
//       className={`${inputClass} text-base ${error ? "border-red-300 focus:border-red-500" : ""}`}
//       {...inputProps}
//     />
//     {error && (
//       <p className="text-red-600 text-sm flex items-center">
//         <svg
//           className="w-4 h-4 mr-1"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path
//             fillRule="evenodd"
//             d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//             clipRule="evenodd"
//           />
//         </svg>
//         {error.message}
//       </p>
//     )}
//   </div>
// );

// // Enhanced mobile-friendly input styles
// const inputClass =
//   "w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-base";
// src/components/CancelPostponeForm.tsx
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getOrdersWithSession } from "@/utils/getOrderApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type FormData = {
  orderId: string;
  email: string;
  action: "cancel" | "postpone";
  fromDate?: string;
  toDate?: string;
  reason: string;
  selectedItems: {
    productId: string;
    quantity: number;
    selected: boolean;
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
      selectedItems: []
    },
  });

  const action = watch("action");
  const selectedItems = watch("selectedItems");
  const selectedOrderId = watch("orderId");

  useEffect(() => {
    setIsMounted(true);
    // Set initial user data
    if (user) {
      setValue("email", user.email || "");
      if (user.orders && user.orders.length > 0) {
        setValue("orderId", user.orders[0]);
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
          setValue("orderId", orders[0].id);
          setOrderDetails(orders[0]);
          
          // Initialize selected items
          const initialSelectedItems = [{
            productId: orders[0].id,
            quantity: orders[0].quantity,
            selected: false
          }];
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
  }, [navigate, isAuthenticated, token, role, setValue]);

  // Update order details when order selection changes
  useEffect(() => {
    if (selectedOrderId && userOrders.length > 0) {
      const selectedOrder = userOrders.find(order => order.id === selectedOrderId);
      if (selectedOrder) {
        setOrderDetails(selectedOrder);
        
        // Update selected items for the new order
        const updatedSelectedItems = [{
          productId: selectedOrder.id,
          quantity: selectedOrder.quantity,
          selected: selectedItems[0]?.selected || false
        }];
        setValue("selectedItems", updatedSelectedItems);
      }
    }
  }, [selectedOrderId, userOrders, setValue]);

  // Handle item selection
  const handleItemSelection = (index: number, selected: boolean) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].selected = selected;
    setValue("selectedItems", updatedItems);
  };

  // Handle quantity change
  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedItems = [...selectedItems];
    const maxQuantity = orderDetails?.quantity || 1;
    updatedItems[index].quantity = Math.max(1, Math.min(newQuantity, maxQuantity));
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
        selectedItems: selectedProducts,
      };

      if (data.action === "cancel") {
        payload.isCancellation = true;
        payload.isPostponement = false;
        payload.cancellationReason = data.reason;
      } else {
        payload.isCancellation = false;
        payload.isPostponement = true;
        payload.preferredDates = { from: data.fromDate, to: data.toDate };
        payload.reason = data.reason;
      }

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
      toast.error(err.message || "Failed. Check Order ID & email.");
    }
  };

  const selectedCount = selectedItems.filter(item => item.selected).length;
  const hasMultipleOrders = userOrders.length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Order</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Cancel or postpone specific items from your order
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8 sm:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Cancel or Postpone Order</h2>
              <p className="text-orange-100 text-sm">
                Select an order and choose items to manage
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
            {/* Order Selection */}
            <div className="bg-orange-50 rounded-xl p-4 sm:p-6 border-2 border-orange-200">
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
                      <option key={order.id} value={order.id}>{order.id}</option>
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

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className={`${inputClass} ${errors.email ? 'border-red-300 focus:border-red-500' : ''} pl-11`}
                  placeholder="you@example.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Order Items Selection - Show only when order is loaded */}
            {selectedOrderId && orderDetails && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-semibold text-gray-900">Order Items</p>
                  {!isLoadingOrder && orderDetails && (
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                      {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                    </span>
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
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedItems[0]?.selected || false}
                            onChange={(e) => handleItemSelection(0, e.target.checked)}
                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400"
                          />
                          <img
                            src={orderDetails.product?.image || "https://via.placeholder.com/80"}
                            alt={orderDetails.product?.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{orderDetails.product?.name || "Product"}</p>
                            <p className="text-sm text-gray-600">${orderDetails.product?.price || 0} × {orderDetails.quantity}</p>
                            <p className="text-xs text-gray-500">Total: ${orderDetails.totalPrice || 0}</p>
                          </div>
                        </div>

                        {selectedItems[0]?.selected && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(0, selectedItems[0].quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">
                                {selectedItems[0].quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(0, selectedItems[0].quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                              >
                                +
                              </button>
                              <span className="text-sm text-gray-500 ml-2">
                                of {orderDetails.quantity}
                              </span>
                            </div>
                          </div>
                        )}
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
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Preferred New Delivery Dates</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700 mb-2">From Date</label>
                    <input
                      {...register("fromDate", {
                        required: action === "postpone" ? "Start date is required" : false
                      })}
                      type="date"
                      className={`${inputClass} ${errors.fromDate ? 'border-red-300 focus:border-red-500' : ''}`}
                      min={isMounted ? new Date().toISOString().split('T')[0] : undefined}
                    />
                    {errors.fromDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.fromDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700 mb-2">To Date</label>
                    <input
                      {...register("toDate", {
                        required: action === "postpone" ? "End date is required" : false
                      })}
                      type="date"
                      className={`${inputClass} ${errors.toDate ? 'border-red-300 focus:border-red-500' : ''}`}
                      min={isMounted ? new Date().toISOString().split('T')[0] : undefined}
                    />
                    {errors.toDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.toDate.message}</p>
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
              disabled={isSubmitting || !selectedOrderId || isLoadingOrder}
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