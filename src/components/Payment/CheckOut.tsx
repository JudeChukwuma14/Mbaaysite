// src/components/CheckoutForm.tsx
import { useState, useEffect } from "react";
import { useForm, Controller, UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select, { SingleValue } from "react-select";
import { motion, Variants } from "framer-motion";
import { FaCreditCard, FaPaypal } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";
import { Loader2, MapPin } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon } from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";
import OrderSummary from "./OrderSummary";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 

// Form data interface
interface FormValues {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  streetAddress: string;
  apartment?: string;
  postalCode: string;
  saveInfo: boolean;
  paymentMethod: "credit" | "paypal" | "cash";
  couponCode?: string; // Added for coupon input
}

// City option interface for react-select
interface CityOption {
  value: string;
  label: string;
}

// Animation variants
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

// Input styles
const inputStyles = `w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`;
const errorInputStyles = `border-red-500 bg-red-50`;
const normalInputStyles = `border-gray-200 bg-gray-50 focus:bg-white`;

// Billing Details component
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
            <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-700">
              First Name*
            </label>
            <input
              id="firstName"
              type="text"
              className={`${inputStyles} ${errors.firstName ? errorInputStyles : normalInputStyles}`}
              placeholder="John"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.firstName.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={inputVariants}>
            <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-700">
              Last Name*
            </label>
            <input
              id="lastName"
              type="text"
              className={`${inputStyles} ${errors.lastName ? errorInputStyles : normalInputStyles}`}
              placeholder="Doe"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.lastName.message}
              </motion.p>
            )}
          </motion.div>
        </div>

        <motion.div variants={inputVariants}>
          <label htmlFor="companyName" className="block mb-1 text-sm font-medium text-gray-700">
            Company Name (Optional)
          </label>
          <input
            id="companyName"
            type="text"
            className={`${inputStyles} ${normalInputStyles}`}
            placeholder="Your Company Ltd."
            {...register("companyName")}
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  country="us"
                  value={field.value}
                  onChange={field.onChange}
                  containerClass="w-full"
                  inputClass="!w-full !h-11 !pl-14 !border !border-gray-300 !rounded-md !shadow-sm !bg-white !text-sm focus:!outline-none focus:!ring-2 focus:!ring-orange-500 focus:!border-orange-500"
                  buttonClass="!h-11 !border-r !border-gray-300 !bg-white !rounded-l-md"
                  dropdownClass="!z-50"
                />
              )}
            />
            {errors.phone && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.phone.message}
              </motion.p>
            )}
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
                      backgroundColor: state.isSelected
                        ? "#f97316"
                        : state.isFocused
                        ? "#fed7aa"
                        : "white",
                      color: state.isSelected ? "white" : "#1f2937",
                    }),
                  }}
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
          <label htmlFor="streetAddress" className="block mb-1 text-sm font-medium text-gray-700">
            Street Address*
          </label>
          <input
            id="streetAddress"
            type="text"
            className={`${inputStyles} ${errors.streetAddress ? errorInputStyles : normalInputStyles}`}
            placeholder="123 Main St"
            {...register("streetAddress", { required: "Street address is required" })}
          />
          {errors.streetAddress && (
            <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
              {errors.streetAddress.message}
            </motion.p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <label htmlFor="postalCode" className="block mb-1 text-sm font-medium text-gray-700">
              Postal Code*
            </label>
            <input
              id="postalCode"
              type="text"
              className={`${inputStyles} ${errors.postalCode ? errorInputStyles : normalInputStyles}`}
              placeholder="10001"
              {...register("postalCode", { required: "Postal code is required" })}
            />
            {errors.postalCode && (
              <motion.p variants={errorVariants} className="mt-1 text-xs text-red-600">
                {errors.postalCode.message}
              </motion.p>
            )}
          </motion.div>
        </div>

        <motion.div
          variants={inputVariants}
          className="p-4 border-2 border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100"
        >
          <div className="flex items-start space-x-3">
            <input
              id="saveInfo"
              type="checkbox"
              className="w-4 h-4 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              {...register("saveInfo")}
            />
            <div>
              <label htmlFor="saveInfo" className="text-sm font-medium text-gray-800">
                Save for faster checkout
              </label>
              <p className="mt-1 text-xs text-gray-600">
                Your data will be used to process your order.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Payment Details component
function PaymentDetails({
  register,
  activePaymentMethod,
  setActivePaymentMethod,
  isSubmitting,
}: {
  register: UseFormRegister<FormValues>;
  activePaymentMethod: "credit" | "paypal" | "cash";
  setActivePaymentMethod: (method: "credit" | "paypal" | "cash") => void;
  isSubmitting: boolean;
}) {
  const paymentMethods = [
    { method: "credit", label: "Credit Card", icon: FaCreditCard },
    { method: "paypal", label: "PayPal", icon: FaPaypal },
    { method: "cash", label: "Cash on Delivery", icon: CiDeliveryTruck },
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
          Payment Method
        </h2>
        <p className="mt-2 text-sm text-gray-600">Select your preferred payment method</p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <div className="border-b-2 border-gray-200">
          <div className="flex flex-wrap">
            {paymentMethods.map(({ method, label, icon: Icon }) => (
              <motion.button
                key={method}
                type="button"
                className={`py-3 px-4 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
                  activePaymentMethod === method
                    ? "border-b-2 border-orange-500 text-orange-600 bg-orange-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setActivePaymentMethod(method as "credit" | "paypal" | "cash");
                  register("paymentMethod").onChange({ target: { value: method } });
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                <Icon className="w-5 h-5" />
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          {activePaymentMethod === "credit" && (
            <motion.div
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="p-4 text-sm bg-gray-100 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaCreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Credit Card Payment</span>
              </div>
              <p className="text-blue-700">Processed securely at checkout.</p>
            </motion.div>
          )}

          {activePaymentMethod === "paypal" && (
            <motion.div
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="p-4 text-sm bg-gray-100 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaPaypal className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">PayPal</span>
              </div>
              <p className="text-blue-700">Redirected to PayPal for secure payment.</p>
            </motion.div>
          )}

          {activePaymentMethod === "cash" && (
            <motion.div
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="p-4 text-sm bg-gray-100 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <CiDeliveryTruck className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Cash on Delivery</span>
              </div>
              <p className="text-blue-700">Pay with cash when your order arrives.</p>
            </motion.div>
          )}
        </div>

        <motion.div
          className="flex justify-end mt-6"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed md:w-auto"
          >
            {isSubmitting ? (
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

// Main CheckoutForm component
export default function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<"credit" | "paypal" | "cash">("credit");
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false); // Separate state for coupon
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCoupon = useSelector((state: RootState) => state.cart.couponCode);

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
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      phone: "",
      country: "",
      region: "",
      city: "",
      streetAddress: "",
      apartment: "",
      postalCode: "",
      saveInfo: false,
      paymentMethod: "credit",
      couponCode: "",
    },
  });

  const selectedCountry = watch("country");
  const selectedRegion = watch("region");
  const couponCode = watch("couponCode");

  // Sync Redux coupon with form
  useEffect(() => {
    setValue("couponCode", cartCoupon || "");
  }, [cartCoupon, setValue]);

  // Fetch cities based on country and region
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

  // Handle coupon application
  const handleApplyCoupon = (code: string) => {
    if (!code) {
      toast.error("Please enter a coupon code.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add items before applying a coupon.");
      return;
    }
    setCouponLoading(true);
    setTimeout(() => {
      if (code.toUpperCase() === "SUMMER10") {
        dispatch(applyCoupon({ code: "SUMMER10", discount: 0.1 }));
        toast.success("Coupon applied! 10% off");
      } else {
        toast.error("Invalid coupon code");
      }
      setCouponLoading(false);
    }, 1000);
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return;
    }

    setIsSubmitting(true);
    try {
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.085; // 8.5% tax
      const discount = useSelector((state: RootState) => state.cart.discount) * subtotal;
      const total = subtotal + tax - discount;

      const orderData = {
        billingDetails: {
          firstName: data.firstName,
          lastName: data.lastName,
          companyName: data.companyName,
          email: data.email,
          phone: data.phone,
          address: {
            country: data.country,
            region: data.region,
            city: data.city,
            streetAddress: data.streetAddress,
            apartment: data.apartment,
            postalCode: data.postalCode,
          },
          saveInfo: data.saveInfo,
        },
        paymentMethod: data.paymentMethod,
        cartItems: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        pricing: {
          subtotal: subtotal.toFixed(2),
          shipping: 0,
          tax: tax.toFixed(2),
          discount: discount.toFixed(2),
          total: total.toFixed(2),
        },
        couponCode: cartCoupon || "",
      };

      // TODO: Replace with actual API call (e.g., POST /api/v1/orders)
      console.log("Order submitted:", orderData);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Order placed successfully!");
      navigate("/order-confirmation"); // Redirect to confirmation page
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error("Failed to place order. Please try again.");
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
              activePaymentMethod={activePaymentMethod}
              setActivePaymentMethod={setActivePaymentMethod}
              isSubmitting={isSubmitting}
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