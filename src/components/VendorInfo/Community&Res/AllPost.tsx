import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreatePostModal from "./CreatePostModal";
import SocialList from "./SocailPost";
import { get_single_vendor } from "@/utils/vendorApi";
import { useSelector } from "react-redux";
import {
  comment_on_posts,
  comment_on_comment,
  get_communities,
  get_posts_feed,
  like_posts,
  unlike_posts,
  get_mutual_recommendation,
} from "@/utils/communityApi";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHeart } from "react-icons/fa";
import { GoReply } from "react-icons/go";
import { toast } from "react-toastify";
// import loading from "../../../assets/loading.gif";
import { CiHeart } from "react-icons/ci";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function SocialFeed() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const [infoMode, setInfoMode] = useState<"following" | "followers" | "posts">("following");
  // const [ setShowEmojiPicker] = useState<
  //   Record<string, boolean>
  // >({});
  // const emojiPickerRef = useRef<HTMLDivElement>(null);

  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>(
    {}
  );
  const [showRepliesDropdown, setShowRepliesDropdown] = useState<
    Record<string, boolean>
  >({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // New state for image gallery
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const user = useSelector((state: any) => state.vendor);

  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    const savedLikes = localStorage.getItem("likedPosts");
    return savedLikes ? JSON.parse(savedLikes) : {};
  });

  useEffect(() => {
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  const { data: vendors, isLoading: isLoadingVendor } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  const { data: communities = [], isLoading: isLoadingCommunities } = useQuery({
    queryKey: ["communities"],
    queryFn: () => get_communities(user?.token),
    enabled: !!user?.token,
  });

  const { data: comm_posts, isLoading } = useQuery({
    queryKey: ["comm_posts"],
    queryFn: () => get_posts_feed(user.token),
  });

  // New useQuery for mutual recommendations
  const { data: mutualRecommendations = [], isLoading: isLoadingMutuals } =
    useQuery({
      queryKey: ["mutual_recommendations"],
      queryFn: () => get_mutual_recommendation(user?.token),
      enabled: !!user?.token,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  const queryClient = useQueryClient();
  const openInfoModal = (mode: "following" | "followers" | "posts") => {
    setInfoMode(mode);
    setIsInfoOpen(true);
    setIsInfoLoading(true);
    // small delay to show loading effect even if data is ready
    setTimeout(() => setIsInfoLoading(false), 350);
  };

  const handleLikeToggle = (postId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikeMutation.mutate(postId);
    } else {
      likeMutation.mutate(postId);
    }
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !isLiked,
    }));
  };

  const likeMutation = useMutation({
    mutationFn: (postId: string) => like_posts(user?.token, postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["comm_posts"] });
      const previousPosts = queryClient.getQueryData(["comm_posts"]);

      queryClient.setQueryData(["comm_posts"], (oldPosts: any) => {
        return oldPosts.map((post: any) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: post.likes.includes(user._id)
                ? post.likes
                : [...post.likes, user._id],
            };
          }
          return post;
        });
      });

      return { previousPosts };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["comm_posts"], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comm_posts"] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (postId: string) => unlike_posts(user?.token, postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["comm_posts"] });
      const previousPosts = queryClient.getQueryData(["comm_posts"]);

      queryClient.setQueryData(["comm_posts"], (oldPosts: any) => {
        return oldPosts.map((post: any) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: post.likes.filter((like: string) => like !== user._id),
            };
          }
          return post;
        });
      });

      return { previousPosts };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["comm_posts"], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comm_posts"] });
    },
  });

  // useMutation for replying to comments with background refresh
  const replyToCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
      text,
    }: {
      postId: string;
      commentId: string;
      text: string;
    }) => comment_on_comment(user?.token, postId, commentId, { text }),
    onSuccess: async (_, variables) => {
      // Clear the reply input
      setReplyText((prev) => ({
        ...prev,
        [variables.commentId]: "",
      }));
      setShowReplyInput((prev) => ({
        ...prev,
        [variables.commentId]: false,
      }));
      // Background refresh using refetchQueries instead of invalidateQueries
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["comm_posts"] }),
        queryClient.refetchQueries({ queryKey: ["communities"] }),
        queryClient.refetchQueries({ queryKey: ["vendors"] }),
        queryClient.refetchQueries({ queryKey: ["vendor"] }),
        queryClient.refetchQueries({ queryKey: ["all_comm"] }),
      ]);

      toast.success("Reply posted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const commentOnPostMutation = useMutation({
    mutationFn: ({ postId, text }: { postId: string; text: string }) =>
      comment_on_posts(user?.token, postId, {
        text,
        userType: "vendors",
      }),
    onSuccess: async () => {
      // Background refresh using refetchQueries instead of invalidateQueries
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["comm_posts"] }),
        queryClient.refetchQueries({ queryKey: ["communities"] }),
        queryClient.refetchQueries({ queryKey: ["vendors"] }),
        queryClient.refetchQueries({ queryKey: ["vendor"] }),
        queryClient.refetchQueries({ queryKey: ["all_comm"] }),
      ]);

      toast.success("Comment created successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  // Function to handle reply button click
  const handleReplyClick = (commentId: string) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Function to handle reply text change
  const handleReplyTextChange = (commentId: string, text: string) => {
    setReplyText((prev) => ({
      ...prev,
      [commentId]: text,
    }));
  };

  // Function to submit reply
  const handleReplySubmit = (postId: string, commentId: string) => {
    const text = replyText[commentId]?.trim();
    if (!text) {
      toast.error("Please enter a reply", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    replyToCommentMutation.mutate({
      postId,
      commentId,
      text,
    });
  };

  // Function to handle comment submission
  const handleCommentSubmit = (
    postId: string,
    text: string,
    inputElement: HTMLInputElement
  ) => {
    if (!text.trim()) {
      toast.error("Please enter a comment", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    commentOnPostMutation.mutate({
      postId,
      text: text.trim(),
    });

    // Clear the input
    inputElement.value = "";
    // Hide emoji picker
    // setShowEmojiPicker((prev) => ({
    //   ...prev,
    //   [postId]: false,
    // }));
  };

  // Function to render tags
  const renderTags = (tags: any[], tagType: string) => {
    if (!tags || tags?.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag: any, index: number) => (
          <motion.span
            key={tag._id || tag.id || index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
              tagType === "vendors"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            <span className="font-medium">@</span>
            <span>{tag?.user?.storeName || tag?.user?.name || "Unknown"}</span>
            {tagType === "community" && (
              <span className="text-xs opacity-75">(Community)</span>
            )}
          </motion.span>
        ))}
      </div>
    );
  };

  // Function to open image gallery
  const openImageGallery = (images: string[], startIndex = 0) => {
    setGalleryImages(images);
    setCurrentImageIndex(startIndex);
    setShowImageGallery(true);
  };

  // Function to close image gallery
  const closeImageGallery = () => {
    setShowImageGallery(false);
    setGalleryImages([]);
    setCurrentImageIndex(0);
  };

  // Function to navigate to next image
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  // Function to navigate to previous image
  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  // Function to render images based on count
  const renderImages = (images: string[]) => {
    if (!images || images.length === 0) return null;

    const imageCount = images.length;

    if (imageCount === 1) {
      return (
        <div className="w-full h-[300px] mb-4">
          <img
            src={images[0] || "/placeholder.svg"}
            alt="Post image"
            className="object-cover w-full h-full rounded-lg cursor-pointer"
            onClick={() => openImageGallery(images, 0)}
          />
        </div>
      );
    }

    if (imageCount === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {images.map((image, index) => (
            <div key={index} className="h-[200px]">
              <img
                src={image || "/placeholder.svg"}
                alt={`Post image ${index + 1}`}
                className="object-cover w-full h-full rounded-lg cursor-pointer"
                onClick={() => openImageGallery(images, index)}
              />
            </div>
          ))}
        </div>
      );
    }

    if (imageCount === 3) {
      return (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="h-[250px]">
            <img
              src={images[0] || "/placeholder.svg"}
              alt="Post image 1"
              className="object-cover w-full h-full rounded-lg cursor-pointer"
              onClick={() => openImageGallery(images, 0)}
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            {images.slice(1, 3).map((image, index) => (
              <div key={index + 1} className="h-[120px]">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Post image ${index + 2}`}
                  className="object-cover w-full h-full rounded-lg cursor-pointer"
                  onClick={() => openImageGallery(images, index + 1)}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (imageCount === 4) {
      return (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {images.map((image, index) => (
            <div key={index} className="h-[150px]">
              <img
                src={image || "/placeholder.svg"}
                alt={`Post image ${index + 1}`}
                className="object-cover w-full h-full rounded-lg cursor-pointer"
                onClick={() => openImageGallery(images, index)}
              />
            </div>
          ))}
        </div>
      );
    }

    // For 5 or more images
    if (imageCount >= 5) {
      return (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className={`h-[150px] ${
                index === 0 ? "row-span-2 h-[310px]" : ""
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Post image ${index + 1}`}
                className="object-cover w-full h-full rounded-lg cursor-pointer"
                onClick={() => openImageGallery(images, index)}
              />
            </div>
          ))}
          <div className="relative h-[150px]">
            <img
              src={images[3] || "/placeholder.svg"}
              alt="Post image 4"
              className="object-cover w-full h-full rounded-lg cursor-pointer"
              onClick={() => openImageGallery(images, 3)}
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg cursor-pointer"
              onClick={() => openImageGallery(images, 3)}
            >
              <span className="text-white text-2xl font-bold">
                +{imageCount - 4}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr_280px] gap-6 p-4 h-screen">
        {/* Left Sidebar */}
        <SocialList />

        {/* Main Content */}
        <motion.div
          className="space-y-6 overflow-y-auto max-h-[calc(100vh-2rem)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-lg shadow border border-gray-100 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded mb-4" />
                  <div className="h-40 w-full bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : comm_posts && comm_posts.length > 0 ? (
            comm_posts?.map((post: any, index: any) => {
              const isLiked =
                likedPosts[post._id] || post.likes.includes(user._id);

              return (
                <motion.div
                  key={post?.id}
                  className="p-4 bg-white rounded-lg shadow"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-3">
                      {!post?.community ? (
                        <>
                          {!post?.poster?.avatar ? (
                            <div className="w-[50px] h-[50px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center">
                              {post?.poster?.storeName
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </div>
                          ) : (
                            <img
                              src={post?.poster?.avatar || "/placeholder.svg"}
                              alt="Vendor"
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                        </>
                      ) : (
                        <img
                          src={
                            post?.community?.community_Images ||
                            "/placeholder.svg"
                          }
                          alt="Vendor"
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        {!post?.community ? (
                          <>
                            {post?.posterType === "vendors" ? (
                              <h3 className="font-semibold">
                                {post?.poster?.storeName}
                              </h3>
                            ) : (
                              <h3 className="font-semibold">
                                {post?.poster?.name || post?.poster?.storeName}
                              </h3>
                            )}
                          </>
                        ) : (
                          <h3 className="font-semibold">
                            {post?.community?.name}
                          </h3>
                        )}
                        <p className="text-sm text-gray-500">
                          {post?.posterType === "vendors"
                            ? post?.poster?.craftCategories?.[0] || "Vendor"
                            : "COMMUNITY"}
                          • {moment(post?.createdTime).fromNow()}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      className="p-1 rounded-full hover:bg-gray-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    ></motion.button>
                  </div>

                  <p className="mb-4 text-sm">{post?.content}</p>

                  {/* Display Tags */}
                  {post?.tags &&
                    post.tags.length > 0 &&
                    renderTags(post.tags, post.tagType || "vendors")}

                  {/* Display Images */}
                  {post?.posts_Images?.length > 0 &&
                    renderImages(post.posts_Images)}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <motion.button
                      onClick={() => handleLikeToggle(post._id, isLiked)}
                      className="flex items-center gap-1 hover:text-red-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLiked ? (
                        <FaHeart size={16} className="text-red-500" />
                      ) : (
                        <CiHeart size={16} />
                      )}
                      <span>{post.likes.length} Likes</span>
                    </motion.button>
                    <span>{post?.comments?.length || 0} Comments</span>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {post?.comments?.map((comment: any) => (
                      <motion.div
                        key={comment.id}
                        className="p-3 mt-4 rounded-lg bg-gray-50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <div className="flex items-start gap-2">
                          {!comment?.commenter?.avatar ? (
                            <div className="w-[40px] h-[40px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center">
                              {comment?.comment_poster
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </div>
                          ) : (
                            <img
                              src={
                                comment?.commenter?.avatar || "/placeholder.svg"
                              }
                              alt="Commenter"
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div className="flex-grow">
                            <p className="text-sm font-medium">
                              {comment?.comment_poster}
                            </p>
                            <p className="text-sm">{comment?.text}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>
                                {moment(comment?.timestamp).fromNow()}
                              </span>
                              <motion.button
                                className="hover:text-gray-700 font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleReplyClick(comment._id)}
                              >
                                <div className="flex items-center gap-1">
                                  <GoReply size={16} />
                                  Reply
                                </div>
                              </motion.button>

                              {comment?.replies &&
                                comment.replies.length > 0 && (
                                  <motion.button
                                    className="hover:text-gray-700 font-medium flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      setShowRepliesDropdown((prev) => ({
                                        ...prev,
                                        [comment._id]: !prev[comment._id],
                                      }))
                                    }
                                  >
                                    {comment.replies.length === 1
                                      ? "1 Reply"
                                      : `${comment.replies.length} Replies`}
                                    <svg
                                      className={`w-3 h-3 transition-transform ${
                                        showRepliesDropdown[comment._id]
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </motion.button>
                                )}
                            </div>

                            {/* Reply Input */}
                            <AnimatePresence>
                              {showReplyInput[comment._id] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-3"
                                >
                                  <div className="flex items-center gap-2">
                                    {!vendors?.avatar ? (
                                      <div className="w-[30px] h-[30px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center text-xs">
                                        {vendors?.storeName
                                          ?.charAt(0)
                                          ?.toUpperCase()}
                                      </div>
                                    ) : (
                                      <img
                                        src={
                                          vendors?.avatar || "/placeholder.svg"
                                        }
                                        alt="Vendor"
                                        className="w-8 h-8 rounded-full"
                                      />
                                    )}
                                    <div className="flex-grow">
                                      <input
                                        type="text"
                                        placeholder="Write a reply..."
                                        value={replyText[comment._id] || ""}
                                        onChange={(e) =>
                                          handleReplyTextChange(
                                            comment._id,
                                            e.target.value
                                          )
                                        }
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        onKeyPress={(e) => {
                                          if (e.key === "Enter") {
                                            handleReplySubmit(
                                              post._id,
                                              comment._id
                                            );
                                          }
                                        }}
                                        disabled={
                                          replyToCommentMutation.isPending
                                        }
                                      />
                                    </div>
                                    <div className="flex gap-1">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                          handleReplySubmit(
                                            post._id,
                                            comment._id
                                          )
                                        }
                                        disabled={
                                          replyToCommentMutation.isPending
                                        }
                                        className="px-3 py-1 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {replyToCommentMutation.isPending
                                          ? "Posting..."
                                          : "Post"}
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                          handleReplyClick(comment._id)
                                        }
                                        disabled={
                                          replyToCommentMutation.isPending
                                        }
                                        className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                                      >
                                        Cancel
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Comment Reactions */}
                            <div className="flex items-center gap-1 mt-1">
                              {comment?.reactions?.map((reaction: any) => (
                                <motion.button
                                  key={reaction?.emoji}
                                  className="px-2 py-1 text-sm rounded-full hover:bg-gray-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {reaction?.emoji} {reaction?.count}
                                </motion.button>
                              ))}
                            </div>

                            {/* Replies Dropdown */}
                            <AnimatePresence>
                              {showRepliesDropdown[comment._id] &&
                                comment?.replies &&
                                comment.replies.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3"
                                  >
                                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                                      {comment.replies.map(
                                        (reply: any, replyIndex: number) => (
                                          <motion.div
                                            key={reply.id || replyIndex}
                                            className="p-3 border-b border-gray-100 last:border-b-0"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                              delay: replyIndex * 0.05,
                                            }}
                                          >
                                            <div className="flex items-start gap-2">
                                              {!vendors?.avatar ? (
                                                <div className="w-[50px] h-[50px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center">
                                                  {vendors?.storeName
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                                </div>
                                              ) : (
                                                <img
                                                  src={
                                                    vendors?.avatar ||
                                                    "/placeholder.svg"
                                                  }
                                                  alt="Vendor"
                                                  className="w-7 h-7 rounded-full"
                                                />
                                              )}
                                              <div className="flex-grow">
                                                <p className="text-sm font-medium text-gray-900">
                                                  {vendors?.storeName ||
                                                    "Anonymous"}
                                                </p>
                                                <p className="text-sm text-gray-700 mt-1">
                                                  {reply?.content ||
                                                    reply?.text}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                  <span>
                                                    {reply?.timestamp
                                                      ? moment(
                                                          reply.timestamp
                                                        ).fromNow()
                                                      : moment(
                                                          reply?.createdAt
                                                        ).fromNow()}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </motion.div>
                                        )
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        data-post-id={post.id}
                        className="w-full p-2 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={commentOnPostMutation.isPending}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const inputElement = e.currentTarget;
                            handleCommentSubmit(
                              post._id,
                              inputElement.value,
                              inputElement
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed rounded-xl bg-gray-50"
            >
              <div className="mb-3">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="18" height="14" rx="3" className="fill-orange-50 stroke-orange-300" strokeWidth="1.5" />
                  <path d="M7 12h6M7 9h10M7 15h10" className="stroke-orange-400" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-gray-900">No posts to show</h4>
              <p className="mt-1 text-xs text-gray-600 max-w-sm">
                Follow communities and creators or create your first post to see updates here.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Right Sidebar */}
        <div className="max-w-md min-h-screen mx-auto bg-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white shadow-sm"
          >
            {isLoadingVendor ? (
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-[50px] h-[50px] rounded-full bg-gray-200" />
                    <div>
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  {[0,1,2].map((i) => (
                    <div key={i} className="text-center">
                      <div className="h-5 w-8 mx-auto bg-gray-200 rounded" />
                      <div className="h-3 w-12 mx-auto mt-1 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
                <div className="h-9 w-full bg-gray-200 rounded" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {!vendors?.avatar ? (
                      <div className="w-[50px] h-[50px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center">
                        {vendors?.storeName?.charAt(0)?.toUpperCase()}
                      </div>
                    ) : (
                      <img
                        src={vendors?.avatar || "/placeholder.svg"}
                        alt="Vendor"
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <h2 className="font-semibold">{vendors?.storeName}</h2>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mb-4 text-sm">
                  <div className="text-center">
                    <button type="button" onClick={() => openInfoModal("posts")} className="font-bold hover:text-orange-600">
                      {vendors?.communityPosts?.length || 0}
                    </button>
                    <div className="text-gray-600">Posts</div>
                  </div>
                  <div className="text-center">
                    <button type="button" onClick={() => openInfoModal("followers")} className="font-bold hover:text-orange-600">
                      {vendors?.followers?.length || 0}
                    </button>
                    <div className="text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <button type="button" onClick={() => openInfoModal("following")} className="font-bold hover:text-orange-600">
                      {(() => {
                        const raw = (vendors as any)?.following;
                        if (!Array.isArray(raw)) return 0;
                        const ids = raw
                          .map((f: any) => (typeof f === "string" ? f : f?._id))
                          .filter(Boolean);
                        return ids.length;
                      })()}
                    </button>
                    <div className="text-gray-600">Following</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2 font-medium text-white bg-orange-500 rounded-md"
                >
                  Create Post
                </motion.button>
              </>
            )}
          </motion.div>

          

          <div className="p-4 mt-4 bg-white shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">RECOMMENDATION</h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="space-y-3"
            >
              {isLoadingMutuals ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div className="h-3 w-28 bg-gray-200 rounded" />
                      </div>
                      <div className="h-3 w-16 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              ) : mutualRecommendations && mutualRecommendations.length > 0 ? (
                mutualRecommendations
                  .slice(0, 4)
                  .map((recommendation: any, index: number) => (
                    <motion.div
                      key={recommendation._id || recommendation.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        {!recommendation.avatar ? (
                          <div className="w-8 h-8 rounded-full bg-blue-300 text-white flex items-center justify-center text-xs">
                            {recommendation.storeName
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              recommendation.name?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </div>
                        ) : (
                          <img
                            src={recommendation.avatar || "/placeholder.svg"}
                            alt={
                              recommendation.storeName || recommendation.name
                            }
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="text-sm">
                          {recommendation.storeName ||
                            recommendation.name ||
                            "Unknown User"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {recommendation.mutualCount ||
                          recommendation.mutuals ||
                          0}{" "}
                        Mutuals
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="text-center text-gray-500 border border-dashed rounded-lg p-6">
                  <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                  </div>
                  <div className="text-sm font-medium text-gray-700">No recommendations yet</div>
                  <div className="text-xs mt-1">Follow more creators and communities to get suggestions here.</div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="p-4 mt-4 bg-white shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">MY COMMUNITIES</h3>
            {isLoadingCommunities ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {communities.length === 0 ? (
                  <div className="text-center text-gray-500 border border-dashed rounded-lg p-6">
                    <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h0l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div className="text-sm font-medium text-gray-700">No communities yet</div>
                    <div className="text-xs mt-1">Join or create a community to see it here.</div>
                  </div>
                ) : (
                communities?.slice(0, 4)?.map((community: any) => (
                  <motion.div
                    key={community.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 mb-[20px]"
                  >
                    <div className="flex flex-col items-center justify-between gap-3">
                      <div className="flex items-center justify-between">
                        <h4 className="mb-1 text-sm font-semibold text-orange-800">
                          {community.name}
                        </h4>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-2 rounded-full ${
                            community.admin === user?.vendor?._id
                              ? "bg-orange-200 text-orange-800"
                              : "bg-blue-200 text-blue-800"
                          } text-sm ml-4 cursor-pointer`}
                        >
                          {community.admin === user?.vendor?._id
                            ? "Owner"
                            : "Member"}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                )))}
                {communities.length > 4 && (
                  <button
                    onClick={() => {
                      console.log("See More Clicked");
                    }}
                    className="mt-2 font-semibold text-orange-600 cursor-pointer"
                  >
                    See More
                  </button>
                )}
              </>
            )}
          </div>

          <CreatePostModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          {/* Info Modal */}
          <AnimatePresence>
            {isInfoOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                onClick={() => setIsInfoOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">
                      {infoMode === "following" && (
                        <>Following ({(() => {
                          const raw = (vendors as any)?.following;
                          if (!Array.isArray(raw)) return 0;
                          const ids = raw.map((f: any) => (typeof f === "string" ? f : f?._id)).filter(Boolean);
                          return ids.length;
                        })()})</>
                      )}
                      {infoMode === "followers" && (
                        <>Followers ({(() => {
                          const raw = (vendors as any)?.followers;
                          if (!Array.isArray(raw)) return 0;
                          const ids = raw.map((f: any) => (typeof f === "string" ? f : f?._id)).filter(Boolean);
                          return ids.length;
                        })()})</>
                      )}
                      {infoMode === "posts" && (
                        <>Posts ({Array.isArray((vendors as any)?.communityPosts) ? (vendors as any).communityPosts.length : 0})</>
                      )}
                    </h3>
                    <button onClick={() => setIsInfoOpen(false)} className="p-1 rounded hover:bg-gray-100">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {isInfoLoading ? (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="border border-gray-100 rounded-lg p-3 animate-pulse">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-full bg-gray-200" />
                            <div className="flex-1 min-w-0">
                              <div className="h-3 w-32 bg-gray-200 rounded mb-1" />
                              <div className="h-2 w-20 bg-gray-200 rounded" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="h-3 bg-gray-100 rounded" />
                            <div className="h-3 bg-gray-100 rounded" />
                            <div className="col-span-2 h-3 bg-gray-100 rounded" />
                            <div className="h-3 bg-gray-100 rounded" />
                            <div className="h-3 bg-gray-100 rounded" />
                            <div className="col-span-2 flex gap-2">
                              <div className="w-16 h-10 bg-gray-100 rounded" />
                              <div className="w-16 h-10 bg-gray-100 rounded" />
                              <div className="flex-1 h-3 bg-gray-100 rounded self-center" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                      {infoMode === "following" && (() => {
                        const raw = (vendors as any)?.following;
                        if (!Array.isArray(raw) || raw.length === 0) {
                          return <div className="text-sm text-gray-600">No following yet.</div>;
                        }
                        const list = raw.map((f: any) => (typeof f === "string" ? { _id: f } : f));
                        return list.map((v: any) => (
                          <div
                            key={v?._id}
                            className="border border-gray-100 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full overflow-hidden bg-orange-500 text-white flex items-center justify-center">
                                {v?.avatar || v?.businessLogo ? (
                                  <img
                                    src={(v?.avatar || v?.businessLogo) as string}
                                    alt={v?.storeName || "vendor"}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <span className="text-sm font-semibold">{v?.storeName?.charAt(0) || "V"}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold truncate">{v?.storeName || "Unknown Vendor"}</div>
                                <div className="text-xs text-gray-500 truncate">{v?.craftCategories?.[0] || "-"}</div>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <div className="text-gray-500">Verification</div>
                                <div className="font-medium">{v?.verificationStatus || "Unverified"}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Subscription</div>
                                <div className="font-medium">
                                  {v?.subscription?.currentPlan || "-"}
                                  {v?.subscription?.billingCycle ? ` • ${v.subscription.billingCycle}` : ""}
                                </div>
                              </div>
                              <div className="col-span-2">
                                <div className="text-gray-500">Payout Account</div>
                                <div className="font-medium">
                                  {(v?.bankAccount as any)?.account_name || "-"}
                                  {((v?.bankAccount as any)?.account_number) && (
                                    <span className="ml-1 text-gray-600">
                                      {String((v?.bankAccount as any)?.account_number).replace(/(\d{3})\d+(\d{2})/, "$1******$2")} • {(v?.bankAccount as any)?.bankName || ""}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500">Phone</div>
                                <div className="font-medium">{v?.storePhone || "-"}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Communities</div>
                                <div className="font-medium">{Array.isArray(v?.communities) ? v.communities.length : 0}</div>
                              </div>
                              <div className="col-span-2">
                                <div className="text-gray-500">KYC</div>
                                <div className="flex items-center gap-2">
                                  {(v?.kycDocuments as any)?.front && (
                                    <a href={(v.kycDocuments as any).front} target="_blank" rel="noreferrer" className="block w-16 h-10 overflow-hidden rounded border">
                                      <img src={(v.kycDocuments as any).front} alt="Front" className="object-cover w-full h-full" />
                                    </a>
                                  )}
                                  {(v?.kycDocuments as any)?.back && (
                                    <a href={(v.kycDocuments as any).back} target="_blank" rel="noreferrer" className="block w-16 h-10 overflow-hidden rounded border">
                                      <img src={(v.kycDocuments as any).back} alt="Back" className="object-cover w-full h-full" />
                                    </a>
                                  )}
                                  <div className="text-gray-600">
                                    {(v?.kycDocuments as any)?.documentType || "-"}
                                    {((v?.kycDocuments as any)?.country) ? ` • ${(v?.kycDocuments as any)?.country}` : ""}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ));
                      })()}

                      {infoMode === "followers" && (() => {
                        const raw = (vendors as any)?.followers;
                        if (!Array.isArray(raw) || raw.length === 0) {
                          return <div className="text-sm text-gray-600">No followers yet.</div>;
                        }
                        const list = raw.map((f: any) => (typeof f === "string" ? { _id: f } : f));
                        return list.map((v: any) => (
                          <div
                            key={v?._id}
                            className="border border-gray-100 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full overflow-hidden bg-orange-500 text-white flex items-center justify-center">
                                {v?.avatar || v?.businessLogo ? (
                                  <img
                                    src={(v?.avatar || v?.businessLogo) as string}
                                    alt={v?.storeName || "vendor"}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <span className="text-sm font-semibold">{v?.storeName?.charAt(0) || "V"}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold truncate">{v?.storeName || "Unknown Vendor"}</div>
                                <div className="text-xs text-gray-500 truncate">{v?.craftCategories?.[0] || "-"}</div>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <div className="text-gray-500">Verification</div>
                                <div className="font-medium">{v?.verificationStatus || "Unverified"}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Subscription</div>
                                <div className="font-medium">
                                  {v?.subscription?.currentPlan || "-"}
                                  {v?.subscription?.billingCycle ? ` • ${v.subscription.billingCycle}` : ""}
                                </div>
                              </div>
                              <div className="col-span-2">
                                <div className="text-gray-500">Payout Account</div>
                                <div className="font-medium">
                                  {(v?.bankAccount as any)?.account_name || "-"}
                                  {((v?.bankAccount as any)?.account_number) && (
                                    <span className="ml-1 text-gray-600">
                                      {String((v?.bankAccount as any)?.account_number).replace(/(\d{3})\d+(\d{2})/, "$1******$2")} • {(v?.bankAccount as any)?.bankName || ""}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500">Phone</div>
                                <div className="font-medium">{v?.storePhone || "-"}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Communities</div>
                                <div className="font-medium">{Array.isArray(v?.communities) ? v.communities.length : 0}</div>
                              </div>
                              <div className="col-span-2">
                                <div className="text-gray-500">KYC</div>
                                <div className="flex items-center gap-2">
                                  {(v?.kycDocuments as any)?.front && (
                                    <a href={(v.kycDocuments as any).front} target="_blank" rel="noreferrer" className="block w-16 h-10 overflow-hidden rounded border">
                                      <img src={(v.kycDocuments as any).front} alt="Front" className="object-cover w-full h-full" />
                                    </a>
                                  )}
                                  {(v?.kycDocuments as any)?.back && (
                                    <a href={(v.kycDocuments as any).back} target="_blank" rel="noreferrer" className="block w-16 h-10 overflow-hidden rounded border">
                                      <img src={(v.kycDocuments as any).back} alt="Back" className="object-cover w-full h-full" />
                                    </a>
                                  )}
                                  <div className="text-gray-600">
                                    {(v?.kycDocuments as any)?.documentType || "-"}
                                    {((v?.kycDocuments as any)?.country) ? ` • ${(v?.kycDocuments as any)?.country}` : ""}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ));
                      })()}

                      {infoMode === "posts" && (() => {
                        const posts = (vendors as any)?.communityPosts;
                        if (!Array.isArray(posts) || posts.length === 0) {
                          return <div className="text-sm text-gray-600">No posts yet.</div>;
                        }
                        return (
                          <div className="space-y-2 text-sm">
                            {posts.slice(0, 20).map((p: any, idx: number) => (
                              <div key={p?._id || p?.id || p || idx} className="p-2 border border-gray-100 rounded">
                                <div className="font-medium">Post ID: {String(p?._id || p)}</div>
                              </div>
                            ))}
                            {posts.length > 20 && (
                              <div className="text-xs text-gray-500">and {posts.length - 20} more...</div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {showImageGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeImageGallery}
          >
            <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <motion.button
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                onClick={closeImageGallery}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={32} />
              </motion.button>

              {/* Previous Button */}
              {galleryImages.length > 1 && (
                <motion.button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={48} />
                </motion.button>
              )}

              {/* Next Button */}
              {galleryImages.length > 1 && (
                <motion.button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={48} />
                </motion.button>
              )}

              {/* Current Image */}
              <motion.img
                key={currentImageIndex}
                src={galleryImages[currentImageIndex] || "/placeholder.svg"}
                alt={`Gallery image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image Counter */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {galleryImages.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
