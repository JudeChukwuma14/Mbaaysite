import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronDown, Edit, X, Search } from "lucide-react";
import { MdVerified } from "react-icons/md";
import type React from "react";
import ReturnPolicyUploader from "./ReturnPolicyUploader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get_single_vendor, upload_return_policy } from "@/utils/vendorApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useUploadAvatar,
  useUploadBusinessLogo,
} from "../../../utils/editvendorApi";
import {
  useChangeVendorPassword,
  useUpdateVendorLocation,
  useInitiateVendorEmailChange,
  useVerifyVendorEmail,
  useUpdateStoreDetails,
} from "@/hook/updateVendor";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useCreateRecipientCode } from "@/hook/useRecipientCode";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosContact } from "react-icons/io";

// Default banner image (MBAAY logo)
const defaultBanner = "https://www.mbaay.com/assets/MBLogo-spwX6zWd.png";

interface VendorProfile {
  companyName: string;
  email: string;
  phone: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  returnPolicy: string;
}

// Define popup types
type PopupType = "password" | "location" | "account" | "email" | "store" | null;

// Enhanced bank data with logos - this will be replaced by Paystack API
const bankLogos: Record<string, string> = {
  // ====== COMMERCIAL BANKS ======
  "Access Bank": "/placeholder.svg?height=30&width=30&text=Access",
  "Citibank Nigeria": "/placeholder.svg?height=30&width=30&text=Citi",
  "Ecobank Nigeria": "/placeholder.svg?height=30&width=30&text=Ecobank",
  "Fidelity Bank": "/placeholder.svg?height=30&width=30&text=Fidelity",
  "First Bank of Nigeria": "/placeholder.svg?height=30&width=30&text=FirstBank",
  "First City Monument Bank": "/placeholder.svg?height=30&width=30&text=FCMB",
  "Globus Bank": "/placeholder.svg?height=30&width=30&text=Globus",
  "Guaranty Trust Bank": "/placeholder.svg?height=30&width=30&text=GTBank",
  "Heritage Bank": "/placeholder.svg?height=30&width=30&text=Heritage",
  "Jaiz Bank": "/placeholder.svg?height=30&width=30&text=Jaiz",
  "Keystone Bank": "/placeholder.svg?height=30&width=30&text=Keystone",
  "Parallex Bank": "/placeholder.svg?height=30&width=30&text=Parallex",
  "Polaris Bank": "/placeholder.svg?height=30&width=30&text=Polaris",
  "PremiumTrust Bank": "/placeholder.svg?height=30&width=30&text=PremiumTrust",
  "Providus Bank": "/placeholder.svg?height=30&width=30&text=Providus",
  "Stanbic IBTC Bank": "/placeholder.svg?height=30&width=30&text=Stanbic",
  "Sterling Bank": "/placeholder.svg?height=30&width=30&text=Sterling",
  "SunTrust Bank": "/placeholder.svg?height=30&width=30&text=SunTrust",
  TAJBank: "/placeholder.svg?height=30&width=30&text=TAJBank",
  "Titan Trust Bank": "/placeholder.svg?height=30&width=30&text=Titan",
  "Union Bank of Nigeria": "/placeholder.svg?height=30&width=30&text=Union",
  "United Bank for Africa": "/placeholder.svg?height=30&width=30&text=UBA",
  "Wema Bank": "/placeholder.svg?height=30&width=30&text=Wema",
  "Zenith Bank": "/placeholder.svg?height=30&width=30&text=Zenith",

  // ====== ONLINE/DIGITAL BANKS & MFBs ======
  "ALAT by Wema": "/placeholder.svg?height=30&width=30&text=ALAT",
  "Carbon (One Finance)": "/placeholder.svg?height=30&width=30&text=Carbon",
  "Chipper Cash": "/placeholder.svg?height=30&width=30&text=Chipper",
  Eyowo: "/placeholder.svg?height=30&width=30&text=Eyowo",
  "FairMoney Microfinance Bank":
    "/placeholder.svg?height=30&width=30&text=FairMoney",
  "FinaTrust Microfinance Bank":
    "/placeholder.svg?height=30&width=30&text=FinaTrust",
  "Hackman Microfinance Bank":
    "/placeholder.svg?height=30&width=30&text=Hackman",
  "Kuda Bank": "/placeholder.svg?height=30&width=30&text=Kuda",
  "Lotus Bank": "/placeholder.svg?height=30&width=30&text=Lotus",
  "Moniepoint Microfinance Bank":
    "/placeholder.svg?height=30&width=30&text=Moniepoint",
  "Mint Finex MFB": "/placeholder.svg?height=30&width=30&text=Mint",
  NowNow: "/placeholder.svg?height=30&width=30&text=NowNow",
  "OPay Digital Bank": "/image/bank/Opay.png",
  "PalmPay Digital Bank": "/placeholder.svg?height=30&width=30&text=PalmPay",
  "Rubies Bank": "/placeholder.svg?height=30&width=30&text=Rubies",
  "Sparkle Microfinance Bank":
    "/placeholder.svg?height=30&width=30&text=Sparkle",
  "VFD Microfinance Bank": "/placeholder.svg?height=30&width=30&text=VFD",

  // ====== PAYMENT SERVICE BANKS (PSBs) ======
  "9PSB": "/placeholder.svg?height=30&width=30&text=9PSB",
  "Momo PSB": "/placeholder.svg?height=30&width=30&text=MomoPSB",
  "Smartcash PSB": "/placeholder.svg?height=30&width=30&text=Smartcash",

  // ====== BRICKS & MORTAR MICROFINANCE BANKS ======
  "AB Microfinance Bank": "/placeholder.svg?height=30&width=30&text=AB",
  "Accion Microfinance Bank": "/placeholder.svg?height=30&width=30&text=Accion",
  "Baobab Microfinance Bank": "/placeholder.svg?height=30&width=30&text=Baobab",
  "CEMCS Microfinance Bank": "/placeholder.svg?height=30&width=30&text=CEMCS",
  "Finca Microfinance Bank": "/placeholder.svg?height=30&width=30&text=Finca",
  "Fortis Microfinance Bank": "/placeholder.svg?height=30&width=30&text=Fortis",
  "Hasal Microfinance Bank": "/placeholder.svg?height=30&width=30&text=Hasal",
  "Infinity Microfinance Bank":
    "/placeholder.svg?height=30&width=30&text=Infinity",
  "LAPO Microfinance Bank": "/placeholder.svg?height=30&width=30&text=LAPO",
  "Mutual Trust Microfinance Bank":
    "/placeholder.svg?height=30&width=30&text=MutualTrust",
  "NPF Microfinance Bank": "/placeholder.svg?height=30&width=30&text=NPF",
  "Peace Microfinance Bank": "/placeholder.svg?height=30&width=30&text=Peace",
  "QuickFund Microfinance Bank":
    "/placeholder.svg?height=30&width=30&text=QuickFund",
  "RenMoney Microfinance Bank":
    "/placeholder.svg?height=30&width=30&text=RenMoney",
  "Seedvest Microfinance Bank": "/image/bank/",
};

