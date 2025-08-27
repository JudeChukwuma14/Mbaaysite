import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Loader2 } from "lucide-react";

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

    const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setIsLoading(true);
        try {
            const tempToken = localStorage.getItem("tempToken");
            if (!tempToken) {
                toast.error("Session expired. Please sign in with Google again.");
                navigate("/signup-vendor");
                return;
            }

            const response = await fetch("https://mbayy-be.onrender.com/api/v1/vendor/google-complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tempToken,
                    storeName: data.storeName,
                    craftCategories: data.craftCategories,
                    storePhone: data.storePhone,
                }),
            });

            const result = await response.json();
            
            if (response.ok) {
                localStorage.setItem("authToken", result.token);
                localStorage.setItem("accountType", "vendor");
                localStorage.removeItem("tempToken");
                toast.success("Vendor created successfully");
                navigate("/app");
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
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow">
                <div className="flex flex-col items-center mb-6">
                    {user.picture && <img src={user.picture} alt="profile" className="w-16 h-16 mb-2 rounded-full" />}
                    <h2 className="text-xl font-semibold">Complete Vendor Signup</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label>Store Name</label>
                        <input type="text" {...register("storeName", { required: true })} />
                        {errors.storeName && <p className="text-sm text-red-500">Store name is required</p>}
                    </div>

                    <div>
                        <label>Store Phone</label>
                        <Controller
                            name="storePhone"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <PhoneInput country="ng" value={field.value} onChange={field.onChange} />}
                        />
                        {errors.storePhone && <p className="text-sm text-red-500">Phone is required</p>}
                    </div>

                    <div>
                        <label>Craft Categories</label>
                        <select multiple {...register("craftCategories", { required: true })}>
                            {craftCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.craftCategories && <p className="text-sm text-red-500">Select at least one category</p>}
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : "Complete Signup"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteSignup;
