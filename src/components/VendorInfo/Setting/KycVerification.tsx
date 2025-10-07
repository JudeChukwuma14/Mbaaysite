import type React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  CheckCircle,
  RefreshCw,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { get_single_vendor, vendorKycUpload } from "@/utils/vendorApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { updateKycVendor } from "@/redux/slices/vendorSlice";
import { useQuery } from "@tanstack/react-query";

interface CountryOption {
  code: string;
  name: string;
}

// interface VendorData {
//   kycStatus?: "Pending" | "Processing" | "Approved" | "Rejected";
//   // Add other vendor properties as needed
// }

const KYCVerification: React.FC = () => {
  const [country, setCountry] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showRejectedScreen, setShowRejectedScreen] = useState(false);
  const [rejectionTimerDone, setRejectionTimerDone] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.vendor);
  console.log("User from Redux:", user);

  // Properly typed useQuery hook
  const { data: vendorData, isLoading: vendorLoading } = useQuery({
    queryKey: ["vendor", user?.token],
    queryFn: () => get_single_vendor(user?.token || ""),
    enabled: !!user?.token,
  });
  console.log(vendorData);

  const vendor = vendorData;
  const kycStatus = vendor?.kycStatus || "Pending";

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await axios.get(
          "https://api.first.org/data/v1/countries"
        );
        const data = response.data.data;
        const options = Object.keys(data).map((code) => ({
          code,
          name: data[code].country,
        }));
        options.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(options);
      } catch (err) {
        console.error("Error fetching countries:", err);
        toast.error("Failed to load countries list");
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    if (kycStatus === "Rejected" && !rejectionTimerDone) {
      setShowRejectedScreen(true);

      const timer = setTimeout(() => {
        setShowRejectedScreen(false);
        setRejectionTimerDone(true);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [kycStatus, rejectionTimerDone]);

  // Reset form when moving from rejected state
  useEffect(() => {
    if (showRejectedScreen === false && rejectionTimerDone === true) {
      resetForm();
    }
  }, [showRejectedScreen, rejectionTimerDone]);

  const documentTypes = ["National ID Card", "Passport", "Driver's License"];

  const resetForm = () => {
    setCountry("");
    setDocumentType("");
    setFrontFile(null);
    setBackFile(null);
    setFrontPreview(null);
    setBackPreview(null);
    setAgreed(false);
    setRejectionTimerDone(false);
  };

  const handleFileChange =
    (side: "front" | "back") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;

      if (file) {
        // Validate file type
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "application/pdf",
        ];
        if (!validTypes.includes(file.type)) {
          toast.error("Please upload only JPEG, PNG, or PDF files");
          return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          toast.error("File size must be less than 5MB");
          return;
        }
      }

      if (side === "front") {
        setFrontFile(file);
        setFrontPreview(file ? URL.createObjectURL(file) : null);
      } else {
        setBackFile(file);
        setBackPreview(file ? URL.createObjectURL(file) : null);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!frontFile || !backFile || !country || !documentType || !agreed) {
      toast.error("Please fill all required fields and agree to terms");
      return;
    }

    const formData = new FormData();
    formData.append("country", country);
    formData.append("documentType", documentType);
    formData.append("front", frontFile);
    formData.append("back", backFile);

    try {
      setUploading(true);
      const res = await vendorKycUpload(user.token, formData);
      console.log("Upload success:", res);

      dispatch(updateKycVendor("Processing"));
      toast.success("Documents uploaded successfully! Under review.");

      // Reset form after successful upload
      resetForm();
    } catch (error: any) {
      console.error("Upload failed:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Upload failed, please try again.";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Loading state
  if (vendorLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-orange-500" />
          <p className="text-gray-600">Loading verification status...</p>
        </motion.div>
      </div>
    );
  }

  // Processing State
  if (kycStatus === "Processing") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="text-center border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-16 h-16 mx-auto mb-6"
              >
                <Clock className="w-16 h-16 text-amber-500" />
              </motion.div>

              <h2 className="mb-3 text-2xl font-bold text-foreground">
                Verification Processing
              </h2>
              <p className="mb-6 text-muted-foreground">
                We're reviewing your documents. This usually takes 1-2 business
                days.
              </p>

              <div className="space-y-3">
                <Progress value={65} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Documents received and under review
                </p>
              </div>

              <div className="p-4 mt-6 border rounded-lg bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    We'll notify you via email once verification is complete
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Approved State
  if (kycStatus === "Approved") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="text-center border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="mb-3 text-2xl font-bold text-foreground">
                  Verification Complete!
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Your identity has been successfully verified.
                </p>
              </motion.div>

              <div className="p-4 mt-6 border border-green-200 rounded-lg bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Account verified and ready to use
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Rejected State with timer screen
  if (kycStatus === "Rejected" && showRejectedScreen) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="text-center border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <XCircle className="w-20 h-20 mx-auto mb-6 text-red-500" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="mb-3 text-2xl font-bold text-foreground">
                  Verification Rejected
                </h2>
                <p className="mb-6 text-muted-foreground">
                  We couldn't verify your documents. Please check the
                  requirements and try again.
                </p>
              </motion.div>

              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                  <div className="text-sm text-red-700 dark:text-red-400">
                    <p className="mb-2 font-medium">Common issues:</p>
                    <ul className="space-y-1 text-xs text-left">
                      <li>• Document image is blurry or unclear</li>
                      <li>• Information doesn't match your profile</li>
                      <li>• Document has expired or is invalid</li>
                      <li>• File format not supported</li>
                      <li>• Required information not visible</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setShowRejectedScreen(false);
                    setRejectionTimerDone(true);
                  }}
                  className="w-full"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Rejected State - normal form (after timer or if timer was done)
  if (kycStatus === "Rejected") {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg"
        >
          <ToastContainer />
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <XCircle className="w-6 h-6 text-red-500" />
              <h1 className="text-2xl font-bold text-red-600">
                Verification Required
              </h1>
            </div>
            <p className="text-gray-600">
              Your previous verification was rejected. Please upload new
              documents to complete verification.
            </p>
          </div>

          <KYCForm
            country={country}
            setCountry={setCountry}
            documentType={documentType}
            setDocumentType={setDocumentType}
            frontPreview={frontPreview}
            backPreview={backPreview}
            agreed={agreed}
            setAgreed={setAgreed}
            countries={countries}
            documentTypes={documentTypes}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            uploading={uploading}
            frontFile={frontFile}
            backFile={backFile}
          />
        </motion.div>
      </div>
    );
  }

  // Default/Pending State - Initial KYC Form
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg"
      >
        <ToastContainer />
        <h1 className="mb-2 text-2xl font-bold text-center">
          Upload a proof of your identity
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Mbaay requires a valid government-issued ID (driver's license,
          passport, national ID)
        </p>

        <KYCForm
          country={country}
          setCountry={setCountry}
          documentType={documentType}
          setDocumentType={setDocumentType}
          frontPreview={frontPreview}
          backPreview={backPreview}
          agreed={agreed}
          setAgreed={setAgreed}
          countries={countries}
          documentTypes={documentTypes}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          uploading={uploading}
          frontFile={frontFile}
          backFile={backFile}
        />
      </motion.div>
    </div>
  );
};

