// src/components/CancelPostponeForm.tsx

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

type FormData = {
  orderId: string;
  email: string;
  action: "cancel" | "postpone";
  fromDate?: string;
  toDate?: string;
  reason: string;
};

export default function CancelPostponeForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: { action: "cancel" },
  });

  const action = watch("action");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: any = {
        orderId: data.orderId.trim(),
        email: data.email.trim().toLowerCase(),
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

      const res = await fetch("/api/orders/cancel-or-postpone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Request failed");

      alert("Request submitted! We'll email you soon.");
      reset();
    } catch (err: any) {
      alert(err.message || "Failed. Check Order ID & email.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
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
          <h1 className="text-[1.6rem] font-bold text-gray-900 mb-2">
            Cancel or Postpone Order
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Cancel your order or postpone delivery according to your needs
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white  overflow-hidden border border-gray-200">
          {/* Form Header */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-8 space-y-8"
          >
            {/* Order ID & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("orderId", {
                      required: "Order ID is required",
                    })}
                    className={`${inputClass} ${
                      errors.orderId
                        ? "border-red-300 focus:border-red-500"
                        : ""
                    } pl-11`}
                    placeholder="ORD-123456"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                  </div>
                </div>
                {errors.orderId && (
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
                    {errors.orderId.message}
                  </p>
                )}
              </div>

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
                        message: "Please enter a valid email address",
                      },
                    })}
                    type="email"
                    className={`${inputClass} ${
                      errors.email ? "border-red-300 focus:border-red-500" : ""
                    } pl-11`}
                    placeholder="you@example.com"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                {errors.email && (
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
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Action Selection */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                What would you like to do?
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <label
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    action === "cancel"
                      ? "border-red-500 bg-red-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="cancel"
                    {...register("action")}
                    className="sr-only"
                  />
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 ${
                      action === "cancel"
                        ? "border-red-500 bg-red-500"
                        : "border-gray-400"
                    }`}
                  >
                    {action === "cancel" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Cancel Order
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Get a full refund for your order
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    action === "postpone"
                      ? "border-orange-500 bg-orange-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="postpone"
                    {...register("action")}
                    className="sr-only"
                  />
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 ${
                      action === "postpone"
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-400"
                    }`}
                  >
                    {action === "postpone" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Postpone Delivery
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Reschedule to a later date
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Date Selection - Conditional */}
            {action === "postpone" && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">
                    Preferred New Delivery Dates
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700 mb-2">
                      From Date
                    </label>
                    <input
                      {...register("fromDate", {
                        required:
                          action === "postpone"
                            ? "Start date is required"
                            : false,
                      })}
                      type="date"
                      className={`${inputClass} ${
                        errors.fromDate
                          ? "border-red-300 focus:border-red-500"
                          : ""
                      }`}
                      min={
                        isMounted
                          ? new Date().toISOString().split("T")[0]
                          : undefined
                      }
                    />
                    {errors.fromDate && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.fromDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700 mb-2">
                      To Date
                    </label>
                    <input
                      {...register("toDate", {
                        required:
                          action === "postpone"
                            ? "End date is required"
                            : false,
                      })}
                      type="date"
                      className={`${inputClass} ${
                        errors.toDate
                          ? "border-red-300 focus:border-red-500"
                          : ""
                      }`}
                      min={
                        isMounted
                          ? new Date().toISOString().split("T")[0]
                          : undefined
                      }
                    />
                    {errors.toDate && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.toDate.message}
                      </p>
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
                {...register("reason", {
                  required: "Please tell us why you're making this request",
                })}
                rows={5}
                className={`${inputClass} resize-none ${
                  errors.reason ? "border-red-300 focus:border-red-500" : ""
                }`}
                placeholder="Please share your reason for cancellation or postponement (e.g., Changed my mind, wrong size, traveling, etc.)"
              />
              {errors.reason && (
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
                  {errors.reason.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              className={`w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg ${
                isSubmitting ? "cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
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
                  Processing Request...
                </div>
              ) : (
                "Submit Request"
              )}
            </button>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                We'll process your request and send a confirmation email within
                24 hours.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Enhanced input styles
const inputClass =
  "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500";
