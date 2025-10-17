import type React from "react";
import {
  createPost,
  get_communities,
  get_one_community,
} from "@/utils/communityApi";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smile, ImageIcon, User, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllVendor } from "@/utils/vendorApi";
import { RootState } from "@/redux/store";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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

export default function CreatePostcommModal({
  isOpen,
  onClose,
  onSuccess,
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.vendor);

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
  const allVendors: Suggestion[] =
    allVendorsResponse?.vendors
      ?.filter((v: any) => v?._id || v?.id)
      ?.map((v: any) => ({
        _id: v._id || v.id,
        displayName: v.storeName || v.name || "Vendor",
        avatar: v.avatar || "/placeholder.svg",
        tagType: "vendors" as const,
        storeName: v.storeName || v.name,
        name: v.name,
      })) || [];

  const allCommunities: Suggestion[] =
    allCommunitiesResponse
      ?.filter((c: any) => c?._id || c?.id)
      ?.map((c: any) => ({
        _id: c._id || c.id,
        displayName: c.name || c.title || "Community",
        avatar: c.community_Images || "/placeholder.svg",
        tagType: "community" as const,
        name: c.name || c.title,
      })) || [];

  const userSuggestions: Suggestion[] = [...allVendors, ...allCommunities];

  const filteredSuggestions = userSuggestions.filter((s) => {
    if (!tagInput.trim()) return false;
    const term = tagInput.toLowerCase().trim();
    return (
      (s.displayName || "").toLowerCase().includes(term) ||
      (s.storeName || "").toLowerCase().includes(term) ||
      (s.name || "").toLowerCase().includes(term)
    );
  });
  const { communityid } = useParams();

  const { data: one_community } = useQuery({
    queryKey: ["one_community"],
    queryFn: () => get_one_community(communityid),
  });

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

  const handleTagUser = (s: Suggestion) => {
    const newTag: TaggedUser = {
      _id: s._id,
      ...(s.tagType === "vendors"
        ? { storeName: s.storeName || s.displayName }
        : { name: s.name || s.displayName }),
      tagType: s.tagType,
    };
    if (!taggedUsers.some((t) => t._id === s._id))
      setTaggedUsers((prev) => [...prev, newTag]);
    setTagInput("");
    setShowSuggestions(false);
    setShowTagInput(false);
  };

  const removeTag = (id: string) =>
    setTaggedUsers((prev) => prev.filter((t) => t._id !== id));

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  // const filteredSuggestions = userSuggestions.filter((suggestion) => {
  //   if (!tagInput.trim()) return false;

  //   const searchTerm = tagInput.toLowerCase().trim();
  //   const displayName = (suggestion.displayName || "").toLowerCase();
  //   const storeName = (suggestion.storeName || "").toLowerCase();
  //   const name = (suggestion.name || "").toLowerCase();

  //   return (
  //     displayName.includes(searchTerm) ||
  //     storeName.includes(searchTerm) ||
  //     name.includes(searchTerm)
  //   );
  // });

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
      formData.append("userType", "community");
      formData.append("posterId", one_community._id);
      formData.append("communityId", one_community._id);

      images.forEach((image) => {
        formData.append("posts_Images", image);
      });

      // API expects tags as a JSON array (per error message)
      const tagIds = taggedUsers.map((u) => u._id);
      formData.append("tags", JSON.stringify(tagIds));

      const token = user?.token || null;
      await createPost(formData, token);

      toast.success("Post created successfully", {
        position: "top-right",
        autoClose: 4000,
      });

      // window.location.reload();

      setContent("");
      setImages([]);
      setImagesPreviews([]);
      setTaggedUsers([]);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to post. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
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
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-20 bottom-20 md:inset-auto md:top-[5%] md:left-[35%] md:max-w-lg w-full md:-translate-x-[50%] bg-white rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
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

            <div ref={modalContentRef} className="flex-1 p-4 overflow-y-auto">
              <form onSubmit={handlePost}>
                <div className="flex items-center mb-4 space-x-3">
                  <img
                    src={one_community?.community_Images}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{one_community?.name}</h3>
                    <p className="text-sm text-gray-600">COMMUNITY</p>
                  </div>
                </div>

                <textarea
                  placeholder="Share your Ideas..."
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                  required
                  className="w-full h-40 p-3 text-gray-700 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                {taggedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {taggedUsers.map((u) => (
                      <span
                        key={u._id}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full ${
                          u.tagType === "vendors"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                      >
                        @{u.storeName || u.name}
                        <span className="text-xs opacity-75">
                          ({u.tagType})
                        </span>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeTag(u._id)}
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
                      className="flex gap-2 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
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

                {/* tag input */}
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
                        className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border rounded-lg shadow-lg max-h-32"
                      >
                        {filteredSuggestions.length ? (
                          filteredSuggestions.map((s) => (
                            <motion.button
                              key={`${s.tagType}-${s._id}`}
                              type="button"
                              onClick={() => handleTagUser(s)}
                              className="flex items-center w-full gap-2 p-2 text-left transition-colors hover:bg-gray-100"
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                            >
                              {s.avatar && s.avatar !== "/placeholder.svg" ? (
                                <img
                                  src={s.avatar}
                                  alt={s.displayName}
                                  className="object-cover w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-8 h-8 text-white bg-gray-400 rounded-full">
                                  {s.displayName.charAt(0).toUpperCase() || "U"}
                                </div>
                              )}
                              <div>
                                <span className="text-sm font-medium">
                                  {s.displayName}
                                </span>
                                <span
                                  className={`text-xs ml-1 ${
                                    s.tagType === "vendors"
                                      ? "text-blue-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  ({s.tagType})
                                </span>
                              </div>
                            </motion.button>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-center text-gray-500">
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

            <div className="p-4 bg-white border-t">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <div ref={emojiPickerRef} className="relative">
                    <motion.button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100"
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
                  >
                    <ImageIcon className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowTagInput(!showTagInput)}
                    className="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-6 h-6" />
                  </motion.button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={handlePost}
                  className={`px-4 py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    loading
                      ? "bg-orange-400 text-white cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {loading ? "Posting..." : "Post Idea"}
                </button>
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