// Extracted KYC Form component for reusability
interface KYCFormProps {
  country: string;
  setCountry: (value: string) => void;
  documentType: string;
  setDocumentType: (value: string) => void;
  frontPreview: string | null;
  backPreview: string | null;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  countries: CountryOption[];
  documentTypes: string[];
  handleFileChange: (
    side: "front" | "back"
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  uploading: boolean;
  frontFile: File | null;
  backFile: File | null;
}

const KYCForm: React.FC<KYCFormProps> = ({
  country,
  setCountry,
  documentType,
  setDocumentType,
  frontPreview,
  backPreview,
  agreed,
  setAgreed,
  countries,
  documentTypes,
  handleFileChange,
  handleSubmit,
  uploading,
  frontFile,
  backFile,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Your Country *
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
            required
          >
            <option value="">Select Your Country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Document Type */}
        <div>
          <label
            htmlFor="documentType"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Document Type *
          </label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
            required
          >
            <option value="">Select a document type</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Image boxes */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        {/* Front */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Front side of your Document *
          </label>
          <div className="relative p-2 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-500 aspect-[4/3] flex items-center justify-center">
            <AnimatePresence>
              {!frontPreview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-xs text-gray-500">Choose file</p>
                  <p className="text-xs text-gray-400">
                    JPEG, PNG, PDF (max 5MB)
                  </p>
                </motion.div>
              ) : (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={frontPreview}
                  alt="front preview"
                  className="object-contain w-full h-full rounded"
                />
              )}
            </AnimatePresence>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleFileChange("front")}
              className="absolute inset-0 opacity-0 cursor-pointer"
              required
            />
          </div>
          {frontFile && (
            <p className="mt-1 text-xs text-gray-500">
              Selected: {frontFile.name}
            </p>
          )}
        </div>

        {/* Back */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Back side of your Document *
          </label>
          <div className="relative p-2 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-500 aspect-[4/3] flex items-center justify-center">
            <AnimatePresence>
              {!backPreview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-xs text-gray-500">Choose file</p>
                  <p className="text-xs text-gray-400">
                    JPEG, PNG, PDF (max 5MB)
                  </p>
                </motion.div>
              ) : (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={backPreview}
                  alt="back preview"
                  className="object-contain w-full h-full rounded"
                />
              )}
            </AnimatePresence>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleFileChange("back")}
              className="absolute inset-0 opacity-0 cursor-pointer"
              required
            />
          </div>
          {backFile && (
            <p className="mt-1 text-xs text-gray-500">
              Selected: {backFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start mb-6 space-x-2">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
          required
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I confirm that I uploaded valid government-issued ID. This ID includes
          my picture, signature, name, date of birth and address *
        </label>
      </div>

      <button
        type="submit"
        className={`w-full px-4 py-3 font-bold text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed ${
          uploading ? "opacity-50" : ""
        }`}
        disabled={
          !agreed ||
          !frontFile ||
          !backFile ||
          !country ||
          !documentType ||
          uploading
        }
      >
        {uploading ? (
          <span className="flex items-center justify-center">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </span>
        ) : (
          "Continue"
        )}
      </button>
    </form>
  );
};

export default KYCVerification;
