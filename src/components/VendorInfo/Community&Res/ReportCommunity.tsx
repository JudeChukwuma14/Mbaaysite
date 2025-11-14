// ReportModel.tsx

// useRef
// ImageIcon

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
// import { report_community } from "@/utils/communityApi";
// import { useSelector } from "react-redux";

interface ReportModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (reason: string, details: string, image: File | null) => void;
}

export default function ReportModel({
  isOpen,
  onClose,
  onSend,
}: ReportModelProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState<File | null>(null);
  //   const [imagePreview, setImagePreview] = useState<string | null>(null);
  //   const fileInputRef = useRef<HTMLInputElement>(null);
  // const user = useSelector((state: any) => state.vendor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("details", details);
    if (image) formData.append("report_image", image);

    try {
      //   await report_community(user?.token, formData);
      onSend(reason, details, image);
      resetForm();
      onClose();
    } catch {
      alert("Failed to send report. Please try again.");
    }
  };

  const resetForm = () => {
    setReason("");
    setDetails("");
    setImage(null);
    // setImagePreview(null);
  };

  //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       setImage(file);
  //       const reader = new FileReader();
  //       reader.onload = () => setImagePreview(reader.result as string);
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 z-50 w-full max-w-md"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-xl overflow-x-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Report Community</h2>
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 transition-colors hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <div>
                  <label className="block mb-1 font-bold">Reason</label>
                  <input
                    type="text"
                    placeholder="e.g. Spam, Harassment..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold">Details</label>
                  <textarea
                    placeholder="Provide additional details..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border rounded-lg resize-none bg-gray-50 focus:outline-none"
                    required
                  />
                </div>

                {/* Evidence upload */}
                {/* <div>
                  <label className="block mb-1 font-bold">
                    Evidence (optional)
                  </label>
                  <div
                    onClick={triggerFileInput}
                    className="flex flex-col items-center justify-center p-6 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-orange-500"
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Evidence"
                          className="object-cover w-32 h-32 mb-2 rounded-lg"
                        />
                        <p className="text-sm text-gray-500">Click to change</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-12 h-12 mb-2 text-gray-400" />
                        <p className="text-sm font-medium">Click to upload</p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10 MB
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div> */}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t flex-wrap">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B00] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B00] rounded-lg"
                >
                  Send Report
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
