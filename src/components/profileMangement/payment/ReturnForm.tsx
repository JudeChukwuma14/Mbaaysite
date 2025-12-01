// src/components/ReturnForm.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  // Auto-fill from Redux
  useEffect(() => {
    if (user) {
       setValue("orderId", user.orders?.[0] || "");
      setValue("firstName", user.name || "");
      setValue("lastName", "");
      setValue("email", user.email || "");
      setValue("phone", user.phoneNumber || "");
      setValue("address",  "");
      setValue("country", user.location?.country || "");
      setValue("state", "");
      setValue("city", user.location?.city || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        orderId: data.orderId,
        email: data.email.trim().toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        returnReason: data.returnReason,
        productCondition: data.productCondition,
        returnMethod: data.returnMethod,
        additionalComments: data.additionalComments || "",
      };

      const res = await fetch("https://ilosiwaju-mbaay-2025.com/api/v1/order/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Return request failed");

      toast.success(`Return request submitted successfully! Reference: ${result.returnId || "N/A"}`);
      reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit return request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasMultipleOrders = user?.orders && user.orders.length > 1;
  const productCondition = watch("productCondition");
  const returnMethod = watch("returnMethod");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-[1.6rem] font-bold text-gray-900 mb-2">
            Request a Return
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto px-2">
            30-day return policy • Free returns on eligible items
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 shadow-sm mx-2 sm:mx-0">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

            {/* Order Selection */}
            <div className="bg-red-50 rounded-xl p-4 sm:p-6 border-2 border-red-200">
              <label className="block text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Select Order
              </label>
              {hasMultipleOrders ? (
                <div className="relative">
                  <select 
                    {...register("orderId", { required: "Please select an order" })} 
                    className={`${inputClass} appearance-none pr-10 text-base ${
                      errors.orderId ? "border-red-300 focus:border-red-500" : ""
                    }`}
                  >
                    <option value="">Choose order</option>
                    {user.orders.map((id) => (
                      <option key={id} value={id}>{id}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              ) : (
                <input
                  {...register("orderId", { required: "Order ID is required" })}
                  readOnly
                  className={`${inputClass} bg-gray-100 text-base`}
                  value={user?.orders?.[0] || ""}
                />
              )}
              {errors.orderId && (
                <p className="text-red-600 text-sm flex items-center mt-2">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.orderId.message}
                </p>
              )}
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <InputField 
                label="First Name" 
                {...register("firstName", { required: "First name is required" })} 
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
                    message: "Please enter a valid email address"
                  }
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
                  {...register("returnReason", { required: "Please select a reason" })}
                  className={`${inputClass} appearance-none pr-10 text-base ${
                    errors.returnReason ? "border-red-300 focus:border-red-500" : ""
                  }`}
                >
                  <option value="">Select reason</option>
                  <option value="Wrong size/color">Wrong size/color</option>
                  <option value="Defective/Damaged">Defective/Damaged</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Arrived too late">Arrived too late</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.returnReason && (
                <p className="text-red-600 text-sm flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
                    <span className="font-medium text-gray-900">{cond.label}</span>
                  </label>
                ))}
              </div>
              {errors.productCondition && (
                <p className="text-red-600 text-sm flex items-center mt-3">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
                    <span className="font-medium text-gray-900">{method.label}</span>
                  </label>
                ))}
              </div>
              {errors.returnMethod && (
                <p className="text-red-600 text-sm flex items-center mt-3">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
              disabled={loading}
              className={`w-full py-3 sm:py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg ${
                loading ? "cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Return...
                </div>
              ) : (
                "Submit Return Request"
              )}
            </button>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-gray-500 px-2">
                We'll review your request and send return instructions within 24 hours.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component with mobile optimization
const InputField = ({ label, error, type = "text", ...inputProps }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      type={type}
      className={`${inputClass} text-base ${error ? "border-red-300 focus:border-red-500" : ""}`}
      {...inputProps}
    />
    {error && (
      <p className="text-red-600 text-sm flex items-center">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error.message}
      </p>
    )}
  </div>
);

// Enhanced mobile-friendly input styles
const inputClass =
  "w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-base";