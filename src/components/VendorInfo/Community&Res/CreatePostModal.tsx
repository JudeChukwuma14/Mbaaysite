"use client";

import { createPost } from "@/utils/communityApi";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smile, Image, MapPin, Paperclip } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.user);

  const isApiError = (error: unknown): error is ApiError => {
    return (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as ApiError).response === "object"
    );
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Post content cannot be empty.", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setLoading(true);

    try {
      await createPost(
        { content, userType: "vendors" },
        user.token
      );

      toast.success("Post created successfully", {
        position: "top-right",
        autoClose: 4000,
      });

      // Update state instead of reloading page
      setContent("");
      onClose(); // Close modal after successful post
    } catch (error) {
      if (isApiError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to post. Please try again.",
          { position: "top-right", autoClose: 4000 }
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-20 md:inset-auto md:top-[25%] md:left-[35%] md:max-w-lg w-full md:-translate-x-[50%] md:-translate-y-[50%] bg-white rounded-xl shadow-xl"
          >
            <form className="p-4" onSubmit={handlePost}>
              <motion.button
                type="button"
                onClick={onClose}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <div className="mt-6 mb-4 flex items-center space-x-3">
                <img src="/placeholder.svg?height=48&width=48" alt="Profile" className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-semibold">Ogbonna Finbarr</h3>
                  <p className="text-sm text-gray-600">Beauty and SkinCare</p>
                </div>
              </div>

              <textarea
                placeholder="Share your Ideas..."
                onChange={(e) => setContent(e.target.value)}
                value={content}
                required
                className="w-full h-40 p-3 text-gray-700 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-4">
                  <motion.button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <Smile className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <Image className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <MapPin className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <Paperclip className="w-6 h-6" />
                  </motion.button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    loading
                      ? "bg-orange-400 text-white cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {loading ? "Loading..." : "Post Idea"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
