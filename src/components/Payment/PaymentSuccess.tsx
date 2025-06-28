// src/components/PaymentSuccess.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Download, Home, Copy } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { OrderData } from "@/utils/orderApi";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import ImageWithFallback from "../Reuseable/ImageWithFallback";

interface LocationState {
  orderId: string;
  orderData: OrderData;
}

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location as { state: LocationState };
  const { orderId, orderData } = state || {};
  const [copied, setCopied] = useState(false);

  console.log("PaymentSuccess state:", {
    orderId,
    orderData: JSON.stringify(orderData, undefined, 2),
  });

  // Simplified validation
  if (
    !orderId ||
    !orderData ||
    !orderData.cartItems?.length ||
    !orderData.pricing?.total ||
    !orderData.first_name ||
    !orderData.email ||
    !orderData.address ||
    !orderData.paymentOption
  ) {
    console.error("Missing required order data", {
      orderId,
      orderDataExists: !!orderData,
      cartItemsLength: orderData?.cartItems?.length,
      hasTotal: !!orderData?.pricing?.total,
      hasRequiredFields: !!(
        orderData?.first_name &&
        orderData?.email &&
        orderData?.address &&
        orderData?.paymentOption
      ),
    });
    return (
      <div className="container mx-auto px-4 py-8 text-center max-w-7xl">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-gray-600">Order information is missing. Please contact support.</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Return to Home
        </Button>
      </div>
    );
  }

  const { cartItems, pricing, first_name, last_name, email, address, paymentOption } = orderData;

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceipt = () => {
    try {
      console.log("Starting PDF generation...");
      // Validate data
      if (
        !cartItems.every(
          (item) =>
            item.name &&
            (typeof item.price === "number" || typeof item.price === "string") &&
            (typeof item.quantity === "number" || typeof item.quantity === "string")
        )
      ) {
        console.log("cartItems:", JSON.stringify(cartItems, undefined, 2));
        throw new Error("Invalid cartItems data");
      }
      const requiredPricingKeys = ["subtotal", "tax", "discount", "commission", "total"] as const;
      if (
        !pricing ||
        !requiredPricingKeys.every(
          (key) => pricing[key] !== undefined && (typeof pricing[key] === "string" || typeof pricing[key] === "number")
        )
      ) {
        console.log("pricing:", JSON.stringify(pricing, undefined, 2));
        throw new Error("Invalid pricing data");
      }

      console.log("Creating jsPDF instance...");
      const doc = new jsPDF();

      // Company Details
      const companyName = "Mbaay";
      const companyAddress = "123 Mbaay Street, Lagos, Nigeria";
      const companyEmail = "support@mbaay.com";
      const companyPhone = "+234 123 456 7890";
      const logoUrl = "https://res.cloudinary.com/dw3mr6jpx/image/upload/v1750550594/MBLogo_anmbkb.png"

      console.log("Adding logo...");
      try {
        doc.addImage(logoUrl, "PNG", 20, 10, 40, 40);
      } catch (error) {
        console.warn("Failed to load logo:", error);
      }

      console.log("Adding header text...");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(51, 51, 51);
      doc.text(companyName, 70, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(companyAddress, 70, 25);
      doc.text(`Email: ${companyEmail}`, 70, 30);
      doc.text(`Phone: ${companyPhone}`, 70, 35);

      console.log("Adding receipt title...");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(234, 88, 12);
      doc.text("Order Receipt", 20, 55);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 51, 51);
      doc.text(`Order ID: ${orderId}`, 20, 65);
      doc.text(
        `Date: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        20,
        70
      );
      doc.text(`Customer: ${first_name} ${last_name || ""}`, 20, 75);
      doc.text(`Email: ${email}`, 20, 80);
      doc.text(`Address: ${address}`, 20, 85);
      doc.text(
        `Payment Method: ${paymentOption === "Pay Before Delivery" ? "Credit Card" : "Cash on Delivery"}`,
        20,
        90
      );

      console.log("Preparing items table...");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(51, 51, 51);
      doc.text("Items Purchased", 20, 100);

      console.log("Generating table data...");
      const tableData = cartItems.map((item, index) => [
        (index + 1).toString(),
        item.name,
        item.quantity.toString(),
        `₦${Number(item.price).toFixed(2)}`,
        `₦${(Number(item.price) * Number(item.quantity)).toFixed(2)}`,
      ]);

      let currentY = 105;

      console.log("Rendering table...");
      if (!(doc as any).autoTable) {
        console.error("autoTable is not available on jsPDF instance");
        throw new Error("jsPDF autoTable plugin not loaded");
      }
      (doc as any).autoTable({
        startY: currentY,
        head: [["#", "Item", "Qty", "Unit Price", "Total"]],
        body: tableData,
        styles: {
          font: "helvetica",
          fontSize: 10,
          textColor: [51, 51, 51],
          lineColor: [209, 213, 219],
          lineWidth: 0.1,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [234, 88, 12],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
        },
      });

      // Images disabled to isolate PDF issue; uncomment after confirming download works
      /*
      console.log("Adding item images...");
      currentY = 105 + 10; // Adjust for row height
      cartItems.forEach((item, index) => {
        if (item.image && item.image.trim()) {
          try {
            console.log(`Adding image for ${item.name}: ${item.image}`);
            doc.addImage(item.image, "JPEG", 20, currentY + index * 10, 12, 12);
          } catch (error) {
            console.warn(`Failed to load JPEG image for ${item.name}:`, error);
            try {
              doc.addImage(item.image, "PNG", 20, currentY + index * 10, 12, 12);
            } catch (pngError) {
              console.warn(`Failed to load PNG image for ${item.name}:`, pngError);
              doc.setFillColor(200, 200, 200);
              doc.rect(20, currentY + index * 10, 12, 12, "F");
            }
          }
        } else {
          console.log(`No valid image for ${item.name}`);
          doc.setFillColor(200, 200, 200);
          doc.rect(20, currentY + index * 10, 12, 12, "F");
        }
      });
      */

      console.log("Adding payment summary...");
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(51, 51, 51);
      doc.text("Payment Summary", 20, finalY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Subtotal: ₦${Number(pricing.subtotal).toFixed(2)}`, 140, finalY + 10, { align: "right" });
      doc.text(`Tax: ₦${Number(pricing.tax).toFixed(2)}`, 140, finalY + 15, { align: "right" });
      if (pricing.discount && Number(pricing.discount) !== 0) {
        doc.text(`Discount: -₦${Number(pricing.discount).toFixed(2)}`, 140, finalY + 20, { align: "right" });
      }
      doc.text(`Commission: ₦${Number(pricing.commission).toFixed(2)}`, 140, finalY + 25, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setTextColor(234, 88, 12);
      doc.text(`Total: ₦${Number(pricing.total).toFixed(2)}`, 140, finalY + 30, { align: "right" });

      doc.setDrawColor(234, 88, 12);
      doc.line(20, finalY + 28, 190, finalY + 28);

      console.log("Adding footer...");
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      const footerY = doc.internal.pageSize.height - 20;
      doc.text("Thank you for shopping with Mbaay!", 105, footerY, { align: "center" });
      doc.text("For support, contact us at support@mbaay.com", 105, footerY + 5, { align: "center" });

      console.log("Generating Blob for download...");
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      const safeOrderId = orderId.replace(/[^a-zA-Z0-9-_]/g, "_");
      a.download = `order_${safeOrderId}_receipt.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("PDF download triggered.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate receipt. Please try again or contact support.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-orange-50 to-white">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
        <div className="p-6 text-center bg-orange-600">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full"
          >
            <CheckCircle className="w-10 h-10 text-orange-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white"
          >
            Payment Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-1 text-orange-100"
          >
            Your order has been processed successfully
          </motion.p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">Order Number</span>
              <button
                onClick={copyOrderNumber}
                className="flex items-center text-xs text-gray-500 transition-colors hover:text-gray-700"
                aria-label={copied ? "Order number copied" : "Copy order number"}
              >
                <Copy className="w-3 h-3 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="text-lg font-semibold text-gray-800">{orderId}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="mb-1 text-sm text-gray-500">Amount Paid</div>
              <div className="text-lg font-semibold text-gray-800">₦{Number(pricing.total).toFixed(2)}</div>
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
            <div>
              <div className="mb-1 text-sm text-gray-500">Email</div>
              <div className="text-gray-800 truncate">{email}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Payment Method</div>
              <div className="text-gray-800">
                {paymentOption === "Pay Before Delivery" ? "Credit Card" : "Cash on Delivery"}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-700">Purchased Items</h3>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.productId} className="flex items-center gap-4">
                  {item.image && item.image.trim() ? (
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      fallbackSrc="https://via.placeholder.com/48"
                      className="object-cover w-12 h-12 rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      ₦{Number(item.price).toFixed(2)} x {item.quantity} = ₦{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

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
                  <span className="font-medium text-orange-600">-₦{Number(pricing.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Commission</span>
                <span className="font-medium text-gray-800">₦{Number(pricing.commission).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-800">Total Paid</span>
                <span className="font-semibold text-orange-600">₦{Number(pricing.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-4 border-t border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-between"
            >
              <span className="text-gray-600">
                A confirmation email has been sent to <span className="font-medium">{email}</span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to={`/order-details/${orderId}`}
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
              >
                View Order Details
              </Link>
              <Button
                onClick={() => {
                  console.log("Download Receipt button clicked");
                  downloadReceipt();
                }}
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <Home className="w-4 h-4 mr-1" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="max-w-md mt-6 text-sm text-center text-gray-500"
      >
        <p>
          Need help with your order?{" "}
          <Link to="/support" className="text-orange-600 transition-colors hover:text-orange-700">
            Contact Support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}