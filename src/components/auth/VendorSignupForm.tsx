// VendorSignupForm.tsx
import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Loader2, Store, Phone, Tag, ChevronDown, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import heroBackground from "@/assets/image/bg1.jpg";
import craftIcon from "@/assets/image/MBLogo.png";
import { ToastOptions } from "react-toastify";

// Interface for form data
interface FormData {
    storeName: string;
    storePhone: string;
    craftCategories: string[];
}

// Interface for custom toast props
interface CustomToastProps {
    title: string;
    description: string;
    variant?: "default" | "destructive" | "success";
}

// Custom Toast Component
const CustomToast = ({ title, description, variant = "default" }: CustomToastProps) => {
    const variantStyles = {
        default: "bg-white text-craft-earth border-craft-primary/20",
        destructive: "bg-red-50 text-red-700 border-red-200",
        success: "bg-green-50 text-green-700 border-green-200",
    };

    const icon = variant === "destructive" ? (
        <AlertCircle className="w-5 h-5" />
    ) : (
        <CheckCircle className="w-5 h-5" />
    );

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-[var(--shadow-warm)] ${variantStyles[variant]}`}
        >
            {icon}
            <div className="flex-1">
                <p className="font-medium">{title}</p>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    );
};

// Wrapper function to display the toast
const showToast = ({ title, description, variant }: CustomToastProps, options?: ToastOptions) => {
    import("react-toastify").then(({ toast }) => {
        toast(<CustomToast title={title} description={description} variant={variant} />, options);
    });
};

// Craft categories list
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

const VendorSignupForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = (location.state as any) || {};
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>();

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (selectedCategories.length === 0) {
            showToast({
                title: "Categories Required",
                description: "Please select at least one craft category",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const tempToken = localStorage.getItem("tempToken");
            if (!tempToken) {
                showToast({
                    title: "Session Expired",
                    description: "Please sign in with Google again",
                    variant: "destructive",
                });
                navigate("/signup-vendor");
                return;
            }

            const response = await fetch("https://mbayy-be.onrender.com/api/v1/vendor/google-complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tempToken,
                    storeName: data.storeName,
                    craftCategories: selectedCategories,
                    storePhone: data.storePhone,
                }),
            });

            const result = await response.json();
            console.log(result)
            if (response.ok) {
                localStorage.setItem("authToken", result.token);
                localStorage.setItem("accountType", "vendor");
                localStorage.removeItem("tempToken");
                showToast({
                    title: "Welcome to CraftConnect!",
                    description: "Your vendor account has been created successfully",
                    variant: "success",
                });
                navigate("/app");
            } else {
                showToast({
                    title: "Signup Failed",
                    description: result.message || "Something went wrong. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            showToast({
                title: "Error",
                description: "Unable to complete signup. Please check your connection.",
                variant: "destructive",
            });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="relative top-0 left-0 min-h-screen bg-center bg-cover"
            style={{ backgroundImage: `url(${heroBackground})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-craft-earth/70 backdrop-blur-sm" />

            <div className="relative z-10 flex items-center justify-center px-4 py-8">
                <Card className="w-full max-w-md shadow-[var(--shadow-elevated)] border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="pb-6 space-y-3 text-center">
                        <div className="flex justify-center mb-3">
                            <img
                                src={craftIcon}
                                alt="CraftConnect"
                                className="w-16"
                            />
                        </div>

                        <div className="space-y-1">
                            <CardTitle className="text-xl font-bold md:text-2xl bg-gradient-to-r from-craft-primary to-craft-accent bg-clip-text">
                                Complete Your Vendor Profile
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Join CraftConnect and showcase your artisan creations
                            </CardDescription>
                        </div>

                        {user.picture && (
                            <div className="flex flex-col items-center gap-2 p-3 border rounded-lg bg-craft-warm/50 border-craft-primary/20">
                                <img
                                    src={user.picture}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full border-2 border-craft-accent shadow-[var(--shadow-warm)]"
                                />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-craft-earth">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="p-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Store Name */}
                            <div className="space-y-1">
                                <Label htmlFor="storeName" className="flex items-center gap-2 text-sm font-medium">
                                    <Store className="w-4 h-4 text-craft-primary" />
                                    Store Name
                                </Label>
                                <Input
                                    id="storeName"
                                    placeholder="Enter your store or brand name"
                                    className="h-10 text-sm border-craft-primary/20"
                                    {...register("storeName", {
                                        required: "Store name is required",
                                        minLength: { value: 2, message: "Store name must be at least 2 characters" },
                                    })}
                                />
                                {errors.storeName && (
                                    <p className="text-xs text-destructive">{errors.storeName.message}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-1">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Phone className="w-4 h-4 text-craft-primary" />
                                    Store Phone Number
                                </Label>
                                <Controller
                                    name="storePhone"
                                    control={control}
                                    rules={{ required: "Phone number is required" }}
                                    render={({ field }) => (
                                        <PhoneInput
                                            country="ng"
                                            value={field.value}
                                            onChange={field.onChange}
                                            inputClass="w-full h-10 border border-craft-primary/20 rounded-md px-3 focus:border-craft-primary transition-[var(--transition-craft)] text-sm"
                                            containerClass="phone-input-container"
                                            buttonClass="phone-input-button"
                                        />
                                    )}
                                />
                                {errors.storePhone && (
                                    <p className="text-xs text-destructive">{errors.storePhone.message}</p>
                                )}
                            </div>

                            {/* Craft Categories */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Tag className="w-4 h-4 text-craft-primary" />
                                    Craft Categories
                                    <span className="text-xs font-normal text-muted-foreground">
                                        (Select all that apply)
                                    </span>
                                </Label>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full h-10 justify-between border-craft-primary/20 hover:border-craft-primary transition-[var(--transition-craft)] text-sm focus:outine-orange-400"
                                        >
                                            <span className="text-craft-earth">
                                                {selectedCategories.length === 0
                                                    ? "Select craft categories..."
                                                    : `${selectedCategories.length} categories selected`}
                                            </span>
                                            <ChevronDown className="w-4 h-4 text-craft-primary" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64 max-h-56 overflow-y-auto bg-white border border-craft-primary/20 shadow-[var(--shadow-elevated)]">
                                        {craftCategories.map((category) => (
                                            <DropdownMenuCheckboxItem
                                                key={category}
                                                checked={selectedCategories.includes(category)}
                                                onCheckedChange={() => toggleCategory(category)}
                                                className="text-sm cursor-pointer text-craft-earth hover:bg-craft-warm/30 focus:bg-craft-warm/30"
                                            >
                                                {category}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {selectedCategories.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        <span className="text-xs font-medium text-craft-earth">Selected:</span>
                                        {selectedCategories.map((category) => (
                                            <Badge
                                                key={category}
                                                variant="secondary"
                                                className="text-xs text-white bg-craft-primary"
                                            >
                                                {category}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                size="lg"
                                className="w-full h-12 text-sm bg-orange-500 hover:bg-orange-600"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating Your Store...
                                    </>
                                ) : (
                                    "Complete Vendor Registration"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VendorSignupForm;