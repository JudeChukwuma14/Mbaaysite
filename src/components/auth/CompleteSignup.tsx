import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Loader2, ChevronDown, Store, Phone, Tag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

interface FormData {
  storeName: string;
  storePhone: string;
  craftCategories: string[];
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
  const location = useLocation();
  const user = (location.state as any) || {};
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (selectedCategories.length === 0) {
      toast.error("Select at least one craft category");
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

      const response = await fetch(
        "https://mbayy-be.onrender.com/api/v1/vendor/google-complete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tempToken,
            storeName: data.storeName,
            craftCategories: selectedCategories,
            storePhone: data.storePhone,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("accountType", "vendor");
        localStorage.removeItem("tempToken");
        toast.success("Vendor created successfully");
        navigate("/welcomepage");
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Error completing signup");
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
              Craft Categories
              <span className="text-xs font-normal text-muted-foreground">
                (Select all that apply)
              </span>
            </label>
            <Controller
              name="craftCategories"
              control={control}
              rules={{
                validate: () =>
                  selectedCategories.length > 0 ||
                  "Select at least one category",
              }}
              render={() => (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center justify-between w-full h-10 px-3 text-sm text-gray-700 border border-gray-300 rounded-md hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                      >
                        <span>
                          {selectedCategories.length === 0
                            ? "Select craft categories..."
                            : `${selectedCategories.length} categories selected`}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 overflow-y-auto bg-white border border-gray-300 rounded-md shadow max-h-56">
                      {craftCategories.map((category) => (
                        <DropdownMenuCheckboxItem
                          key={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                          className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          {category}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedCategories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            />
            {errors.craftCategories && (
              <p className="mt-1 text-xs text-red-500">
                {errors.craftCategories.message}
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
