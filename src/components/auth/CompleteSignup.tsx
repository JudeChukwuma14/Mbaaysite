import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Loader2, Store, Phone, Tag } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setVendor } from "@/redux/slices/vendorSlice";

interface FormData {
  storeName: string;
  storePhone: string;
  craftCategory: string; // Changed from craftCategories to craftCategory
}

const craftCategories = [
  "Art & Sculptures",
  "Beauty and Wellness",
  "Books and Poetry",
  "Fashion Clothing and Fabrics",
  "Jewelry and Gemstones",
  "Vintage and Antique Jewelry",
  "Home Décor and Accessories",
  "Vintage Stocks",
  "Plant and Seeds",
  "Spices, Condiments and Seasonings",
  "Local & Traditional Foods",
  "Traditional and Religious Items",
  "Local Food and Drink Products",
];

const CompleteSignup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Changed to single category

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("googleUser") || "{}");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!selectedCategory) {
      toast.error("Select a craft category");
      return;
    }

    setIsLoading(true);
    try {
      const tempToken = localStorage.getItem("tempToken");
      if (!tempToken) {
        toast.error("Session expired. Please sign in with Google again.");
        navigate("/signup-vendor");
        return;
      }

      const response = await axios.post(
        "https://mbayy-be.onrender.com/api/v1/vendor/google-complete",
        {
          storeName: data.storeName,
          storePhone: data.storePhone,
          craftCategories: [selectedCategory], // Send as array with single item
        },
        { 
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tempToken}` 
          } 
        }
      );

      const result = response.data;

      // Persist auth info
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("accountType", "vendor");
      localStorage.setItem("vendorData", JSON.stringify(result.vendor));
      localStorage.removeItem("tempToken");
      localStorage.removeItem("googleUser");

      // Update Redux state
      dispatch(setVendor({ vendor: result.vendor, token: result.token }));

      toast.success("Vendor created successfully");
      navigate("/welcomepage");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error completing signup";
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (err.response?.status === 400 && errorMessage.includes("already exists")) {
        navigate("/signup-vendor");
      } else if (err.response?.status === 400 && errorMessage.includes("No admin found")) {
        toast.error("System error. Please try again later.");
      } else if (err.response?.status === 401 && errorMessage.includes("jwt")) {
        toast.error("Session expired. Please sign in again.");
        navigate("/signup-vendor");
      }
      
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center mb-4">
          {user.picture && (
            <img
              src={user.picture}
              alt="profile"
              className="w-12 h-12 mb-2 rounded-full"
            />
          )}
          <h2 className="text-lg font-semibold">
            Complete Your Vendor Profile
          </h2>
          <span className="text-sm">
            Join CraftConnect and showcase your artisan creations
          </span>
          <p className="text-xs text-gray-600">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-2 text-xs font-medium">
              <Store className="w-4 h-4 text-craft-primary" />
              Store Name
            </label>
            <input
              type="text"
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              {...register("storeName", { required: "Store name is required" })}
            />
            {errors.storeName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.storeName.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-xs font-medium">
              <Phone className="w-4 h-4 text-craft-primary" />
              Store Phone Number
            </label>
            <Controller
              name="storePhone"
              control={control}
              rules={{ required: "Phone number is required" }}
              render={({ field }) => (
                <PhoneInput
                  country="ng"
                  value={field.value}
                  onChange={field.onChange}
                  inputClass="w-full h-10 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none text-sm"
                  containerClass="phone-input-container"
                  buttonClass="phone-input-button"
                />
              )}
            />
            {errors.storePhone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.storePhone.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-xs font-medium">
              <Tag className="w-4 h-4 text-craft-primary" />
              Craft Category
            </label>
            <Controller
              name="craftCategory"
              control={control}
              rules={{ required: "Select a category" }}
              render={({ field }) => (
                <>
                  <select
                    {...field}
                    value={selectedCategory}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedCategory(e.target.value);
                    }}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select your craft category</option>
                    {craftCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {selectedCategory && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedCategory}
                      </span>
                    </div>
                  )}
                </>
              )}
            />
            {errors.craftCategory && (
              <p className="mt-1 text-xs text-red-500">
                {errors.craftCategory.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full h-10 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Complete Signup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteSignup;