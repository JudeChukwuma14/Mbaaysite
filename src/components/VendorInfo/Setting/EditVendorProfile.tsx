import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ChevronDown,
  Eye,
  EyeOff,
  Edit,
  X,
  Search,
} from "lucide-react";
import { MdVerified } from "react-icons/md";
import type React from "react";
import ReturnPolicyUploader from "./ReturnPolicyUploader";
import { toast } from "react-hot-toast";
import { get_single_vendor, upload_return_policy } from "@/utils/vendorApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useUploadAvatar,
  useUploadBusinessLogo,
} from "../../../utils/editvendorApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface VendorProfile {
  companyName: string;
  email: string;
  phone: string;
  bio: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  returnPolicy: string;
}

// Define popup types
type PopupType = "password" | "location" | "account" | "email" | "store" | null;

// Bank logos mapping
const bankLogos: Record<string, string> = {
  "Zenith Bank": "/placeholder.svg?height=30&width=30",
  "First Bank": "/placeholder.svg?height=30&width=30",
  GTBank: "/placeholder.svg?height=30&width=30",
  "Access Bank": "/placeholder.svg?height=30&width=30",
  UBA: "/placeholder.svg?height=30&width=30",
};

// Local storage keys
const PROFILE_IMAGE_KEY = "vendor_profile_image";
const BANNER_IMAGE_KEY = "vendor_banner_image";
const LOGO_IMAGE_KEY = "vendor_logo_image";

