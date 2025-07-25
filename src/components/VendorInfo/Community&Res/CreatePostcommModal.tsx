import type React from "react";
import { createPost, get_one_community } from "@/utils/communityApi";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smile, ImageIcon, User, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TaggedUser {
  id: string;
  name: string;
}

const userSuggestions = [
  { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Mike Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export default function CreatePostcommModal({
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const { communityid } = useParams();

  const user = useSelector((state: any) => state.vendor);

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

  const handleTagUser = (user: { id: string; name: string }) => {
    if (!taggedUsers.find((tagged) => tagged.id === user.id)) {
      setTaggedUsers([...taggedUsers, user]);
    }
    setTagInput("");
    setShowSuggestions(false);
  };

  const removeTag = (userId: string) => {
    setTaggedUsers(taggedUsers.filter((user) => user.id !== userId));
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
      formData.append("userType", "community");
      formData.append("posterId", one_community._id);
      formData.append("communityId", one_community._id);

      images.forEach((image) => {
        formData.append("posts_Images", image);
      });

      taggedUsers.forEach((user) => {
        formData.append("tags", user.id);
      });

      const token = user?.token || null;
      await createPost(formData, token);

      toast.success("Post created successfully", {
        position: "top-right",
        autoClose: 4000,
      });

      window.location.reload();

      setContent("");
      setImages([]);
      setImagesPreviews([]);
      setTaggedUsers([]);
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {taggedUsers.map((user) => (
                      <span
                        key={user.id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-sm text-orange-700 bg-orange-100 rounded-full"
                      >
                        @{user.name}
                        <motion.button
                          type="button"
                          onClick={() => removeTag(user.id)}
                        >
                          <XCircle className="w-4 h-4" />
                        </motion.button>
                      </span>
                    ))}
                  </div>
                )}

                {imagesPreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {imagesPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="object-cover w-full h-32 rounded-lg"
                        />
                        <motion.button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute p-1 text-white rounded-full top-1 right-1 bg-black/50 hover:bg-black/70"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                )}

                {showTagInput && (
                  <div className="relative mt-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      placeholder="Tag someone..."
                      className="w-full p-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {showSuggestions && tagInput && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                        {userSuggestions
                          .filter((user) =>
                            user.name
                              .toLowerCase()
                              .includes(tagInput.toLowerCase())
                          )
                          .map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleTagUser(user)}
                              className="flex items-center w-full gap-2 p-2 text-left hover:bg-gray-100"
                            >
                              <img
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <span>{user.name}</span>
                            </button>
                          ))}
                      </div>
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
