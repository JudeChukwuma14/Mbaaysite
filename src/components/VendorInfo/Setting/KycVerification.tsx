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
import { vendorKycUpload } from "@/utils/vendorApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CountryOption {
  code: string;
  name: string;
}

const KYCVerification: React.FC = () => {
  const [country, setCountry] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [showRejectedScreen, setShowRejectedScreen] = useState(false);
  const [rejectionTimerDone, setRejectionTimerDone] = useState(false);
  const user = useSelector((state: RootState) => state.vendor);
  console.log("User from Redux:", user);

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
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    if (user?.vendor?.kycStatus === "Rejected" && !rejectionTimerDone) {
      setShowRejectedScreen(true);

      const timer = setTimeout(() => {
        setShowRejectedScreen(false);
        setRejectionTimerDone(true); // prevent timer from running again
      }, 30_000); // 30 seconds

      return () => clearTimeout(timer); // cleanup on unmount
    }
  }, [user?.vendor?.kycStatus, rejectionTimerDone]);

  const documentTypes = ["National ID Card", "Passport", "Driver's License"];

  const handleFileChange =
    (side: "front" | "back") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
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
    if (!frontFile || !backFile || !country || !documentType) return;

    const formData = new FormData();
    formData.append("country", country);
    formData.append("documentType", documentType);
    formData.append("front", frontFile);
    formData.append("back", backFile);

    try {
      const res = await vendorKycUpload(user.token, formData);
      console.log("Upload success:", res);
      setUploaded(true);
    } catch (error: any) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert("Upload failed, please try again.");
    }
  };

  // Pending State
  if (user?.vendor?.kycStatus === "Pending") {
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
                Verification in Progress
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
  if (user?.vendor?.kycStatus === "Approved" || uploaded) {
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

  // Rejected State
  if (user?.vendor?.kycStatus === "Rejected" && showRejectedScreen) {
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

        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Your Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
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
              Document Type
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-orange-500"
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
              Front side of your Document
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
                accept="image/*,.pdf"
                onChange={handleFileChange("front")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Back */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Back side of your Document
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
                accept="image/*,.pdf"
                onChange={handleFileChange("back")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
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
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I confirm that I uploaded valid government-issued ID. This ID
            includes my picture, signature, name, date of birth and address
          </label>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full px-4 py-3 font-bold text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            !agreed || !frontFile || !backFile || !country || !documentType
          }
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
};

export default KYCVerification;
