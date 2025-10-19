import { useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Home, Copy, Share2, Crown, Check } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface LocationState {
  plan: string; // "Shelf" | "Counter" | ...
  ref: string; // Paystack reference
  billing: string; // "Monthly" | "Quarterly" | ...
  amount: number;
}

export default function SubscriptionSuccess() {
  const { state } = useLocation() as { state: LocationState };
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  /* ---- guards ---- */
  if (!state?.plan) {
    return (
      <div className="container px-4 py-8 mx-auto text-center max-w-7xl">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-gray-600">
          Subscription information is missing.
        </p>
        <Button onClick={() => navigate("/pricing")} className="mt-4">
          Back to Pricing
        </Button>
      </div>
    );
  }

  const { plan, ref: reference, billing, amount } = state;

  /* ---- helpers ---- */
  const copyRef = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    toast.success("Reference copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    try {
      setIsDownloading(true);
      const doc = new jsPDF();

      doc.addImage(
        "https://res.cloudinary.com/dw3mr6jpx/image/upload/v1750550594/MBLogo_anmbkb.png",
        "PNG",
        20,
        10,
        40,
        40
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Mbaay", 70, 20);
      doc.setFontSize(10);
      doc.text("123 Mbaay Street, Lagos, Nigeria", 70, 26);
      doc.text("Email: support@mbaay.com", 70, 31);

      doc.setTextColor(234, 88, 12);
      doc.text("Subscription Receipt", 20, 55);

      doc.setTextColor(51, 51, 51);
      doc.text(`Plan: ${plan}`, 20, 65);
      doc.text(`Reference: ${reference}`, 20, 70);
      doc.text(`Billing: ${billing}`, 20, 75);
      doc.text(
        `Date: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        20,
        80
      );
      doc.text(`Amount: ₦${amount.toLocaleString()}`, 20, 85);

      doc.save(`subscription_${plan}_${reference}.pdf`);
      toast.success("PDF downloaded!");
    } catch (e) {
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadImage = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);
    const canvas = await html2canvas(receiptRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = `subscription_${plan}_${reference}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success("Image downloaded!");
    setIsDownloading(false);
  };

  const shareReceipt = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);
    const canvas = await html2canvas(receiptRef.current, { scale: 2 });
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `subscription_${plan}_${reference}.png`, {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Mbaay ${plan} Subscription`,
          text: `I just upgraded to ${plan} on Mbaay! Reference: ${reference} Price: ${amount}`,
          files: [file],
        });
        toast.success("Receipt shared!");
      } else {
        downloadImage(); // fallback
        toast.info("Sharing not supported – image downloaded instead.");
      }
      setIsDownloading(false);
    });
  };

  /* ---- UI ---- */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-orange-50 to-white overflow-x-hidden max-w-full">
      <div
        ref={receiptRef}
        className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl"
      >
        {/* Header */}
        <div className="p-6 text-center bg-orange-600">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full"
          >
            <Crown className="w-10 h-10 text-orange-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white"
          >
            Subscription Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-1 text-orange-100"
          >
            You are now on the {plan} plan
          </motion.p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">Payment Reference</span>
              <button
                onClick={copyRef}
                className="flex items-center text-xs text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-3 h-3 mr-1" /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="text-lg font-semibold text-gray-800 break-all">
              {reference}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="mb-1 text-sm text-gray-500">Plan</div>
              <div className="text-gray-800">{plan}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Billing</div>
              <div className="text-gray-800">{billing}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Amount</div>
              <div className="text-gray-800">{amount}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Date</div>
              <div className="text-gray-800">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-700">
              What you get:
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mr-1 text-green-500 shrink-0" /> Full
                access to {plan} features
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mr-1 text-green-500 shrink-0" />{" "}
                Priority support included
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mr-1 text-green-500 shrink-0" /> No
                setup fees
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mr-1 text-green-500 shrink-0" />{" "}
                30-day money-back guarantee
              </li>
            </ul>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-3"
          >
            <Button
              onClick={() => navigate("/app/dashboard")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={downloadPDF}
                disabled={isDownloading}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-1" /> PDF
              </Button>
              <Button
                onClick={downloadImage}
                disabled={isDownloading}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-1" /> Image
              </Button>
              <Button
                onClick={shareReceipt}
                disabled={isDownloading}
                variant="outline"
                size="sm"
              >
                <Share2 className="w-4 h-4 mr-1" /> Share
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <Link
            to="/app"
            onClick={() => {
              localStorage.removeItem("plan");
            }}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <Home className="w-4 h-4 mr-1" /> Return to Home
          </Link>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-xs text-center text-gray-500"
      >
        Need help?{" "}
        <Link
          to="/support"
          onClick={() => {
            localStorage.removeItem("plan");
          }}
          className="text-orange-600 hover:text-orange-700"
        >
          Contact Support
        </Link>
      </motion.p>
    </div>
  );
}