export default function EditVendorProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  // const [logoImage, setLogoImage] = useState<string | null>(null);
  const [returnPolicy, setReturnPolicy] = useState<File | null>(null);
  const [returnPolicyName, setReturnPolicyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof VendorProfile, string>>
  >({});
  const [returnPolicyText, setReturnPolicyText] = useState<string>("");
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const [activePopup, setActivePopup] = useState<PopupType>(null);
  const [actualPassword, setActualPassword] = useState("Password123");

  // Form states for popups
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeNumber, setStoreNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSearchingAccount, setIsSearchingAccount] = useState(false);
  const [foundAccountName, setFoundAccountName] = useState("");
  const [foundBankName, setFoundBankName] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  const user = useSelector((state: RootState) => state.vendor);

  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  // Mutations for image uploads
  const uploadAvatarMutation = useUploadAvatar();
  const uploadBusinessLogoMutation = useUploadBusinessLogo();

  const [profile, setProfile] = useState<VendorProfile>({
    companyName: "PreciousLtd Limited",
    email: "preciousltd@gmail.com",
    phone: "+234 805743214",
    bio: "",
    accountName: "OGHOGHO PRECIOUS IHECHIUWU",
    accountNumber: "2784956623",
    bankName: "Zenith Bank",
    returnPolicy: "",
  });

  // Load images from local storage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileImage = localStorage.getItem(PROFILE_IMAGE_KEY);
      const storedBannerImage = localStorage.getItem(BANNER_IMAGE_KEY);
      // const storedLogoImage = localStorage.getItem(LOGO_IMAGE_KEY);

      if (storedProfileImage) {
        setProfileImage(storedProfileImage);
      }
      if (storedBannerImage) {
        setBannerImage(storedBannerImage);
      }
      // if (storedLogoImage) {
      //   setLogoImage(storedLogoImage);
      // }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        editButtonRef.current &&
        !editButtonRef.current.contains(event.target as Node)
      ) {
        setShowEditDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate dropdown position when it's shown
  useEffect(() => {
    if (showEditDropdown && editButtonRef.current && dropdownRef.current) {
      const buttonRect = editButtonRef.current.getBoundingClientRect();
      dropdownRef.current.style.top = `${
        buttonRect.bottom + window.scrollY + 5
      }px`;
      // Position the dropdown to the right of the button
      dropdownRef.current.style.left = `${
        buttonRect.right - dropdownRef.current.offsetWidth + window.scrollX
      }px`;
    }
  }, [showEditDropdown]);

  // Function to save image to local storage
  const saveImageToLocalStorage = (imageData: string, storageKey: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, imageData);
    }
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner" | "logo"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;

        switch (type) {
          case "profile":
            setProfileImage(imageData);
            saveImageToLocalStorage(imageData, PROFILE_IMAGE_KEY);

            // Create FormData and upload profile image
            const profileFormData = new FormData();
            profileFormData.append("avatar", file);
            uploadAvatarMutation.mutate({
              data: profileFormData,
              token: user.token,
            });
            break;

          case "banner":
            setBannerImage(imageData);
            saveImageToLocalStorage(imageData, BANNER_IMAGE_KEY);

            // Create FormData and upload banner image
            const bannerFormData = new FormData();
            bannerFormData.append("businessLogo", file);
            uploadBusinessLogoMutation.mutate({
              data: bannerFormData,
              token: user.token,
            });
            break;

          case "logo":
            // setLogoImage(imageData);
            saveImageToLocalStorage(imageData, LOGO_IMAGE_KEY);

            // Create FormData and upload logo image
            const logoFormData = new FormData();
            logoFormData.append("avatar", file);
            uploadAvatarMutation.mutate({
              data: logoFormData,
              token: user.token,
            });
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleEditOption = (option: string) => {
    setShowEditDropdown(false);

    switch (option) {
      case "password":
        setActivePopup("password");
        setNewPassword("");
        setConfirmPassword("");
        break;
      case "location":
        setActivePopup("location");
        setCountry("");
        setState("");
        setAddress("");
        break;
      case "account":
        setActivePopup("account");
        setAccountNumber("");
        setFoundAccountName("");
        setFoundBankName("");
        break;
      case "email":
        setActivePopup("email");
        setNewEmail("");
        break;
      case "store":
        setActivePopup("store");
        setStoreName("");
        setStoreNumber("");
        break;
      default:
        break;
    }
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate form data
      const newErrors: Partial<Record<keyof VendorProfile, string>> = {};

      if (!profile.companyName.trim()) {
        newErrors.companyName = "Company name is required";
      }

      if (!profile.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!profile.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }

      if (!profile.accountName.trim()) {
        newErrors.accountName = "Account name is required";
      }

      if (!profile.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required";
      }

      if (!profile.bankName.trim()) {
        newErrors.bankName = "Bank name is required";
      }

      // If there are validation errors, stop submission
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error("Please fix the errors in the form");
        return;
      }

      // Prepare form data for submission
      const formData = new FormData();

      // Add profile data
      Object.entries(profile).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Images are now uploaded separately via mutations

      // Add return policy if it exists
      if (returnPolicy) {
        formData.append("returnPolicy", returnPolicy);
        upload_return_policy(user.token, formData).then((res) => {
          console.log(res);
        });
      }

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      toast.success("Profile updated successfully!");

      // Clear any existing errors
      setErrors({});
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle account number search
  const searchAccount = async () => {
    if (!accountNumber.trim()) {
      toast.error("Please enter an account number");
      return;
    }

    setIsSearchingAccount(true);

    try {
      // Simulate API call to search for account details
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response
      setFoundAccountName("JOHN DOE");
      setFoundBankName("FIRST BANK");

      toast.success("Account details found");
    } catch (error) {
      console.error("Error searching account:", error);
      toast.error("Failed to find account details");
    } finally {
      setIsSearchingAccount(false);
    }
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Update the actual password
    setActualPassword(newPassword);

    // Simulate password change
    toast.success("Password changed successfully");
    closePopup();
  };

  // Handle location change
  const handleLocationChange = () => {
    if (!country || !state || !address) {
      toast.error("Please fill all location fields");
      return;
    }

    // Simulate location change
    toast.success("Location updated successfully");
    closePopup();
  };

  // Handle email change
  const handleEmailChange = () => {
    if (!newEmail) {
      toast.error("Please enter a new email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Simulate email change
    setProfile({ ...profile, email: newEmail });
    toast.success("Email updated successfully");
    closePopup();
  };

  // Handle store details change
  const handleStoreChange = () => {
    if (!storeName || !storeNumber) {
      toast.error("Please fill all store details");
      return;
    }

    // Simulate store details change
    setProfile({
      ...profile,
      companyName: storeName,
      phone: storeNumber,
    });
    toast.success("Store details updated successfully");
    closePopup();
  };

  // Handle account details change
  const handleAccountChange = () => {
    if (!accountNumber || !foundAccountName || !foundBankName) {
      toast.error("Please search for a valid account");
      return;
    }

    // Update account details
    setProfile({
      ...profile,
      accountNumber,
      accountName: foundAccountName,
      bankName: foundBankName,
    });

    toast.success("Account details updated successfully");
    closePopup();
  };

  // Function to clear images from local storage and state
  const clearImages = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PROFILE_IMAGE_KEY);
      localStorage.removeItem(BANNER_IMAGE_KEY);
      localStorage.removeItem(LOGO_IMAGE_KEY);

      setProfileImage(null);
      setBannerImage(null);
      // setLogoImage(null);0

      toast.success("All images have been cleared");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Vendor Profile</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              Be Mbaay Verified
              <MdVerified size={20} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Banner and Profile Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="relative h-48 bg-white border border-b-green-100">
              {bannerImage ? (
                <img
                  src={bannerImage || "/placeholder.svg"}
                  alt="Banner"
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-orange-500 to-black" />
              )}
              <motion.input
                type="file"
                id="banner-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "banner")}
              />
              <label
                htmlFor="banner-upload"
                className={`absolute p-2 bg-white rounded-full cursor-pointer bottom-4 right-4 hover:bg-gray-100 ${
                  uploadBusinessLogoMutation.isPending
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {uploadBusinessLogoMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </label>
            </div>
            <div className="p-6">
              <div className="flex items-end gap-4 -mt-16">
                <div className="relative">
                  <div className="w-24 h-24 overflow-hidden bg-gray-200 border-4 border-white rounded-full">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <motion.input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "profile")}
                  />
                  <label
                    htmlFor="profile-upload"
                    className={`absolute bottom-0 right-0 bg-orange-500 p-1.5 rounded-full cursor-pointer hover:bg-orange-600 ${
                      uploadAvatarMutation.isPending
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {uploadAvatarMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-orange-500 rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </label>
                </div>
                <div className="flex flex-col">
                  {/* Removed the company name display */}
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <div className="font-semibold">12</div>
                      <div className="text-gray-500">Followers</div>
                    </div>
                    <div>
                      <div className="font-semibold">17</div>
                      <div className="text-gray-500">Following</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Type and Rating */}
          <motion.div
            variants={itemVariants}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="mb-2 text-sm text-gray-500">Account Type</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg">
                  <span className="font-semibold text-orange-500">S</span>
                </div>
                <div className="font-semibold">Starter</div>
              </div>
              <div className="mt-2">
                <span className="px-3 py-1 text-xs text-white bg-orange-500 rounded-full">
                  Standard Account
                </span>
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="mb-2 text-sm text-gray-500">Business Rating</h3>
              <div className="text-2xl font-bold">3.5</div>
              <button className="text-sm text-purple-600 hover:underline">
                View Reviews
              </button>
            </div>
          </motion.div>

          {/* Personal Information */}
          <motion.div
            variants={itemVariants}
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Personal Information</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Profile Details</span>
                <div className="relative">
                  <button
                    ref={editButtonRef}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 edit-dropdown-toggle"
                    onClick={() => setShowEditDropdown(!showEditDropdown)}
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>

                  {/* Edit Dropdown with fixed z-index and positioning */}
                  {showEditDropdown && (
                    <div className="fixed inset-0 z-[9999] pointer-events-none">
                      <motion.div
                        ref={dropdownRef}
                        className="absolute bg-white rounded-lg shadow-lg py-1 w-48 pointer-events-auto"
                        style={{
                          position: "fixed",
                          zIndex: 9999,
                        }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                          onClick={() => handleEditOption("password")}
                        >
                          Change Password
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                          onClick={() => handleEditOption("location")}
                        >
                          Change Location
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                          onClick={() => handleEditOption("account")}
                        >
                          Change Account Details
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                          onClick={() => handleEditOption("email")}
                        >
                          Change Email Address
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                          onClick={() => handleEditOption("store")}
                        >
                          Change Store Name and Number
                        </button>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-500">
                  Company Name
                </label>
                <motion.input
                  type="text"
                  value={vendors?.storeName}
                  readOnly
                  className={`w-full p-2 border rounded-lg bg-gray-50 cursor-not-allowed ${
                    errors.companyName ? "border-red-500" : ""
                  }`}
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.companyName}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-500">
                  Email Address
                </label>
                <motion.input
                  type="email"
                  value={vendors?.email}
                  readOnly
                  className={`w-full p-2 border rounded-lg bg-gray-50 cursor-not-allowed ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-500">
                  Phone Number
                </label>
                <motion.input
                  type="tel"
                  value={vendors?.storePhone}
                  readOnly
                  className={`w-full p-2 border rounded-lg bg-gray-50 cursor-not-allowed ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-500">
                  Password
                </label>
                <div className="relative">
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    value={showPassword ? actualPassword : "••••••••••••"}
                    className="w-full p-2 border rounded-lg bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  className="mt-3 text-sm text-purple-600 hover:text-purple-700"
                  onClick={() => handleEditOption("password")}
                >
                  Change password
                </button>
              </div>
            </div>
          </motion.div>

          {/* Business Category */}
          <motion.div
            variants={itemVariants}
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
                  💄
                </div>
                <span>Beauty and Skin Care</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            variants={itemVariants}
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <h2 className="mb-4 font-semibold">Payment Details</h2>
            <div className="grid gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-500">
                  Account Name
                </label>
                <motion.input
                  type="text"
                  value={profile.accountName}
                  readOnly
                  className={`w-full p-2 border rounded-lg bg-gray-50 cursor-not-allowed ${
                    errors.accountName ? "border-red-500" : ""
                  }`}
                />
                {errors.accountName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.accountName}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-500">
                  Account Number
                </label>
                <motion.input
                  type="text"
                  value={profile.accountNumber}
                  readOnly
                  className={`w-full p-2 border rounded-lg bg-gray-50 cursor-not-allowed ${
                    errors.accountNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.accountNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-500">
                  Bank Name
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2 w-full p-2 border rounded-lg bg-gray-50 cursor-not-allowed">
                    {profile.bankName && bankLogos[profile.bankName] && (
                      <img
                        src={bankLogos[profile.bankName] || "/placeholder.svg"}
                        alt={profile.bankName}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <motion.input
                      type="text"
                      value={profile.bankName}
                      readOnly
                      className={`flex-1 outline-none bg-gray-50 cursor-not-allowed ${
                        errors.bankName ? "text-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                {errors.bankName && (
                  <p className="mt-1 text-xs text-red-500">{errors.bankName}</p>
                )}
              </div>
              <button
                type="button"
                className="text-sm text-purple-600 hover:text-purple-700"
                onClick={() => handleEditOption("account")}
              >
                Change account details
              </button>
            </div>
          </motion.div>

          <ReturnPolicyUploader
            returnPolicy={returnPolicy}
            returnPolicyName={returnPolicyName}
            setReturnPolicy={setReturnPolicy}
            setReturnPolicyName={setReturnPolicyName}
            returnPolicyText={returnPolicyText}
            setReturnPolicyText={setReturnPolicyText}
          />

          {/* Logo & Branding */}
          {/* <motion.div
            variants={itemVariants}
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <h2 className="mb-4 font-semibold">Logo & Branding</h2>
            <div className="p-8 text-center border-2 border-orange-500 border-dashed rounded-lg">
              {logoImage ? (
                <img
                  src={logoImage || "/placeholder.svg"}
                  alt="Logo"
                  className="max-w-[200px] mx-auto"
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gray-100 rounded-lg">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Upload your logo</p>
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "logo")}
                    />
                    <label
                      htmlFor="logo-upload"
                      className={`inline-block px-4 py-2 mt-2 text-white bg-orange-500 rounded-lg cursor-pointer hover:bg-orange-600 ${
                        uploadAvatarMutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {uploadAvatarMutation.isPending
                        ? "Uploading..."
                        : "Upload Now"}
                    </label>
                  </div>
                </div>
              )}
            </div>
          </motion.div> */}

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-end gap-4"
          >
            <button
              className="px-6 py-2 border border-orange-500 rounded-lg hover:bg-orange-50"
              onClick={clearImages}
            >
              Discard Changes
            </button>

            <button
              className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Popups */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md overflow-hidden bg-white rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                {/* Password Change Popup */}
                {activePopup === "password" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Change Password</h2>
                      <button
                        onClick={closePopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          New Password
                        </label>
                        <motion.input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          Confirm New Password
                        </label>
                        <motion.input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                          onClick={closePopup}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                          onClick={handlePasswordChange}
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Location Change Popup */}
                {activePopup === "location" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Change Location</h2>
                      <button
                        onClick={closePopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          Country
                        </label>
                        <motion.input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          State
                        </label>
                        <motion.input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          Address
                        </label>
                        <motion.textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                          onClick={closePopup}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                          onClick={handleLocationChange}
                        >
                          Update Location
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Account Change Popup */}
                {activePopup === "account" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">
                        Change Account Details
                      </h2>
                      <button
                        onClick={closePopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          Account Number
                        </label>
                        <div className="flex gap-2">
                          <motion.input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                          />
                          <button
                            className="flex items-center gap-1 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                            onClick={searchAccount}
                            disabled={isSearchingAccount}
                          >
                            {isSearchingAccount ? (
                              "Searching..."
                            ) : (
                              <>
                                <Search className="w-4 h-4" />
                                Search
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {foundAccountName && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">
                            Account Name:{" "}
                            <span className="text-gray-700">
                              {foundAccountName}
                            </span>
                          </p>
                          <p className="text-sm font-medium">
                            Bank:{" "}
                            <span className="text-gray-700">
                              {foundBankName}
                            </span>
                          </p>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                          onClick={closePopup}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                          onClick={handleAccountChange}
                          disabled={!foundAccountName}
                        >
                          Update Account
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Email Change Popup */}
                {activePopup === "email" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">
                        Change Email Address
                      </h2>
                      <button
                        onClick={closePopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          New Email Address
                        </label>
                        <motion.input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                          onClick={closePopup}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                          onClick={handleEmailChange}
                        >
                          Update Email
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Store Change Popup */}
                {activePopup === "store" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">
                        Change Store Details
                      </h2>
                      <button
                        onClick={closePopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          Store Name
                        </label>
                        <motion.input
                          type="text"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          Store Number
                        </label>
                        <motion.input
                          type="tel"
                          value={storeNumber}
                          onChange={(e) => setStoreNumber(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                          onClick={closePopup}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                          onClick={handleStoreChange}
                        >
                          Update Store
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