// Enhanced bank codes with all categories
export const bankCodes = [
  // ====== COMMERCIAL BANKS ======
  { name: "Access Bank", code: "044", type: "Commercial" },
  { name: "Citibank Nigeria", code: "023", type: "Commercial" },
  { name: "Ecobank Nigeria", code: "050", type: "Commercial" },
  { name: "Fidelity Bank", code: "070", type: "Commercial" },
  { name: "First Bank of Nigeria", code: "011", type: "Commercial" },
  { name: "First City Monument Bank", code: "214", type: "Commercial" },
  { name: "Globus Bank", code: "00103", type: "Commercial" },
  { name: "Guaranty Trust Bank", code: "058", type: "Commercial" },
  { name: "Heritage Bank", code: "030", type: "Commercial" },
  { name: "Jaiz Bank", code: "301", type: "Commercial" },
  { name: "Keystone Bank", code: "082", type: "Commercial" },
  { name: "Parallex Bank", code: "104", type: "Commercial" },
  { name: "Polaris Bank", code: "076", type: "Commercial" },
  { name: "PremiumTrust Bank", code: "105", type: "Commercial" },
  { name: "Providus Bank", code: "101", type: "Commercial" },
  { name: "Stanbic IBTC Bank", code: "221", type: "Commercial" },
  { name: "Sterling Bank", code: "232", type: "Commercial" },
  { name: "SunTrust Bank", code: "100", type: "Commercial" },
  { name: "TAJBank", code: "302", type: "Commercial" },
  { name: "Titan Trust Bank", code: "102", type: "Commercial" },
  { name: "Union Bank of Nigeria", code: "032", type: "Commercial" },
  { name: "United Bank for Africa", code: "033", type: "Commercial" },
  { name: "Wema Bank", code: "035", type: "Commercial" },
  { name: "Zenith Bank", code: "057", type: "Commercial" },

  // ====== DIGITAL BANKS ======
  { name: "ALAT by Wema", code: "035", type: "Digital" },
  { name: "Carbon (One Finance)", code: "565", type: "Digital" },
  { name: "Chipper Cash", code: "100022", type: "Digital" },
  { name: "Eyowo", code: "50126", type: "Digital" },
  { name: "Kuda Bank", code: "50211", type: "Digital" },
  { name: "Lotus Bank", code: "303", type: "Digital" },
  { name: "NowNow", code: "050", type: "Digital" },
  { name: "OPay Digital Bank", code: "999992", type: "Digital" },
  { name: "PalmPay Digital Bank", code: "999991", type: "Digital" },
  { name: "Rubies Bank", code: "125", type: "Digital" },

  // ====== MICROFINANCE BANKS ======
  { name: "FairMoney Microfinance Bank", code: "090", type: "Microfinance" },
  { name: "FinaTrust Microfinance Bank", code: "107", type: "Microfinance" },
  { name: "Hackman Microfinance Bank", code: "51251", type: "Microfinance" },
  { name: "Moniepoint Microfinance Bank", code: "50515", type: "Microfinance" },
  { name: "Mint Finex MFB", code: "50304", type: "Microfinance" },
  { name: "Sparkle Microfinance Bank", code: "51310", type: "Microfinance" },
  { name: "VFD Microfinance Bank", code: "566", type: "Microfinance" },
  { name: "AB Microfinance Bank", code: "090197", type: "Microfinance" },
  { name: "Accion Microfinance Bank", code: "090134", type: "Microfinance" },
  { name: "Baobab Microfinance Bank", code: "090118", type: "Microfinance" },
  { name: "CEMCS Microfinance Bank", code: "50823", type: "Microfinance" },
  { name: "Finca Microfinance Bank", code: "090107", type: "Microfinance" },
  { name: "Fortis Microfinance Bank", code: "50162", type: "Microfinance" },
  { name: "Hasal Microfinance Bank", code: "090121", type: "Microfinance" },
  { name: "Infinity Microfinance Bank", code: "090157", type: "Microfinance" },
  { name: "LAPO Microfinance Bank", code: "090259", type: "Microfinance" },
  {
    name: "Mutual Trust Microfinance Bank",
    code: "090161",
    type: "Microfinance",
  },
  { name: "NPF Microfinance Bank", code: "090194", type: "Microfinance" },
  { name: "Peace Microfinance Bank", code: "090292", type: "Microfinance" },
  { name: "QuickFund Microfinance Bank", code: "090261", type: "Microfinance" },
  { name: "RenMoney Microfinance Bank", code: "090198", type: "Microfinance" },
  { name: "Seedvest Microfinance Bank", code: "090112", type: "Microfinance" },

  // ====== PAYMENT SERVICE BANKS (PSBs) ======
  { name: "9PSB", code: "120001", type: "PSB" },
  { name: "Momo PSB", code: "120003", type: "PSB" },
  { name: "Smartcash PSB", code: "120002", type: "PSB" },
];

