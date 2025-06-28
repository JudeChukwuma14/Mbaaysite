import { useState, useEffect } from "react";
import { useForm, Controller, UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select, { SingleValue } from "react-select";
import { motion, Variants } from "framer-motion";
import { FaCreditCard } from "react-icons/fa";
import { Loader2, MapPin } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, removeCoupon } from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";
import OrderSummary from "./OrderSummary";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CiDeliveryTruck } from "react-icons/ci";
import { submitOrder, OrderData } from "@/utils/orderApi";
import { calculatePricing } from "@/utils/pricingUtils";
import { initializeSession } from "@/redux/slices/sessionSlice";

interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  postalCode?: string;
  apartment?: string;
  couponCode?: string;
  paymentOption: "Pay Before Delivery" | "Pay After Delivery";
}

interface CityOption {
  value: string;
  label: string;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const inputVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const errorVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const inputStyles = `w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`;
const errorInputStyles = `border-red-500 bg-red-50`;
const normalInputStyles = `border-gray-200 bg-gray-50 focus:bg-white`;

function BillingDetails({
  register,
  control,
  errors,
  selectedCountry,
  selectedRegion,
  cityOptions,
  isCityLoading,
}: {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  selectedCountry: string;
  selectedRegion: string;
  cityOptions: CityOption[];
  isCityLoading: boolean;
}) {
  return (
    <motion.div
      variants={cardVariants}
      className="p-6 bg-white border border-gray-100 shadow-lg md:p-8 rounded-2xl"
    >
      <div className="mb-6">
        <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 md:text-2xl">
          <div className="p-2 bg-orange-100 rounded-lg">
            <MapPin className="w-5 h-5 text-orange-600 md:w-6 md:h-6" />
          </div>
          Billing Details
        </h2>
        <p className="mt-2 text-sm text-gray-600">Please enter your billing information</p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div variants={inputVariants}>
            <label htmlFor="first_name" className="block mb-1 text-sm font-medium text-gray-700">
              First Name*
            </label>
            <input
              id="first_name"
              type="text"
              className={`${inputStyles} ${errors.first_name ? errorInputStyles : normalInputStyles}`}
              placeholder="John"
              {...register("first_name", { required: "First name is required" })}
              aria-invalid={errors.first_name ? "true" : "false"}
            />
            {errors.first_name && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.first_name.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={inputVariants}>
            <label htmlFor="last_name" className="block mb-1 text-sm font-medium text-gray-700">
              Last Name*
            </label>
            <input
              id="last_name"
              type="text"
              className={`${inputStyles} ${errors.last_name ? errorInputStyles : normalInputStyles}`}
              placeholder="Doe"
              {...register("last_name", { required: "Last name is required" })}
              aria-invalid={errors.last_name ? "true" : "false"}
            />
            {errors.last_name && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.last_name.message}
              </motion.p>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div variants={inputVariants}>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email Address*
            </label>
            <input
              id="email"
              type="email"
              className={`${inputStyles} ${errors.email ? errorInputStyles : normalInputStyles}`}
              placeholder="your@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
              })}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={inputVariants}>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
              Phone Number*
            </label>
            <Controller
              name="phone"
              control={control}
              rules={{ required: "Phone number is required" }}
              render={({ field }) => (
                <PhoneInput
                  country="ng"
                  value={field.value}
                  onChange={field.onChange}
                  containerClass="w-full"
                  inputClass="!w-full !h-11 !pl-14 !border !border-gray-300 !rounded-md !shadow-sm !bg-white !text-sm focus:!outline-none focus:!ring-2 focus:!ring-orange-500 focus:!border-orange-500"
                  buttonClass="!h-11 !border-r !border-gray-300 !bg-white !rounded-l-md"
                  dropdownClass="!z-50"
                  inputProps={{
                    "aria-invalid": errors.phone ? "true" : "false",
                  }}
                />
              )}
            />
            {errors.phone && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.phone.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={inputVariants}>
            <label htmlFor="postalCode" className="block mb-1 text-sm font-medium text-gray-700">
              Postal Code (Optional)
            </label>
            <input
              id="postalCode"
              type="text"
              className={`${inputStyles} ${normalInputStyles}`}
              placeholder="00112"
              {...register("postalCode")}
              aria-invalid="false"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div variants={inputVariants}>
            <label htmlFor="country" className="block mb-1 text-sm font-medium text-gray-700">
              Country*
            </label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <CountryDropdown
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  className={`${inputStyles} ${errors.country ? errorInputStyles : normalInputStyles}`}
                  aria-invalid={errors.country ? "true" : "false"}
                />
              )}
            />
            {errors.country && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.country.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={inputVariants}>
            <label htmlFor="region" className="block mb-1 text-sm font-medium text-gray-700">
              State*
            </label>
            <Controller
              name="region"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <RegionDropdown
                  country={selectedCountry}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  className={`${inputStyles} ${errors.region ? errorInputStyles : normalInputStyles}`}
                  disableWhenEmpty={true}
                  aria-invalid={errors.region ? "true" : "false"}
                />
              )}
            />
            {errors.region && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.region.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={inputVariants}>
            <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">
              City*
            </label>
            <Controller
              name="city"
              control={control}
              rules={{ required: "City is required" }}
              render={({ field }) => (
                <Select
                  options={cityOptions}
                  value={cityOptions.find((option) => option.value === field.value) || null}
                  onChange={(option: SingleValue<CityOption>) =>
                    field.onChange(option ? option.value : "")
                  }
                  placeholder="Select a city"
                  isDisabled={isCityLoading || !selectedCountry || !selectedRegion}
                  isLoading={isCityLoading}
                  className="w-full"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      height: "44px",
                      border: errors.city ? "2px solid #ef4444" : "2px solid #e5e7eb",
                      borderRadius: "8px",
                      backgroundColor: errors.city ? "#fef2f2" : "#f9fafb",
                      boxShadow: state.isFocused ? "0 0 0 2px #f97316" : "none",
                      "&:hover": { borderColor: "#f97316" },
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      height: "44px",
                      padding: "0 8px",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 50,
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? "#f97316" : state.isFocused ? "#fed7aa" : "white",
                      color: state.isSelected ? "white" : "#1f2937",
                    }),
                  }}
                  aria-invalid={errors.city ? "true" : "false"}
                />
              )}
            />
            {errors.city && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.city.message}
              </motion.p>
            )}
            {!isCityLoading && cityOptions.length === 0 && selectedCountry && selectedRegion && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-gray-600">
                No cities found. Please check your country and state.
              </motion.p>
            )}
          </motion.div>
        </div>
        <motion.div variants={inputVariants}>
          <label htmlFor="apartment" className="block mb-1 text-sm font-medium text-gray-700">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            id="apartment"
            type="text"
            className={`${inputStyles} ${normalInputStyles}`}
            placeholder="Apt 4B"
            {...register("apartment")}
            aria-invalid="false"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PaymentDetails({
  register,
  activePaymentOption,
  setActivePaymentOption,
  isSubmitting,
  isSessionLoading, // Add isSessionLoading prop
}: {
  register: UseFormRegister<FormValues>;
  activePaymentOption: "Pay Before Delivery" | "Pay After Delivery";
  setActivePaymentOption: (option: "Pay Before Delivery" | "Pay After Delivery") => void;
  isSubmitting: boolean;
  isSessionLoading: boolean; // Add isSessionLoading prop
}) {
  const paymentOptions = [
    { option: "Pay Before Delivery", label: "Pay Now", icon: FaCreditCard },
    { option: "Pay After Delivery", label: "Pay on Delivery", icon: CiDeliveryTruck },
  ];

  return (
    <motion.div
      variants={cardVariants}
      className="p-6 bg-white border border-gray-100 shadow-lg md:p-8 rounded-2xl"
    >
      <div className="mb-6">
        <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 md:text-2xl">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FaCreditCard className="w-5 h-5 text-orange-600 md:w-6 md:h-6" />
          </div>
          Payment Option
        </h2>
        <p className="mt-2 text-sm text-gray-600">Select when you prefer to pay</p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <div className="border-b-2 border-gray-200">
          <div className="flex flex-wrap">
            {paymentOptions.map(({ option, label, icon: Icon }) => (
              <motion.button
                key={option}
                type="button"
                className={`py-3 px-4 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
                  activePaymentOption === option
                    ? "border-b-2 border-orange-500 text-orange-600 bg-orange-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setActivePaymentOption(option as "Pay Before Delivery" | "Pay After Delivery");
                  register("paymentOption").onChange({ target: { value: option } });
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || isSessionLoading}
                aria-label={`Select ${label} payment option`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          {activePaymentOption === "Pay Before Delivery" && (
            <motion.div
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="p-4 text-sm bg-gray-100 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaCreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Pay Now</span>
              </div>
              <p className="text-blue-700">Pay securely using your preferred payment method via Paystack.</p>
            </motion.div>
          )}

          {activePaymentOption === "Pay After Delivery" && (
            <motion.div
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="p-4 text-sm bg-gray-100 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <CiDeliveryTruck className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Pay on Delivery</span>
              </div>
              <p className="text-blue-700">Pay with cash when your order arrives.</p>
            </motion.div>
          )}
        </div>

        <motion.div
          className="flex justify-end mt-6"
          whileHover={{ scale: isSubmitting || isSessionLoading ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting || isSessionLoading ? 1 : 0.98 }}
        >
          <button
            type="submit"
            disabled={isSubmitting || isSessionLoading}
            className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed md:w-auto"
            aria-label="Place order"
          >
            {isSubmitting || isSessionLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Place Order"
            )}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(false); // Add session loading state
  const [activePaymentOption, setActivePaymentOption] = useState<"Pay Before Delivery" | "Pay After Delivery">("Pay Before Delivery");
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCoupon = useSelector((state: RootState) => state.cart.couponCode);
  const discountRate = useSelector((state: RootState) => state.cart.discount);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    resetField,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country: "",
      postalCode: "",
      region: "",
      city: "",
      apartment: "",
      couponCode: "",
      paymentOption: "Pay Before Delivery",
    },
  });

  const selectedCountry = watch("country");
  const selectedRegion = watch("region");
  const couponCode = watch("couponCode");

  // Initialize sessionId if missing
  useEffect(() => {
    if (!sessionId) {
      setIsSessionLoading(true);
      dispatch(initializeSession());
      setIsSessionLoading(false);
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    setValue("couponCode", cartCoupon || "");
  }, [cartCoupon, setValue]);

  useEffect(() => {
    if (!selectedCountry || !selectedRegion) {
      setCityOptions([]);
      resetField("city");
      return;
    }

    setIsCityLoading(true);
    setTimeout(() => {
      try {
        const country = Country.getAllCountries().find((c) => c.name === selectedCountry);
        if (!country) {
          toast.error("Country not found. Please try again.");
          setCityOptions([]);
          return;
        }

        const states = State.getStatesOfCountry(country.isoCode);
        const state = states.find((s) => s.name === selectedRegion);
        if (!state) {
          toast.error("State not found. Please try again.");
          setCityOptions([]);
          return;
        }

        const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
        setCityOptions(cities.map((city) => ({ value: city.name, label: city.name })));
      } catch (error) {
        console.error("Failed to load cities:", error);
        toast.error("Failed to load cities. Please try again.");
        setCityOptions([]);
      } finally {
        setIsCityLoading(false);
      }
    }, 500);
  }, [selectedCountry, selectedRegion, resetField]);

  const handleApplyCoupon = (code: string) => {
    if (!code) {
      toast.error("Please enter a coupon code.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add items before applying a coupon.");
      return;
    }
    if (!sessionId) {
      toast.error("Session not initialized. Please try again.");
      return;
    }
    setCouponLoading(true);
    setTimeout(() => {
      if (code.toUpperCase() === "SUMMER10") {
        dispatch(applyCoupon({ code: "SUMMER10", discount: 0.1 }));
        toast.success("Coupon applied! 10% off");
      } else {
        dispatch(removeCoupon());
        toast.error("Invalid coupon code");
      }
      setCouponLoading(false);
    }, 1000);
  };

  const onSubmit = async (data: FormValues) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return;
    }
    if (!sessionId) {
      toast.error("Session not initialized. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const pricing = calculatePricing(cartItems, discountRate);

      const address = [
        data.apartment ? `Apt ${data.apartment}` : "",
        data.city,
        data.region,
        data.country,
        data.postalCode ? `Postal Code: ${data.postalCode}` : "",
      ]
        .filter(Boolean)
        .join(", ");

      const orderData: OrderData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address,
        country: data.country,
        apartment: data.apartment || "",
        city: data.city,
        region: data.region,
        postalCode: data.postalCode || "",
        couponCode: cartCoupon || "",
        paymentOption: data.paymentOption,
        cartItems: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: Number(item.price), // Ensure number
          quantity: Number(item.quantity), // Ensure number
          image: item.image,
        })),
        pricing,
      };

      const response = await submitOrder(sessionId, orderData);
      toast.success("Order placed successfully!");

      if (data.paymentOption === "Pay Before Delivery") {
        if (response.authorization_url) {
          window.location.href = response.authorization_url; // Redirect to Paystack
        } else {
          throw new Error("Payment initialization failed: No authorization URL provided");
        }
      } else {
        // Pay After Delivery: Redirect to success page
        navigate(`/${response.orderId}/success`, { state: { orderId: response.orderId, orderData } });
      }
    } catch (error: any) {
      console.error("Order submission failed:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
      navigate("/failed", {
        state: {
          errorCode: "ERR_ORDER_SUBMISSION",
          errorMessage: error.message || "Failed to place order.",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-3xl font-bold text-center text-gray-800"
      >
        Checkout
      </motion.h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <BillingDetails
              register={register}
              control={control}
              errors={errors}
              selectedCountry={selectedCountry}
              selectedRegion={selectedRegion}
              cityOptions={cityOptions}
              isCityLoading={isCityLoading}
            />
            <PaymentDetails
              register={register}
              activePaymentOption={activePaymentOption}
              setActivePaymentOption={setActivePaymentOption}
              isSubmitting={isSubmitting}
              isSessionLoading={isSessionLoading} // Pass isSessionLoading
            />
          </form>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1"
        >
          <OrderSummary
            couponCode={couponCode || ""}
            setCouponCode={(code) => setValue("couponCode", code)}
            couponApplied={!!cartCoupon && cartCoupon.toUpperCase() === "SUMMER10"}
            couponLoading={couponLoading}
            handleApplyCoupon={() => handleApplyCoupon(couponCode || "")}
          />
        </motion.div>
      </div>
    </div>
  );
}