import React from "react";
import { motion } from "framer-motion";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto mx-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b shadow-sm px-4 sm:px-6 py-3 sm:py-4 z-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 leading-tight">
            Mbaay Global Marketing Company Policies
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 leading-relaxed">
            By using our platform, you agree to the following terms and conditions
          </p>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
          {/* Transaction Policy */}
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-orange-500 mb-3 sm:mb-4">Transaction Policy</h3>
            <div className="space-y-3 sm:space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-sm sm:text-base">Introduction</h4>
                <p className="text-xs sm:text-sm leading-relaxed">Mbaay.com is a global e-commerce marketplace dedicated to connecting diasporas with products made in their home countries. By using our platform, you agree to these terms and conditions.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm sm:text-base">Payment Methods</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>We accept major credit cards, debit cards, and online payment platforms (Paystack, etc.)</li>
                  <li>Payment is required at the time of purchase</li>
                  <li>All transactions are processed in the currency specified on the product page</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm sm:text-base">Order Confirmation</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>Once an order is placed, a confirmation email will be sent to the customer</li>
                  <li>Vendors will receive an order notification to process the shipment</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm sm:text-base">Dispute Resolution</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>Any transaction disputes should be reported to Mbaay.com customer service within 30 days</li>
                  <li>Mbaay.com will mediate disputes between vendors and customers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Terms and Conditions */}
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-orange-500 mb-3 sm:mb-4">Terms and Conditions</h3>
            <div className="space-y-3 sm:space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-sm sm:text-base">Vendor Responsibilities</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>Provide accurate product descriptions and pricing</li>
                  <li>Ship products within the stipulated time frame</li>
                  <li>Adhere to all applicable local, national, and international laws</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm sm:text-base">Customer Responsibilities</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>Provide accurate shipping information</li>
                  <li>Responsible for any customs duties or taxes in their country</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm sm:text-base">Prohibited Items</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>Illegal items, hazardous materials, and counterfeit products are prohibited</li>
                  <li>Mbaay.com reserves the right to remove violating listings</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Shipment Policy */}
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-orange-500 mb-3 sm:mb-4">Shipment Policy</h3>
            <div className="space-y-3 sm:space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-sm sm:text-base">General Shipping</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>Vendors are responsible for shipping products</li>
                  <li>Shipping costs must be clearly stated</li>
                  <li>Tracking information must be provided to customers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm sm:text-base">Product Specific Guidelines</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li><strong>Fragile Goods:</strong> Secure packaging with cushioning, marked as "Fragile"</li>
                  <li><strong>Perishable Goods:</strong> Expedited shipping with insulated packaging</li>
                  <li><strong>Non-Fragile/Non-Perishable:</strong> Sturdy packaging for normal conditions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm sm:text-base">Delivery Times</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>Estimated delivery times must be provided</li>
                  <li>Vendors must notify customers of any delays</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Return Policy */}
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-orange-500 mb-3 sm:mb-4">Return Policy</h3>
            <div className="space-y-3 sm:space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-sm sm:text-base">General Return Guidelines</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>14-day return period from receipt date</li>
                  <li>Items must be in original condition and packaging</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm sm:text-base">Product Specific Returns</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li><strong>Fragile Goods:</strong> Inspect immediately, report damages for refund/replacement</li>
                  <li><strong>Perishable Goods:</strong> Not eligible unless damaged/spoiled (report within 24 hours)</li>
                  <li><strong>Non-Fragile/Non-Perishable:</strong> Return if defective or not as described</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm sm:text-base">Return Process & Refunds</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>Contact customer service to initiate returns</li>
                  <li>Vendors provide return labels and instructions</li>
                  <li>Refunds processed within 7-10 business days after inspection</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm sm:text-base">Dispute Resolution</h4>
                <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1 text-xs sm:text-sm leading-relaxed">
                  <li>Report return disputes to Mbaay.com customer service</li>
                  <li>Mbaay.com mediates between vendors and customers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Final Note */}
          <div className="bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-200">
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              <strong>Note:</strong> Mbaay.com reserves the right to update these policies at any time. 
              For the latest version, please visit our website.
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t shadow-sm px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-2 text-sm sm:text-base text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200 font-medium w-full sm:w-auto"
            >
              Close
            </button>
            <button
              onClick={onAccept}
              className="px-4 sm:px-6 py-2 sm:py-2 text-sm sm:text-base text-white bg-orange-500 rounded-md hover:bg-orange-600 transition duration-200 font-semibold w-full sm:w-auto"
            >
              I Accept All Policies
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PolicyModal;