// Local storage keys
const PROFILE_IMAGE_KEY = "vendorAvatar";
const BANNER_IMAGE_KEY = "businessLogo";
const LOGO_IMAGE_KEY = "vendor_logo_image";

// Maximum file sizes in bytes
const MAX_BANNER_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PROFILE_SIZE = 2 * 1024 * 1024; // 2MB

// Helper function to format bytes to MB
const formatFileSize = (bytes: number) => {
  return (bytes / (1024 * 1024)).toFixed(2) + "MB";
};

// Helper function to get bank logo from bank name
const getBankLogo = (bankName: string): string => {
  if (!bankName) return "/images/banks/default-bank.png";

  // First try exact match
  if (bankLogos[bankName]) {
    return bankLogos[bankName];
  }

  // Try partial matches for common variations
  const normalizedBankName = bankName.toLowerCase().trim();

  for (const [key, logo] of Object.entries(bankLogos)) {
    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.includes(normalizedBankName) ||
      normalizedBankName.includes(normalizedKey)
    ) {
      return logo;
    }
  }

  // Return default if no match found
  return "/images/banks/default-bank.png";
};

export default function EditVendorProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
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
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const paymentRef = useRef<HTMLDivElement | null>(null);
  const [flashPayment, setFlashPayment] = useState(false);
  const returnPolicyRef = useRef<HTMLDivElement | null>(null);
  const [flashReturnPolicy, setFlashReturnPolicy] = useState(false);

  // Form states for popups
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeNumber, setStoreNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSearchingAccount, setIsSearchingAccount] = useState(false);
  const [foundAccountName, setFoundAccountName] = useState("");
  const [foundBankName, setFoundBankName] = useState("");
  const [hasTriedVerify, setHasTriedVerify] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.vendor);

  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => {
      if (!user.token) {
        throw new Error("No token available");
      }
      return get_single_vendor(user.token);
    },
  });
  localStorage.setItem("vendorAvatar", vendors?.avatar || "");
  localStorage.setItem("businessLogo", vendors?.businessLogo || "");

  // Mutations for image uploads and recipient code
  const uploadAvatarMutation = useUploadAvatar();
  const uploadBusinessLogoMutation = useUploadBusinessLogo();
  const createRecipientCodeMutation = useCreateRecipientCode();
  const queryClient = useQueryClient();

  // New mutations for vendor updates
  const changePasswordMutation = useChangeVendorPassword();
  const updateLocationMutation = useUpdateVendorLocation();
  const initiateEmailChangeMutation = useInitiateVendorEmailChange();
  const verifyEmailMutation = useVerifyVendorEmail();
  const updateStoreDetailsMutation = useUpdateStoreDetails();

  // Global pending flag for a subtle editing/loading overlay
  const anyPending =
    isSubmitting ||
    uploadAvatarMutation.isPending ||
    uploadBusinessLogoMutation.isPending ||
    createRecipientCodeMutation.isPending ||
    changePasswordMutation.isPending ||
    updateLocationMutation.isPending ||
    initiateEmailChangeMutation.isPending ||
    verifyEmailMutation.isPending ||
    updateStoreDetailsMutation.isPending;

  const [profile, setProfile] = useState<VendorProfile>({
    companyName: "",
    email: "",
    phone: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
    returnPolicy: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !imagesLoaded) {
      try {
        const storedProfileImage = localStorage.getItem("vendorAvatar");
        const storedBannerImage = localStorage.getItem("businessLogo");

        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
        }
        if (storedBannerImage) {
          setBannerImage(storedBannerImage);
        }

        setImagesLoaded(true);
      } catch (error) {
        console.error("Error loading images from localStorage:", error);
      }
    }
  }, [imagesLoaded]);

  // Auto-open/scroll when navigated with ?open=account or ?open=return-policy
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const openParam = params.get("open");
      if (openParam === "account") {
        setActivePopup("account");
        // Next frame to ensure popup is rendered
        setTimeout(() => {
          paymentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          setFlashPayment(true);
          setTimeout(() => setFlashPayment(false), 1600);
        }, 50);
        // Clean the URL by removing the query param
        navigate(
          { pathname: location.pathname, hash: location.hash },
          { replace: true }
        );
      } else if (openParam === "return-policy") {
        // Scroll and flash the return policy uploader section
        setTimeout(() => {
          returnPolicyRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          setFlashReturnPolicy(true);
          setTimeout(() => setFlashReturnPolicy(false), 1600);
        }, 50);
        // Clean the URL by removing the query param
        navigate(
          { pathname: location.pathname, hash: location.hash },
          { replace: true }
        );
      }
    } catch (e) {
      // ignore parsing errors
    }
  }, [location.search]);

  useEffect(() => {
    if (vendors) {
      setProfile((prev) => ({
        ...prev,
        companyName: vendors.storeName || prev.companyName,
        email: vendors.email || prev.email,
        phone: vendors.storePhone || prev.phone,
        accountName: vendors.bankAccount?.accountName || prev.accountName,
        accountNumber: vendors.bankAccount?.accountNumber || prev.accountNumber,
        bankName: vendors.bankAccount?.bankName || prev.bankName,
      }));
    }
  }, [vendors]);
  // Enhanced useEffect to listen for Mbaay policy upload events
  useEffect(() => {
    const handleMbaayPolicyUpload = (event: CustomEvent) => {
      const { fileName } = event.detail;

      // Get the stored policy data
      const storedPolicy = localStorage.getItem("mbaay_return_policy");
      if (storedPolicy) {
        try {
          const policyData = JSON.parse(storedPolicy);

          // Convert base64 back to File object
          const base64Data = policyData.file.split(",")[1]; // Remove data:application/pdf;base64, prefix
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }

          const file = new File([bytes], fileName, { type: "application/pdf" });

          // Set the return policy file and name
          setReturnPolicy(file);
          setReturnPolicyName(fileName);

          // Update return policy text to indicate it's Mbaay's default policy
          setReturnPolicyText(
            "Mbaay Default Return Policy - Automatically uploaded"
          );

          toast.success(
            "Mbaay Return Policy has been automatically uploaded to your profile!",
            {
              position: "top-right",
              autoClose: 4000,
            }
          );

          // Clean up localStorage after successful upload
          localStorage.removeItem("mbaay_return_policy");
        } catch (error) {
          console.error("Error processing Mbaay policy upload:", error);
          toast.error(
            "Error processing the uploaded policy. Please try again.",
            {
              position: "top-right",
              autoClose: 4000,
            }
          );
        }
      }
    };

    // Listen for the custom event
    window.addEventListener(
      "mbaayPolicyUploaded",
      handleMbaayPolicyUpload as EventListener
    );

    // Check if there's already a stored policy on component mount
    const storedPolicy = localStorage.getItem("mbaay_return_policy");
    if (storedPolicy) {
      try {
        const policyData = JSON.parse(storedPolicy);
        handleMbaayPolicyUpload(
          new CustomEvent("mbaayPolicyUploaded", {
            detail: {
              fileName: policyData.name,
              fileSize: policyData.size,
              isMbaayDefault: policyData.isMbaayDefault,
            },
          })
        );
      } catch (error) {
        console.error("Error loading stored Mbaay policy:", error);
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener(
        "mbaayPolicyUploaded",
        handleMbaayPolicyUpload as EventListener
      );
    };
  }, []);

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

      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showEditDropdown && editButtonRef.current && dropdownRef.current) {
      const buttonRect = editButtonRef.current.getBoundingClientRect();
      dropdownRef.current.style.top = `${
        buttonRect.bottom + window.scrollY + 5
      }px`;
      dropdownRef.current.style.left = `${
        buttonRect.right - dropdownRef.current.offsetWidth + window.scrollX
      }px`;
    }
  }, [showEditDropdown]);

  useEffect(() => {
    if (
      uploadAvatarMutation.isSuccess ||
      uploadBusinessLogoMutation.isSuccess
    ) {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    }
  }, [
    uploadAvatarMutation.isSuccess,
    uploadBusinessLogoMutation.isSuccess,
    queryClient,
  ]);

  useEffect(() => {
    if (createRecipientCodeMutation.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    }
  }, [createRecipientCodeMutation.isSuccess, queryClient]);

  const saveImageToLocalStorage = (imageData: string, storageKey: string) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, imageData);
      } catch (error) {
        console.error(
          `Error saving image to localStorage (${storageKey}):`,
          error
        );
        toast.error(
          "Failed to save image locally. Your browser storage might be full.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      }
    }
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner" | "logo"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size based on type
      if (type === "banner" && file.size > MAX_BANNER_SIZE) {
        toast.error(
          `Banner image is too large. Maximum size is ${formatFileSize(
            MAX_BANNER_SIZE
          )}`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        return;
      }

      if (type === "profile" && file.size > MAX_PROFILE_SIZE) {
        toast.error(
          `Profile image is too large. Maximum size is ${formatFileSize(
            MAX_PROFILE_SIZE
          )}`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        return;
      }

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
            if (user.token) {
              uploadAvatarMutation.mutate({
                data: profileFormData,
                token: user.token,
              });
            }
            break;

          case "banner":
            setBannerImage(imageData);
            saveImageToLocalStorage(imageData, BANNER_IMAGE_KEY);

            // Create FormData and upload banner image
            const bannerFormData = new FormData();
            bannerFormData.append("businessLogo", file);
            if (user.token) {
              uploadBusinessLogoMutation.mutate({
                data: bannerFormData,
                token: user.token,
              });
            }
            break;

          case "logo":
            saveImageToLocalStorage(imageData, LOGO_IMAGE_KEY);

            // Create FormData and upload logo image
            const logoFormData = new FormData();
            logoFormData.append("avatar", file);
            if (user.token) {
              uploadAvatarMutation.mutate({
                data: logoFormData,
                token: user.token,
              });
            }
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
        setAddress1("");
        setCity("");
        break;
      case "account":
        setActivePopup("account");
        setAccountNumber(profile.accountNumber || "");
        setSelectedBankCode(
          bankCodes.find((bank) => bank.name === profile.bankName)?.code || ""
        );
        setFoundAccountName(profile.accountName || "");
        setFoundBankName(profile.bankName || "");
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

      // If there are validation errors, stop submission
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error("Please fix the errors in the form", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      // Prepare form data for submission
      const formData = new FormData();

      // Add profile data
      Object.entries(profile).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add return policy if it exists
      if (returnPolicy && user.token) {
        formData.append("returnPolicy", returnPolicy);
        upload_return_policy(user.token, formData).then((res) => {
          console.log(res);
          queryClient.invalidateQueries({ queryKey: ["vendor"] });
        });
      }

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      toast.success("Profile updated successfully!");

      // Clear any existing errors
      setErrors({});

      await queryClient.invalidateQueries({ queryKey: ["vendor"] });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced account search with Paystack API
  const searchAccount = async () => {
    if (!accountNumber.trim()) {
      toast.error("Please enter an account number", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    if (accountNumber.length !== 10) {
      toast.error("Account number must be exactly 10 digits", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    if (!selectedBankCode) {
      toast.error("Please select a bank", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    const paystackKey = import.meta.env.VITE_PAYSTACK_KEY;

    setIsSearchingAccount(true);
    setHasTriedVerify(true);
    setFoundAccountName("");
    setFoundBankName("");

    try {
      const verifyResponse = await fetch(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${selectedBankCode}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paystackKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        if (
          verifyData?.status &&
          verifyData?.data &&
          verifyData?.data?.account_name
        ) {
          const selectedBank = bankCodes.find(
            (bank) => bank?.code === selectedBankCode
          );
          setFoundAccountName(verifyData?.data?.account_name);
          setFoundBankName(selectedBank?.name || "");

          // Update profile state with verified account details
          setProfile((prev) => ({
            ...prev,
            accountName: verifyData?.data?.account_name,
            accountNumber: accountNumber,
            bankName: selectedBank?.name || "",
          }));

          toast.success("Account verified successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error(
            "Account not found. Please verify the account number and bank selection.",
            {
              position: "top-right",
              autoClose: 4000,
            }
          );
        }
      } else {
        toast.error("Account verification failed. Please check your details.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error("Error verifying account:", error);
      toast.error(
        "Network error occurred. Please check your connection and try again.",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    } finally {
      setIsSearchingAccount(false);
    }
  };

  // Handle password change
  const handlePasswordChange = () => {
    (async () => {
      if (!newPassword) {
        toast.error("Please enter a new password", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      try {
        await changePasswordMutation.mutateAsync({
          token: user.token || null,
          newPassword,
          confirmPassword,
        });

        // update local state and close popup
        setActualPassword(newPassword);
        setNewPassword("");
        setConfirmPassword("");
        closePopup();
      } catch (err) {
        // error toast handled by mutation; still keep console
        console.error("Password change failed:", err);
      }
    })();
  };

  // Handle location change
  const handleLocationChange = () => {
    (async () => {
      if (!country || !state || !address1 || !city) {
        toast.error("Please fill all location fields", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      try {
        await updateLocationMutation.mutateAsync({
          token: user.token || null,
          location: {
            country,
            state,
            address1: address1,
            city,
          },
        });

        setCountry("");
        setState("");
        setAddress1("");
        setCity("");
        closePopup();
      } catch (err) {
        console.error("Location update failed:", err);
      }
    })();
  };

  // Handle email change
  const handleEmailChange = () => {
    (async () => {
      if (!newEmail) {
        toast.error("Please enter a new email address", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      if (!/\S+@\S+\.\S+/.test(newEmail)) {
        toast.error("Please enter a valid email address", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      try {
        await initiateEmailChangeMutation.mutateAsync({
          token: user.token || null,
          email: newEmail,
        });

        // Open OTP modal to complete verification
        setPendingEmail(newEmail);
        setNewEmail("");
        setShowOtpModal(true);
        closePopup();
      } catch (err) {
        console.error("Initiate email change failed:", err);
      }
    })();
  };

  const handleVerifyEmail = async () => {
    if (!otpCode || otpCode.trim().length === 0) {
      toast.error("Please enter the OTP sent to your email", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    try {
      await verifyEmailMutation.mutateAsync({
        token: user.token || null,
        email: pendingEmail,
        otp: otpCode,
      });

      // Update local profile email after successful verification
      setProfile((prev) => ({ ...prev, email: pendingEmail }));
      setPendingEmail("");
      setOtpCode("");
      setShowOtpModal(false);
    } catch (err) {
      console.error("Email verification failed:", err);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingEmail) return;
    try {
      await initiateEmailChangeMutation.mutateAsync({
        token: user.token || null,
        email: pendingEmail,
      });
      toast.success("OTP resent to your email");
    } catch (err) {
      console.error("Resend OTP failed:", err);
    }
  };

  // Handle store details change
  const handleStoreChange = () => {
    (async () => {
      if (!storeName) {
        toast.error("Please enter the store name", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      try {
        await updateStoreDetailsMutation.mutateAsync({
          token: user.token || null,
          details: { storeName, storePhone: storeNumber || undefined },
        });

        setProfile((prev) => ({
          ...prev,
          companyName: storeName,
          phone: storeNumber || prev.phone,
        }));

        setStoreName("");
        setStoreNumber("");
        closePopup();
      } catch (err) {
        console.error("Update store details failed:", err);
      }
    })();
  };

  // Enhanced account change handler with recipient code creation
  const handleAccountChange = async () => {
    if (
      !accountNumber ||
      !foundAccountName ||
      !selectedBankCode ||
      !foundBankName
    ) {
      toast.error("Please search for a valid account first", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    try {
      await createRecipientCodeMutation.mutateAsync({
        token: user.token!,
        accountData: {
          account_number: accountNumber,
          bank_code: selectedBankCode,
          name: foundAccountName,
          bankName: foundBankName,
        },
      });

      // Ensure profile state is updated with verified account details
      const selectedBank = bankCodes.find(
        (bank) => bank.code === selectedBankCode
      );
      setProfile((prev) => ({
        ...prev,
        accountName: foundAccountName,
        accountNumber: accountNumber,
        bankName: selectedBank?.name || "",
      }));

      // Persist account details to localStorage (optional, for persistence)
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "vendor_account_details",
            JSON.stringify({
              accountName: foundAccountName,
              accountNumber: accountNumber,
              bankName: selectedBank?.name || "",
            })
          );
        } catch (error) {
          console.error("Error saving account details to localStorage:", error);
        }
      }

      toast.success("Account details updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      closePopup();
    } catch (error) {
      console.error("Error saving account details:", error);
      // The error toast is already handled in the mutation
    }
  };

  // Function to clear images from local storage and state
  const clearImages = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(PROFILE_IMAGE_KEY);
        localStorage.removeItem(BANNER_IMAGE_KEY);
        localStorage.removeItem(LOGO_IMAGE_KEY);

        setProfileImage(null);
        setBannerImage(null);

        toast.success("All images have been cleared", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Error clearing images from localStorage:", error);
        toast.error("Failed to clear images", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  // Get craft categories and determine if dropdown should show
  const craftCategories = vendors?.craftCategories || [];
  const hasMultipleCategories = craftCategories.length > 1;

  // Check if account details exist to determine button text
  const hasAccountDetails =
    profile.accountName && profile.accountNumber && profile.bankName;

  // Get the current bank logo for display
  const currentBankLogo = getBankLogo(profile.bankName);

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Global editing/loading overlay */}
      {anyPending && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center gap-3 p-4 rounded-lg shadow-lg bg-white/90">
            <div className="w-8 h-8 border-4 border-gray-200 rounded-full border-t-orange-500 animate-spin" />
            <div className="text-sm font-medium">Saving changes…</div>
          </div>
        </div>
      )}
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold sm:text-2xl">Edit Vendor Profile</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
              Be Mbaay {user.vendor?.kycStatus}
              <MdVerified size={20} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Banner and Profile Section */}
          <motion.div
            variants={itemVariants}
            className="overflow-hidden bg-white rounded-lg shadow-sm"
          >
            <div className="relative h-48 bg-white border border-b-green-100">
              {bannerImage ? (
                <img
                  src={bannerImage || "/placeholder.svg"}
                  alt="Banner"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-white">
                  <img
                    src={defaultBanner}
                    alt="Default Banner"
                    className="object-contain max-h-full p-4"
                  />
                </div>
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
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full border-t-orange-500 animate-spin"></div>
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
                        <IoIosContact className="w-12 h-12 text-gray-400" />
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
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-orange-500 animate-spin"></div>
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </label>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <div className="font-semibold">
                        {user.vendor?.followers.length}
                      </div>
                      <div className="text-gray-500">Followers</div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {user.vendor?.following.length}
                      </div>
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
            className="grid gap-4 sm:gap-6 sm:grid-cols-2"
          >
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="mb-2 text-sm text-gray-500">Account Type</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg">
                  <span className="font-semibold text-orange-500">
                    {vendors?.storeType?.charAt?.(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="font-semibold">{vendors?.storeType}</div>
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
              <Link to={"/app/reviews"}>
                <button className="text-sm text-purple-600 hover:underline">
                  View Reviews
                </button>
              </Link>
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
                        className="absolute w-48 py-1 bg-white rounded-lg shadow-lg pointer-events-auto"
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
                          {hasAccountDetails
                            ? "Update Account Details"
                            : "Add Account Details"}
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
                  Store Name
                </label>
                <motion.input
                  type="text"
                  value={profile.companyName}
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
                  value={profile.email}
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
                  value={profile.phone}
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
                    className="w-full p-2 border rounded-lg cursor-not-allowed bg-gray-50"
                    readOnly
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
                  ></motion.button>
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
            <h2 className="mb-4 font-semibold">Business Category</h2>
            <div className="relative" ref={categoryDropdownRef}>
              <div
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  hasMultipleCategories
                    ? "cursor-pointer hover:bg-gray-50"
                    : "cursor-default"
                }`}
                onClick={() =>
                  hasMultipleCategories &&
                  setShowCategoryDropdown(!showCategoryDropdown)
                }
              >
                <div className="flex items-center gap-2">
                  <span>{craftCategories[0] || "No category selected"}</span>
                  {hasMultipleCategories && (
                    <span className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                      +{craftCategories.length - 1} more
                    </span>
                  )}
                </div>
                {hasMultipleCategories && (
                  <motion.div
                    animate={{ rotate: showCategoryDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                )}
              </div>

              {/* Category Dropdown */}
              <AnimatePresence>
                {showCategoryDropdown && hasMultipleCategories && (
                  <motion.div
                    className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      {craftCategories.map((category: any, index: any) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        >
                          <span>{category}</span>
                          {index === 0 && (
                            <span className="px-2 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Enhanced Payment Details Section */}
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
                  value={vendors?.bankAccount?.account_name}
                  readOnly
                  placeholder={
                    !profile.accountName ? "No account name added" : ""
                  }
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
                  value={vendors?.bankAccount?.account_number}
                  readOnly
                  placeholder={
                    !profile.accountNumber ? "No account number added" : ""
                  }
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
                  <div className="flex items-center w-full gap-2 p-2 border rounded-lg cursor-not-allowed bg-gray-50">
                    {vendors?.bankAccount?.bankName && (
                      <img
                        src={currentBankLogo}
                        alt={profile.bankName}
                        className="object-contain w-6 h-6"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/banks/default-bank.png";
                        }}
                      />
                    )}
                    <motion.input
                      type="text"
                      value={vendors?.bankAccount?.bankName}
                      readOnly
                      placeholder={!profile.bankName ? "No bank selected" : ""}
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
                {hasAccountDetails
                  ? "Update account details"
                  : "Add account details"}
              </button>
            </div>
          </motion.div>

          <div
            ref={returnPolicyRef}
            className={`transition-colors duration-500 ${
              flashReturnPolicy ? "bg-orange-50 rounded-lg p-2" : ""
            }`}
          >
            <ReturnPolicyUploader
              returnPolicy={returnPolicy}
              returnPolicyName={returnPolicyName}
              setReturnPolicy={setReturnPolicy}
              setReturnPolicyName={setReturnPolicyName}
              returnPolicyText={returnPolicyText}
              setReturnPolicyText={setReturnPolicyText}
            />
          </div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-end gap-3 sm:flex-row sm:gap-4"
          >
            <button
              className="px-4 py-2 text-sm border border-orange-500 rounded-lg sm:px-6 hover:bg-orange-50 sm:text-base"
              onClick={clearImages}
            >
              Discard Changes
            </button>

            <button
              className="px-4 py-2 text-sm text-white bg-orange-500 rounded-lg sm:px-6 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed sm:text-base"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Popups */}
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
                      <motion.button
                        onClick={closePopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
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
                          disabled={changePasswordMutation.isPending}
                        >
                          Cancel
                        </button>
                        <button
                          className={`px-4 py-2 text-white rounded-lg ${
                            changePasswordMutation.isPending
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-600"
                          }`}
                          onClick={handlePasswordChange}
                          disabled={changePasswordMutation.isPending}
                        >
                          {changePasswordMutation.isPending
                            ? "Changing..."
                            : "Change Password"}
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
                      <motion.button
                        onClick={closePopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
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
                          Address Line 1
                        </label>
                        <motion.input
                          type="text"
                          value={address1}
                          onChange={(e) => setAddress1(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          City
                        </label>
                        <motion.input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                          onClick={closePopup}
                          disabled={updateLocationMutation.isPending}
                        >
                          Cancel
                        </button>
                        <button
                          className={`px-4 py-2 text-white rounded-lg ${
                            updateLocationMutation.isPending
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-600"
                          }`}
                          onClick={handleLocationChange}
                          disabled={updateLocationMutation.isPending}
                        >
                          {updateLocationMutation.isPending
                            ? "Updating..."
                            : "Update Location"}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Enhanced Account Change Popup */}
                {activePopup === "account" && (
                  <>
                    <div
                      ref={paymentRef}
                      className={`flex items-center justify-between mb-4 transition-colors duration-500 ${
                        flashPayment ? "bg-orange-50 rounded-lg p-2" : ""
                      }`}
                    >
                      <h2 className="text-xl font-semibold">
                        {hasAccountDetails
                          ? "Update Account Details"
                          : "Add Account Details"}
                      </h2>
                      <motion.button
                        onClick={closePopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          Account Number
                        </label>
                        <motion.input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            setAccountNumber(value);
                            // Clear previous results when account number changes
                            if (value !== accountNumber) {
                              setFoundAccountName("");
                              setFoundBankName("");
                              setHasTriedVerify(false);
                            }
                          }}
                          placeholder="Enter 10-digit account number"
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                          maxLength={10}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {accountNumber.length > 0 &&
                            accountNumber.length < 10 &&
                            `${10 - accountNumber.length} more digits required`}
                        </p>
                      </div>

                      <div>
                        <label className="block mb-1 text-sm text-gray-500">
                          Select Bank
                        </label>
                        <motion.select
                          value={selectedBankCode}
                          onChange={(e) => {
                            setSelectedBankCode(e.target.value);
                            // Clear previous results when bank changes
                            setFoundAccountName("");
                            setFoundBankName("");
                            setHasTriedVerify(false);
                          }}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
                        >
                          <option value="">Choose your bank</option>
                          {bankCodes.map((bank) => (
                            <option
                              key={`${bank.code}-${bank.name}`}
                              value={bank.code}
                            >
                              {bank.name} ({bank.type})
                            </option>
                          ))}
                        </motion.select>
                      </div>

                      <div className="flex justify-center">
                        <button
                          className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                            accountNumber.length === 10 &&
                            selectedBankCode &&
                            !isSearchingAccount
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                          onClick={searchAccount}
                          disabled={
                            accountNumber.length !== 10 ||
                            !selectedBankCode ||
                            isSearchingAccount
                          }
                        >
                          {isSearchingAccount ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                              Verifying Account...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4" />
                              Verify Account
                            </>
                          )}
                        </button>
                      </div>

                      {/* Account verification results */}
                      {foundAccountName && foundBankName && (
                        <motion.div
                          className="p-4 border border-green-200 rounded-lg bg-green-50"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-green-100 rounded-full">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  delay: 0.2,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                              >
                                ✓
                              </motion.div>
                            </div>
                            <div className="flex-1">
                              <h4 className="mb-2 text-sm font-semibold text-green-800">
                                Account Verified Successfully
                              </h4>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-green-600">
                                    Account Name:
                                  </span>
                                  <span className="text-sm font-semibold text-green-800">
                                    {foundAccountName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-green-600">
                                    Bank:
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {bankLogos[foundBankName] && (
                                      <img
                                        src={
                                          bankLogos[foundBankName] ||
                                          "/placeholder.svg" ||
                                          "/placeholder.svg" ||
                                          "/placeholder.svg"
                                        }
                                        alt={foundBankName}
                                        className="object-contain w-4 h-4"
                                      />
                                    )}
                                    <span className="text-sm font-semibold text-green-800">
                                      {foundBankName}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-green-600">
                                    Account Number:
                                  </span>
                                  <span className="font-mono text-sm text-green-800">
                                    {accountNumber}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Error state for failed verification */}
                      {hasTriedVerify &&
                        accountNumber.length === 10 &&
                        !foundAccountName &&
                        !isSearchingAccount && (
                          <motion.div
                            className="p-3 border border-red-200 rounded-lg bg-red-50"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 bg-red-100 rounded-full">
                                <span className="text-xs text-red-600">✗</span>
                              </div>
                              <p className="text-sm text-red-700">
                                Account verification failed. Please check the
                                account number and try again.
                              </p>
                            </div>
                          </motion.div>
                        )}

                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                          onClick={closePopup}
                        >
                          Cancel
                        </button>
                        <button
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            foundAccountName && foundBankName
                              ? "bg-orange-500 text-white hover:bg-orange-600"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          } ${
                            createRecipientCodeMutation.isPending
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={handleAccountChange}
                          disabled={
                            !foundAccountName ||
                            !foundBankName ||
                            createRecipientCodeMutation.isPending
                          }
                        >
                          {createRecipientCodeMutation.isPending
                            ? "Creating..."
                            : hasAccountDetails
                            ? "Update Account"
                            : "Add Account"}
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
                      <motion.button
                        onClick={closePopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
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
                          disabled={initiateEmailChangeMutation.isPending}
                        >
                          Cancel
                        </button>
                        <button
                          className={`px-4 py-2 text-white rounded-lg ${
                            initiateEmailChangeMutation.isPending
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-600"
                          }`}
                          onClick={handleEmailChange}
                          disabled={initiateEmailChangeMutation.isPending}
                        >
                          {initiateEmailChangeMutation.isPending
                            ? "Sending..."
                            : "Send OTP"}
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
                      <motion.button
                        onClick={closePopup}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
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
                          Store Number (optional)
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
                          className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                          onClick={closePopup}
                          disabled={updateStoreDetailsMutation.isPending}
                        >
                          Cancel
                        </button>
                        <button
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            updateStoreDetailsMutation.isPending
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-orange-500 text-white hover:bg-orange-600"
                          }`}
                          onClick={handleStoreChange}
                          disabled={updateStoreDetailsMutation.isPending}
                        >
                          {updateStoreDetailsMutation.isPending
                            ? "Updating..."
                            : "Update Store"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* OTP Verification Modal (renders independently of other popups) */}
        {showOtpModal && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm p-6 bg-white rounded-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Verify New Email</h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setShowOtpModal(false);
                    setPendingEmail("");
                    setOtpCode("");
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="mb-3 text-sm text-gray-600">
                Enter the OTP sent to <strong>{pendingEmail}</strong>
              </p>

              <div className="mb-4">
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="text-sm text-gray-600 hover:underline"
                  onClick={handleResendOtp}
                  disabled={initiateEmailChangeMutation.isPending}
                >
                  Resend OTP
                </button>

                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                    onClick={() => setShowOtpModal(false)}
                    disabled={verifyEmailMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-white ${
                      verifyEmailMutation.isPending
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                    onClick={handleVerifyEmail}
                    disabled={verifyEmailMutation.isPending}
                  >
                    {verifyEmailMutation.isPending
                      ? "Verifying..."
                      : "Verify Email"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
