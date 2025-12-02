



// src/components/PaymentSuccess.tsx
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Download, Home, Copy, Share2, ExternalLink } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { OrderData } from "@/utils/orderApi";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import ImageWithFallback from "../Reuseable/ImageWithFallback";
import { toast } from "react-toastify";

interface LocationState {
  orderId: string;
  orderData: OrderData;
  reference?: string;
}

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location as { state: LocationState };
  const { orderId, orderData, reference } = state || {};

  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [processedOrderData, setProcessedOrderData] = useState<OrderData | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Process and validate order data on mount
  useEffect(() => {
    if (!orderId || !orderData) {
      toast.error("Invalid order data. Redirecting...");
      navigate("/");
      return;
    }

    // Ensure cartItems exists and is an array
    const safeOrderData = { ...orderData };

    if (!safeOrderData.cartItems || !Array.isArray(safeOrderData.cartItems) || safeOrderData.cartItems.length === 0) {
      // Create placeholder cart items if none exist
      safeOrderData.cartItems = [{
        productId: orderId,
        name: "Order Items",
        price: Number(safeOrderData.pricing?.total || 0),
        quantity: 1,
        image: "",
      }];
    }

    // Ensure pricing exists
    if (!safeOrderData.pricing) {
      safeOrderData.pricing = {
        subtotal: "0.00",
        shipping: "0.00",
        tax: "0.00",
        discount: "0.00",
        total: "0.00",
      };
    }

    // Ensure required fields have default values
    safeOrderData.first_name = safeOrderData.first_name || "Customer";
    safeOrderData.email = safeOrderData.email || "No email provided";
    safeOrderData.address = safeOrderData.address || "Address not provided";
    safeOrderData.paymentOption = safeOrderData.paymentOption || "Pay Before Delivery";

    setProcessedOrderData(safeOrderData);
  }, [orderId, orderData, navigate]);

  // Show loading while processing
  if (!processedOrderData) {
    return (
      <div className="container px-4 py-8 mx-auto text-center max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-t-orange-600 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const { cartItems = [], pricing, first_name, last_name, email, address, paymentOption } = processedOrderData;

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceiptAsPDF = () => {
    try {
      setIsDownloading(true);
      const doc = new jsPDF();

      // Company Details
      const companyName = "Mbaay";
      const companyAddress = "123 Mbaay Street, Lagos, Nigeria";
      const companyEmail = "support@mbaay.com";
      const companyPhone = "+234 123 456 7890";
      const logoUrl = "https://res.cloudinary.com/dw3mr6jpx/image/upload/v1750550594/MBLogo_anmbkb.png";

      // Add logo
      try {
        doc.addImage(logoUrl, "PNG", 20, 10, 40, 40);
      } catch (error) {
        console.warn("Failed to load logo, continuing without it");
      }

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(companyName, 70, 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(companyAddress, 70, 25);
      doc.text(`Email: ${companyEmail}`, 70, 30);
      doc.text(`Phone: ${companyPhone}`, 70, 35);

      // Receipt Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(234, 88, 12);
      doc.text("ORDER RECEIPT", 20, 60);

      // Order Details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 51, 51);

      const details = [
        `Order ID: ${orderId}`,
        `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
        `Time: ${new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}`,
        `Customer: ${first_name} ${last_name || ""}`,
        `Email: ${email}`,
        `Phone: ${processedOrderData.phone || "Not provided"}`,
        `Address: ${address}`,
        `Payment Method: ${paymentOption === "Pay Before Delivery" ? "Credit/Debit Card" : "Cash on Delivery"}`,
        reference ? `Transaction Ref: ${reference}` : "",
      ].filter(Boolean);

      details.forEach((detail, index) => {
        doc.text(detail, 20, 70 + (index * 5));
      });

      // Items Table
      const startY = 70 + (details.length * 5) + 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("ITEMS PURCHASED", 20, startY);

      // Use the cartItems array which is guaranteed to exist now
      // In downloadReceiptAsPDF function, update the tableData creation:

      // Items Table - include ALL cart items
      const tableData = cartItems.map((item, index) => [
        (index + 1).toString(),
        item.name.substring(0, 40), // Slightly longer for product names
        item.quantity.toString(),
        `₦${Number(item.price).toFixed(2)}`,
        `₦${(Number(item.price) * Number(item.quantity)).toFixed(2)}`,
      ]);

      (doc as any).autoTable({
        startY: startY + 5,
        head: [["#", "Item", "Qty", "Unit Price", "Total"]],
        body: tableData,
        styles: {
          font: "helvetica",
          fontSize: 9,
          textColor: [51, 51, 51],
          cellPadding: 3
        },
        headStyles: {
          fillColor: [234, 88, 12],
          textColor: [255, 255, 255],
          fontSize: 10
        },
        margin: { left: 20, right: 20 },
      });

      // Payment Summary
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("PAYMENT SUMMARY", 20, finalY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      let summaryY = finalY + 10;
      const summaries = [
        `Subtotal: ₦${Number(pricing.subtotal).toFixed(2)}`,
        `Tax: ₦${Number(pricing.tax).toFixed(2)}`,
      ];

      if (pricing.discount && Number(pricing.discount) !== 0) {
        summaries.push(`Discount: -₦${Number(pricing.discount).toFixed(2)}`);
      }

      summaries.push(`Shipping: ₦${Number(pricing.shipping).toFixed(2)}`);

      summaries.forEach((summary, index) => {
        doc.text(summary, 140, summaryY + (index * 5), { align: "right" });
      });

      // Total
      const totalY = summaryY + (summaries.length * 5) + 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(234, 88, 12);
      doc.text(`TOTAL: ₦${Number(pricing.total).toFixed(2)}`, 140, totalY, { align: "right" });

      // Footer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.text("Thank you for shopping with Mbaay!", 105, doc.internal.pageSize.height - 20, { align: "center" });
      doc.text("For inquiries, contact: support@mbaay.com", 105, doc.internal.pageSize.height - 15, { align: "center" });

      // Trigger download
      const safeOrderId = orderId.replace(/[^a-zA-Z0-9-_]/g, "_");
      doc.save(`mbaay_order_${safeOrderId}_receipt.pdf`);
      toast.success("PDF receipt downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadReceiptAsImage = async () => {
    if (!receiptRef.current) {
      toast.error("Receipt element not found");
      return;
    }

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      const safeOrderId = orderId.replace(/[^a-zA-Z0-9-_]/g, "_");
      link.href = imgData;
      link.download = `mbaay_order_${safeOrderId}_receipt.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image receipt downloaded successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const shareReceipt = async () => {
    if (!receiptRef.current) {
      toast.error("Receipt element not found");
      return;
    }

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");

      // Convert base64 to Blob
      const byteString = atob(imgData.split(",")[1]);
      const mimeString = imgData.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeString });

      // Use Web Share API if available
      if (navigator.share) {
        const file = new File([blob], `mbaay_order_${orderId}_receipt.png`, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Mbaay Order Receipt - ${orderId}`,
            text: `Thank you for your order with Mbaay!\nOrder ID: ${orderId}\nTotal: ₦${Number(pricing.total).toFixed(2)}`,
            files: [file],
          });
          toast.success("Receipt shared successfully!");
          return;
        }
      }

      // Fallback: Download image
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `mbaay_order_${orderId}_receipt.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.info("Sharing not supported. Image downloaded instead.");

    } catch (error: any) {
      console.error("Error sharing receipt:", error);
      if (error.name !== 'AbortError') {
        toast.error("Failed to share receipt. Please try downloading instead.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const viewOrderDetails = () => {
    navigate(`dashboard/orderlist`, {
      state: { orderId, orderData: processedOrderData }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-orange-50 to-white">
      <div ref={receiptRef} className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
        {/* Header */}
        <div className="p-6 text-center bg-gradient-to-r from-orange-600 to-orange-500">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white rounded-full"
          >
            <CheckCircle className="w-12 h-12 text-orange-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white"
          >
            Payment Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-orange-100"
          >
            Your order has been confirmed and is being processed
          </motion.p>
        </div>

        {/* Order Details */}
        <div className="p-6">
          {/* Order Number */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-500">Order Number</span>
              <button
                onClick={copyOrderNumber}
                className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={copied ? "Order number copied" : "Copy order number"}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="px-4 py-2 font-mono text-lg font-semibold text-gray-800 bg-gray-50 rounded-lg">
              {orderId}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="mb-1 text-xs font-medium text-gray-500">Amount Paid</div>
              <div className="text-xl font-bold text-gray-800">₦{Number(pricing.total).toFixed(2)}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="mb-1 text-xs font-medium text-gray-500">Date & Time</div>
              <div className="text-sm text-gray-800">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
                <br />
                {new Date().toLocaleTimeString("en-US", {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="mb-1 text-xs font-medium text-gray-500">Customer Email</div>
              <div className="text-sm text-gray-800 truncate" title={email}>{email}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="mb-1 text-xs font-medium text-gray-500">Payment Method</div>
              <div className="text-sm text-gray-800">
                {paymentOption === "Pay Before Delivery" ? "Credit/Debit Card" : "Cash on Delivery"}
              </div>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-700">
              Purchased Items ({cartItems.length})
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {cartItems.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    fallbackSrc="https://via.placeholder.com/48"
                    className="flex-shrink-0 object-cover w-12 h-12 rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      ₦{Number(item.price).toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                    ₦{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-700">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">₦{Number(pricing.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-800">₦{Number(pricing.tax).toFixed(2)}</span>
              </div>
              {pricing.discount && Number(pricing.discount) !== 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">-₦{Number(pricing.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-800">₦{Number(pricing.shipping).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-800">Total Paid</span>
                <span className="text-lg font-bold text-orange-600">₦{Number(pricing.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 space-y-4 border-t border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-3 text-sm text-center text-gray-600 bg-blue-50 rounded-lg"
            >
              A confirmation email has been sent to{" "}
              <span className="font-semibold text-blue-700">{email}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 gap-3"
            >
              <Button
                onClick={viewOrderDetails}
                className="flex items-center justify-center col-span-2 px-4 py-3 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Order Details
              </Button>

              <Button
                onClick={downloadReceiptAsPDF}
                disabled={isDownloading}
                className="flex items-center justify-center px-4 py-3 font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>

              <Button
                onClick={downloadReceiptAsImage}
                disabled={isDownloading}
                className="flex items-center justify-center px-4 py-3 font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Image
              </Button>

              <Button
                onClick={shareReceipt}
                disabled={isDownloading}
                className="flex items-center justify-center px-4 py-3 font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <Link
            to="/"
            className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Homepage
          </Link>
        </div>
      </div>

      {/* Support Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="max-w-md mt-6 text-center"
      >
        <p className="text-sm text-gray-500">
          Need help with your order?{" "}
          <Link
            to="/support"
            className="font-medium text-orange-600 hover:text-orange-700 hover:underline"
          >
            Contact our support team
          </Link>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Order ID: {orderId} • {new Date().toLocaleDateString()}
        </p>
      </motion.div>
    </div>
  );
}