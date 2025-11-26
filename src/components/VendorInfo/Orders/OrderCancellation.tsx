import React, { useState } from "react";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCancelOrPostponeOrder } from "@/hook/useOrders";
import { toast } from "react-toastify";

type FormData = {
  orderId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  streetAddress2?: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  action: "cancel" | "postpone";
  fromDate?: string;
  toDate?: string;
  reason: string;
  termsAccepted: boolean;
};

const CancellationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      action: "cancel",
    },
  });

  const action = watch("action");
  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const countries: ICountry[] = Country.getAllCountries();
  const states: IState[] = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : [];
  const cities: ICity[] =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry, selectedState)
      : [];

  const token = useSelector(
    (state: RootState) => state.user.token || state.vendor.token
  );

  const cancelOrPostponeMutation = useCancelOrPostponeOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    const address = data.streetAddress2
      ? `${data.streetAddress}, ${data.streetAddress2}`
      : data.streetAddress;

    const payload: any = {
      orderId: data.orderId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      postalCode: data.postalCode,
      address,
      country: data.country,
      state: data.state,
      city: data.city,
      isCancellation: data.action === "cancel",
      isPostponement: data.action === "postpone",
      cancellationReason: data.action === "cancel" ? data.reason : undefined,
      postponementFromDate:
        data.action === "postpone" ? data.fromDate : undefined,
      postponementToDate: data.action === "postpone" ? data.toDate : undefined,
    };

    setIsSubmitting(true);
    try {
      const res = await cancelOrPostponeMutation.mutateAsync({ payload });
      console.log("RYRR", res);
      // Optionally reset form or show additional UI; react-query toast already notifies
      reset();
      toast.success("Request submitted successfully!");
    } catch (err) {
      // error handled by hook onError, optionally log
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-4 mx-auto overflow-x-hidden sm:p-6">
      <h2 className="mb-6 text-2xl font-semibold text-center">
        Cancellation / Postponement Form
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Order ID and Email */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium" htmlFor="orderId">
              Order Number/ID
            </label>
            <input
              {...register("orderId", { required: "Order ID is required" })}
              type="text"
              placeholder="Order ID"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            />
            {errors.orderId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.orderId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="example@gmail.com"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              className="block mb-2 text-sm font-medium"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              {...register("firstName", { required: "First name is required" })}
              type="text"
              placeholder="First Name"
              className="w-full p-3 border focus:outline-none focus:ring focus:ring-orange-400"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label
              className="block mb-2 text-sm font-medium"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              placeholder="Last Name"
              className="w-full p-3 border focus:outline-none focus:ring focus:ring-orange-400"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Phone Number */}
          <div>
            <label className="block mb-2 text-sm font-medium" htmlFor="phone">
              Phone Number
            </label>
            <Controller
              name="phone"
              control={control}
              rules={{ required: "Phone number is required" }}
              render={({ field }) => (
                <PhoneInput
                  country={"us"}
                  value={field.value}
                  onChange={(phone) => field.onChange(phone)}
                  inputProps={{
                    name: "phone",
                    required: true,
                  }}
                  containerClass="w-full"
                  inputClass="!w-full !h-[48px] !pl-14 !border !border-gray-300 !py-2 !px-4 focus:!border-orange-500 focus:!outline-none "
                  buttonClass="!h-[48px] !border-r !border-gray-300 !bg-white "
                  dropdownClass="!z-10"
                />
              )}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label
              className="block mb-2 text-sm font-medium"
              htmlFor="postalCode"
            >
              Postal Code
            </label>
            <input
              {...register("postalCode", {
                required: "Postal code is required",
              })}
              type="text"
              placeholder="Postal Code"
              className="w-full h-[48px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.postalCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label
            className="block mb-2 text-sm font-medium"
            htmlFor="streetAddress"
          >
            Address
          </label>
          <input
            {...register("streetAddress", { required: "Address is required" })}
            type="text"
            placeholder="Street Address"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
          />
          {errors.streetAddress && (
            <p className="mt-1 text-sm text-red-600">
              {errors.streetAddress.message}
            </p>
          )}
          <input
            {...register("streetAddress2")}
            type="text"
            placeholder="Street Address 2"
            className="w-full p-3 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block mb-2 text-sm font-medium" htmlFor="country">
              Country
            </label>
            <select
              {...register("country", { required: "Country is required" })}
              className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
              onChange={(e) => {
                setValue("country", e.target.value);
                setValue("state", "");
                setValue("city", "");
              }}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">
                {errors.country.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium" htmlFor="state">
              State
            </label>
            <select
              {...register("state", { required: "State is required" })}
              className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
              disabled={!selectedCountry}
              onChange={(e) => {
                setValue("state", e.target.value);
                setValue("city", "");
              }}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">
                {errors.state.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium" htmlFor="city">
              City
            </label>
            <select
              {...register("city", { required: "City is required" })}
              className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
              disabled={!selectedState}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
        </div>

        {/* Action Selection */}
        <fieldset>
          <legend className="mb-4 text-sm font-medium">
            Do you want to cancel or postpone your order?
          </legend>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="flex items-center">
              <input
                type="radio"
                value="cancel"
                {...register("action")}
                className="mr-2"
              />
              I want to cancel my order.
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="postpone"
                {...register("action")}
                className="mr-2"
              />
              I want to postpone my order.
            </label>
          </div>
        </fieldset>

        {/* Postponement Dates */}
        {action === "postpone" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                className="block mb-2 text-sm font-medium"
                htmlFor="fromDate"
              >
                From
              </label>
              <input
                {...register("fromDate", {
                  required:
                    action === "postpone" ? "From date is required" : false,
                })}
                type="date"
                className="w-full p-3 border focus:outline-none focus:ring focus:ring-orange-400"
              />
              {errors.fromDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fromDate.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-medium"
                htmlFor="toDate"
              >
                To
              </label>
              <input
                {...register("toDate", {
                  required:
                    action === "postpone" ? "To date is required" : false,
                })}
                type="date"
                className="w-full p-3 border focus:outline-none focus:ring focus:ring-orange-400"
              />
              {errors.toDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.toDate.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block mb-2 text-sm font-medium" htmlFor="reason">
            Reason for Cancellation / Postponement
          </label>
          <textarea
            {...register("reason", { required: "Reason is required" })}
            placeholder="Please specify your reason..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
            rows={4}
          />
          {errors.reason && (
            <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("termsAccepted", {
              required: "You must agree to the terms and conditions",
            })}
            className="mr-2"
          />
          <label className="text-sm">
            I agree to{" "}
            <a href="#" className="text-orange-500 underline">
              terms & conditions
            </a>
            .
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="mt-1 text-sm text-red-600">
            {errors.termsAccepted.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-3 font-medium text-white focus:outline-none focus:ring focus:ring-orange-400 rounded-md ${
            isSubmitting
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CancellationForm;
