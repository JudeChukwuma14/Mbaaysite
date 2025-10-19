import { get_one_community } from "@/utils/communityApi";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const { communityid } = useParams();

  const { data: one_community } = useQuery({
    queryKey: ["one_community"],
    queryFn: () => get_one_community(communityid),
  });

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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 w-full max-w-md z-50"
          >
            <div className="p-6 bg-white rounded-lg shadow-xl overflow-x-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                <motion.button
                  onClick={onClose}
                  className="text-gray-400 transition-colors hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-3">Are you sure you want to delete</span>
                <div className="flex items-center justify-center">
                  <h1 className="font-extrabold break-words">{one_community?.name}</h1>
                  <p className="ml-2">community?</p>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4 flex-wrap">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Yes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
