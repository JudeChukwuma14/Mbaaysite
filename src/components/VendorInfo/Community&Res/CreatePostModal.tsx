"use client";

import type React from "react";
import { createPost } from "@/utils/communityApi";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smile, ImageIcon, User, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get_single_vendor, getAllVendor } from "@/utils/vendorApi";
import { get_communities } from "@/utils/communityApi";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TaggedUser {
  _id: string;
  storeName?: string;
  name?: string;
  tagType: "vendors" | "community";
}

interface Suggestion {
  _id: string;
  displayName: string;
  avatar?: string;
  tagType: "vendors" | "community";
  storeName?: string;
  name?: string;
}

export default function CreatePostModal({
  isOpen,
  onClose,
}: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [location, setLocation] = useState("");
  const [communityId, setCommunityId] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);

  interface RootState {
    vendor: {
      token: string;
      vendor: any;
    };
  }

  const user = useSelector((state: RootState) => state.vendor);
  const queryClient = useQueryClient();

  const posts = useQuery({
    queryKey: ["posts"],
    queryFn: () => get_single_vendor(user.token),
  });

  // Fetch all vendors for tagging
  const { data: allVendorsResponse } = useQuery({
    queryKey: ["all_vendors"],
    queryFn: () => getAllVendor(),
    enabled: !!user?.token && showTagInput,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch all communities for tagging
  const { data: allCommunitiesResponse } = useQuery({
    queryKey: ["all_communities_for_tagging"],
    queryFn: () => get_communities(user?.token),
    enabled: !!user?.token && showTagInput,
    staleTime: 5 * 60 * 1000,
  });

  // Process vendors data
  const allVendors =
    allVendorsResponse?.vendors
      ?.filter((vendor: any) => vendor?._id || vendor?.id)
      ?.map((vendor: any) => ({
        _id: vendor._id || vendor.id,
        displayName: vendor.storeName || vendor.name || "Vendor",
        avatar: vendor.avatar || "/placeholder.svg",
        tagType: "vendors" as const,
        storeName: vendor.storeName || vendor.name,
        name: vendor.name,
      })) || [];

  // Process communities data
  const allCommunities =
    allCommunitiesResponse
      ?.filter((community: any) => community?._id || community?.id)
      ?.map((community: any) => ({
        _id: community._id || community.id,
        displayName: community.name || community.title || "Community",
        avatar: community.community_Images || "/placeholder.svg",
        tagType: "community" as const,
        name: community.name || community.title,
      })) || [];

  // Combine vendors and communities for suggestions
  const userSuggestions: Suggestion[] = [...allVendors, ...allCommunities];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (imageScrollRef.current && imagesPreviews.length > 0) {
      imageScrollRef.current.scrollLeft = imageScrollRef.current.scrollWidth;
    }
  }, [imagesPreviews]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages((prev) => [...prev, ...newImages]);

      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setImagesPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagesPreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagUser = (user: Suggestion) => {
    const newTaggedUser: TaggedUser = {
      _id: user._id,
      ...(user.tagType === "vendors"
        ? { storeName: user.storeName || user.displayName }
        : { name: user.name || user.displayName }),
      tagType: user.tagType,
    };

    if (!taggedUsers.some((tagged) => tagged._id === user._id)) {
      setTaggedUsers([...taggedUsers, newTaggedUser]);
    }

    setTagInput("");
    setShowSuggestions(false);
  };

  const removeTag = (userId: string) => {
    setTaggedUsers(taggedUsers.filter((user) => user._id !== userId));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
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
      const formData = new FormData();
      formData.append("content", content);
      formData.append("userType", "vendors");
      formData.append("posterId", user.vendor._id);

      // Add images
      images.forEach((image) => {
        formData.append("posts_Images", image);
      });

      // Prepare tags in the required format
      const tags = taggedUsers.map((user) => ({
        tagId: user._id,
        tagType: user.tagType,
      }));

      if (tags.length > 0) {
        formData.append("tags", JSON.stringify(tags));
      }

      if (location) {
        formData.append("location", location);
      }

      if (communityId) {
        formData.append("communityId", communityId);
      }

      const token = user?.token || null;
      await createPost(formData, token);

      toast.success("Post created successfully", {
        position: "top-right",
        autoClose: 4000,
      });

      // Refresh queries
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["comm_posts"] }),
        queryClient.refetchQueries({ queryKey: ["communities"] }),
        queryClient.refetchQueries({ queryKey: ["vendors"] }),
        queryClient.refetchQueries({ queryKey: ["vendor"] }),
        queryClient.refetchQueries({ queryKey: ["posts"] }),
        queryClient.refetchQueries({ queryKey: ["all_comm"] }),
      ]);

      // Reset form
      setContent("");
      setImages([]);
      setImagesPreviews([]);
      setTaggedUsers([]);
      setLocation("");
      setCommunityId("");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to post. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = userSuggestions.filter((suggestion) => {
    if (!tagInput.trim()) return false;

    const searchTerm = tagInput.toLowerCase().trim();
    const displayName = (suggestion.displayName || "").toLowerCase();
    const storeName = (suggestion.storeName || "").toLowerCase();
    const name = (suggestion.name || "").toLowerCase();

    return (
      displayName.includes(searchTerm) ||
      storeName.includes(searchTerm) ||
      name.includes(searchTerm)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-20 bottom-20 md:inset-auto md:top-[5%] md:left-[35%] md:max-w-lg w-full md:-translate-x-[50%] bg-white rounded-xl shadow-xl overflow-hidden z-50 flex flex-col max-h-[80vh] md:max-h-[85vh]"
          >
            <div className="p-4 border-b">
              <motion.button
                type="button"
                onClick={onClose}
                className="absolute text-gray-500 top-4 left-4 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </motion.button>
              <h2 className="text-lg font-semibold text-center">Create Post</h2>
            </div>

            <div
              ref={modalContentRef}
              className="flex-1 p-4 overflow-y-auto min-h-0"
            >
              <form onSubmit={handlePost} className="space-y-4">
                <div className="flex items-center mb-4 space-x-3">
                  {!posts?.data?.avatar ? (
                    <div className="w-[50px] h-[50px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center">
                      {posts?.data?.storeName?.charAt(0)?.toUpperCase()}
                    </div>
                  ) : (
                    <img
                      src={posts?.data?.avatar || "/placeholder.svg"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{posts?.data?.storeName}</h3>
                    <p className="text-sm text-gray-600">
                      {posts?.data?.craftCategories?.[0]}
                    </p>
                  </div>
                </div>

                <textarea
                  placeholder="Share your Ideas..."
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                  required
                  className="w-full h-32 p-3 text-gray-700 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                {taggedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {taggedUsers.map((user) => (
                      <span
                        key={user._id}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full ${
                          user.tagType === "vendors"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                      >
                        @{user?.storeName || user?.name}
                        <span className="text-xs opacity-75">
                          ({user?.tagType})
                        </span>
                        <motion.button
                          type="button"
                          onClick={() => removeTag(user._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <XCircle className="w-4 h-4" />
                        </motion.button>
                      </span>
                    ))}
                  </div>
                )}

                {imagesPreviews.length > 0 && (
                  <div className="space-y-2">
                    <motion.div
                      ref={imageScrollRef}
                      className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                      style={{
                        scrollBehavior: "smooth",
                        msOverflowStyle: "none",
                        scrollbarWidth: "thin",
                      }}
                    >
                      {imagesPreviews.map((preview, index) => (
                        <motion.div
                          key={index}
                          className="relative flex-shrink-0"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="object-cover w-24 h-24 rounded-lg"
                          />
                          <motion.button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute p-1 text-white rounded-full top-1 right-1 bg-black/50 hover:bg-black/70"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                    {imagesPreviews.length >= 3 && (
                      <p className="text-xs text-gray-500">
                        Scroll horizontally to view all images
                      </p>
                    )}
                  </div>
                )}

                {showTagInput && (
                  <div className="relative">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      placeholder="Tag vendors by store name or communities by name..."
                      className="w-full p-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    {showSuggestions && tagInput && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-32 overflow-y-auto"
                      >
                        {filteredSuggestions.length > 0 ? (
                          filteredSuggestions.map((suggestion) => (
                            <motion.button
                              key={`${suggestion.tagType}-${suggestion._id}`}
                              type="button"
                              onClick={() => handleTagUser(suggestion)}
                              className="flex items-center w-full gap-2 p-2 text-left hover:bg-gray-100 transition-colors"
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                            >
                              <img
                                src={suggestion.avatar || "/placeholder.svg"}
                                alt={suggestion.displayName}
                                className="w-6 h-6 rounded-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder.svg?height=24&width=24";
                                }}
                              />
                              <div>
                                <span className="font-medium text-sm">
                                  {suggestion.displayName}
                                </span>
                                <span
                                  className={`text-xs ml-1 ${
                                    suggestion.tagType === "vendors"
                                      ? "text-blue-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  ({suggestion.tagType})
                                </span>
                              </div>
                            </motion.button>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500 text-center">
                            No vendors or communities found matching "{tagInput}
                            "
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}
              </form>
            </div>

            <div className="p-4 bg-white border-t flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <div ref={emojiPickerRef} className="relative">
                    <motion.button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Smile className="w-6 h-6" />
                    </motion.button>
                    {showEmojiPicker && (
                      <div className="absolute left-0 mb-2 bottom-full">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ImageIcon className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => setShowTagInput(!showTagInput)}
                    className="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-6 h-6" />
                  </motion.button>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  onClick={handlePost}
                  className={`px-4 py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors ${
                    loading
                      ? "bg-orange-400 text-white cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? "Posting..." : "Post Idea"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
        </>
      )}
    </AnimatePresence>
  );
}
