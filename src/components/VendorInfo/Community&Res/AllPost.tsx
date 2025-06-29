"use client"

import { useState, useRef, useEffect } from "react"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
import { motion, AnimatePresence } from "framer-motion"
import CreatePostModal from "./CreatePostModal"
import SocialList from "./SocailPost"
import { get_single_vendor } from "@/utils/vendorApi"
import { useSelector } from "react-redux"
import {
  comment_on_posts,
  comment_on_comment,
  get_communities,
  get_posts_feed,
  like_posts,
  unlike_posts,
} from "@/utils/communityApi"
import moment from "moment"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FaHeart } from "react-icons/fa"
import { toast } from "react-toastify"
import loading from "../../../assets/loading.gif"
import { CiHeart } from "react-icons/ci"

interface Recommendation {
  id: string
  name: string
  mutuals: number
  avatar: string
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    name: "James Chariton",
    mutuals: 8,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Madio Mane",
    mutuals: 15,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Javier Afritin",
    mutuals: 12,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Terry Jones",
    mutuals: 15,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]


export default function SocialFeed() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState<Record<string, boolean>>({})
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>({})
  const [showRepliesDropdown, setShowRepliesDropdown] = useState<Record<string, boolean>>({})
  const [replyText, setReplyText] = useState<Record<string, string>>({})

  const user = useSelector((state: any) => state.vendor)

  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    const savedLikes = localStorage.getItem("likedPosts")
    return savedLikes ? JSON.parse(savedLikes) : {}
  })

  useEffect(() => {
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts))
  }, [likedPosts])

  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  })

  const { data: communities = [] } = useQuery({
    queryKey: ["communities"],
    queryFn: () => get_communities(user?.token),
    enabled: !!user?.token,
  })

  const { data: comm_posts, isLoading } = useQuery({
    queryKey: ["comm_posts"],
    queryFn: () => get_posts_feed(user.token),
  })

  const queryClient = useQueryClient()

  const handleLikeToggle = (postId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikeMutation.mutate(postId)
    } else {
      likeMutation.mutate(postId)
    }
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !isLiked,
    }))
  }

  const likeMutation = useMutation({
    mutationFn: (postId: string) => like_posts(user?.token, postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["comm_posts"] })
      const previousPosts = queryClient.getQueryData(["comm_posts"])

      queryClient.setQueryData(["comm_posts"], (oldPosts: any) => {
        return oldPosts.map((post: any) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: post.likes.includes(user._id) ? post.likes : [...post.likes, user._id],
            }
          }
          return post
        })
      })

      return { previousPosts }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["comm_posts"], context?.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comm_posts"] })
    },
  })

  const unlikeMutation = useMutation({
    mutationFn: (postId: string) => unlike_posts(user?.token, postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["comm_posts"] })
      const previousPosts = queryClient.getQueryData(["comm_posts"])

      queryClient.setQueryData(["comm_posts"], (oldPosts: any) => {
        return oldPosts.map((post: any) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: post.likes.filter((like: string) => like !== user._id),
            }
          }
          return post
        })
      })

      return { previousPosts }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["comm_posts"], context?.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comm_posts"] })
    },
  })

  // useMutation for replying to comments with background refresh
  const replyToCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
      text,
    }: {
      postId: string
      commentId: string
      text: string
    }) => comment_on_comment(user?.token, postId, commentId, { text }),
    onSuccess: async (_, variables) => {
      // Clear the reply input
      setReplyText((prev) => ({
        ...prev,
        [variables.commentId]: "",
      }))
      setShowReplyInput((prev) => ({
        ...prev,
        [variables.commentId]: false,
      }))

      // Background refresh using refetchQueries instead of invalidateQueries
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["comm_posts"] }),
        queryClient.refetchQueries({ queryKey: ["communities"] }),
        queryClient.refetchQueries({ queryKey: ["vendors"] }),
        queryClient.refetchQueries({ queryKey: ["vendor"] }),
        queryClient.refetchQueries({ queryKey: ["all_comm"] }),
      ])

      toast.success("Reply posted successfully", {
        position: "top-right",
        autoClose: 3000,
      })
    },
    onError: (error) => {
      console.error("Error posting reply:", error)
      toast.error("Failed to post reply. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      })
    },
  })

  const commentOnPostMutation = useMutation({
    mutationFn: ({
      postId,
      text,
    }: {
      postId: string
      text: string
    }) =>
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
      ])

      toast.success("Comment created successfully", {
        position: "top-right",
        autoClose: 3000,
      })
    },
    onError: (error) => {
      console.error("Error posting comment:", error)
      toast.error("Failed to post comment. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      })
    },
  })

  // Function to handle reply button click
  const handleReplyClick = (commentId: string) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  // Function to handle reply text change
  const handleReplyTextChange = (commentId: string, text: string) => {
    setReplyText((prev) => ({
      ...prev,
      [commentId]: text,
    }))
  }

  // Function to submit reply
  const handleReplySubmit = (postId: string, commentId: string) => {
    const text = replyText[commentId]?.trim()
    if (!text) {
      toast.error("Please enter a reply", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    replyToCommentMutation.mutate({
      postId,
      commentId,
      text,
    })
  }

  // Function to handle comment submission
  const handleCommentSubmit = (postId: string, text: string, inputElement: HTMLInputElement) => {
    if (!text.trim()) {
      toast.error("Please enter a comment", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    commentOnPostMutation.mutate({
      postId,
      text: text.trim(),
    })

    // Clear the input
    inputElement.value = ""

    // Hide emoji picker
    setShowEmojiPicker((prev) => ({
      ...prev,
      [postId]: false,
    }))
  }

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
            <div className="flex justify-center items-center flex-col h-[100vh] relativ">
              <img src={loading || "/placeholder.svg"} alt="loading_image" />
              <p className="m-0 absolute top-[70%]">Loading...</p>
            </div>
          ) : (
            comm_posts?.map((post: any, index: any) => {
              const isLiked = likedPosts[post._id] || post.likes.includes(user._id)

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
                        {post?.posterType === "vendors" ? (
                          <h3 className="font-semibold">{post?.poster?.storeName}</h3>
                        ) : (
                          <h3 className="font-semibold">{post?.poster?.storeName}</h3>
                        )}
                        <p className="text-sm text-gray-500">
                          {post?.posterType === "vendors" ? post?.poster?.craftCategories[0] : "COMMUNITY"}•{" "}
                          {moment(post?.createdTime).fromNow()}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      className="p-1 rounded-full hover:bg-gray-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        />
                      </svg>
                    </motion.button>
                  </div>

                  <p className="mb-4 text-sm">{post?.content}</p>

                  {post?.posts_Images.length > 0 ? (
                    <div className="w-full h-[200px] object-cover border">
                      <img
                        src={post?.posts_Images[0] || "/placeholder.svg"}
                        alt="image"
                        className="object-cover w-full h-full border"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* {post.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))} */}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <motion.button
                      onClick={() => handleLikeToggle(post._id, isLiked)}
                      className="flex items-center gap-1 hover:text-red-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLiked ? <FaHeart size={16} className="text-red-500" /> : <CiHeart size={16} />}
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
                          <div className="flex-grow">
                            <p className="text-sm font-medium">{comment?.comment_poster}</p>
                            <p className="text-sm">{comment?.text}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>{comment?.timestamp}</span>
                              <motion.button
                                className="hover:text-gray-700 font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleReplyClick(comment._id)}
                              >
                                Reply
                              </motion.button>
                              {comment?.replies && comment.replies.length > 0 && (
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
                                  {comment.replies.length === 1 ? "1 Reply" : `${comment.replies.length} Replies`}
                                  <svg
                                    className={`w-3 h-3 transition-transform ${showRepliesDropdown[comment._id] ? "rotate-180" : ""}`}
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
                                        {vendors?.storeName?.charAt(0)?.toUpperCase()}
                                      </div>
                                    ) : (
                                      <img
                                        src={vendors?.avatar || "/placeholder.svg"}
                                        alt="Vendor"
                                        className="w-8 h-8 rounded-full"
                                      />
                                    )}
                                    <div className="flex-grow">
                                      <input
                                        type="text"
                                        placeholder="Write a reply..."
                                        value={replyText[comment._id] || ""}
                                        onChange={(e) => handleReplyTextChange(comment._id, e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        onKeyPress={(e) => {
                                          if (e.key === "Enter") {
                                            handleReplySubmit(post._id, comment._id)
                                          }
                                        }}
                                        disabled={replyToCommentMutation.isPending}
                                      />
                                    </div>
                                    <div className="flex gap-1">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleReplySubmit(post._id, comment._id)}
                                        disabled={replyToCommentMutation.isPending}
                                        className="px-3 py-1 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {replyToCommentMutation.isPending ? "Posting..." : "Post"}
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleReplyClick(comment._id)}
                                        disabled={replyToCommentMutation.isPending}
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
                              <motion.button
                                className="px-2 py-1 text-sm rounded-full hover:bg-gray-200"
                                onClick={() =>
                                  setShowEmojiPicker((prev) => ({
                                    ...prev,
                                    [comment.id]: !prev[comment.id],
                                  }))
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              ></motion.button>
                            </div>

                            {showEmojiPicker[comment.id] && (
                              <div ref={emojiPickerRef} className="absolute z-10">
                                <EmojiPicker
                                  onEmojiClick={(emojiData: EmojiClickData) => {
                                    setShowEmojiPicker((prev) => ({
                                      ...prev,
                                      [comment.id]: false,
                                    }))
                                    console.log(emojiData)
                                  }}
                                />
                              </div>
                            )}

                            {/* Replies Dropdown */}
                            <AnimatePresence>
                              {showRepliesDropdown[comment._id] && comment?.replies && comment.replies.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-3"
                                >
                                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                                    {comment.replies.map((reply: any, replyIndex: number) => (
                                      <motion.div
                                        key={reply.id || replyIndex}
                                        className="p-3 border-b border-gray-100 last:border-b-0"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: replyIndex * 0.05 }}
                                      >
                                        <div className="flex items-start gap-2">
                                          {/* {!reply?.author?.avatar ? (
                                            <div className="w-[32px] h-[32px] rounded-[50%] bg-blue-300 text-white flex items-center justify-center text-xs">
                                              {reply?.author?.name?.charAt(0)?.toUpperCase() || "U"}
                                            </div>
                                          ) : (
                                            <img
                                              src={reply.author.avatar || "/placeholder.svg"}
                                              alt={reply.author.name}
                                              className="w-8 h-8 rounded-full"
                                            />
                                          )} */}
                                          {!vendors?.avatar ? (
                                            <div className="w-[50px] h-[50px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center">
                                                   {vendors?.storeName?.charAt(0)?.toUpperCase()}
                                             </div>
                                           ) : (
                                          <img src={vendors?.avatar || "/placeholder.svg"} alt="Vendor" className="w-10 h-10 rounded-full" />
                                          )}
                                          <div className="flex-grow">
                                            <p className="text-sm font-medium text-gray-900">
                                              {vendors?.storeName}
                                            </p>
                                            <p className="text-sm text-gray-700 mt-1">
                                              {reply?.content || reply?.text}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                              <span>{reply?.timestamp || moment(reply?.createdAt).fromNow()}</span>
                                              {/* <motion.button
                                                className="hover:text-gray-700 font-medium"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                              >
                                                Like
                                              </motion.button> */}
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
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
                            const inputElement = e.currentTarget
                            handleCommentSubmit(post._id, inputElement.value, inputElement)
                          }
                        }}
                      />
                      <motion.button
                        className="absolute text-gray-500 transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-700"
                        onClick={() =>
                          setShowEmojiPicker((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }))
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      ></motion.button>
                    </div>
                    {showEmojiPicker[post.id] && (
                      <div ref={emojiPickerRef} className="absolute right-0 z-10 bottom-full">
                        {/* <EmojiPicker onEmojiClick={(emojiData) => handleEmojiSelect(emojiData, post.id)} /> */}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </motion.div>

        {/* Right Sidebar */}
        <div className="max-w-md min-h-screen mx-auto bg-gray-100">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {!vendors?.avatar ? (
                  <div className="w-[50px] h-[50px] rounded-[50%] bg-orange-300 text-white flex items-center justify-center">
                    {vendors?.storeName?.charAt(0)?.toUpperCase()}
                  </div>
                ) : (
                  <img src={vendors?.avatar || "/placeholder.svg"} alt="Vendor" className="w-10 h-10 rounded-full" />
                )}
                <div>
                  <h2 className="font-semibold">{vendors?.storeName}</h2>
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-4 text-sm">
              <div className="text-center">
                <div className="font-bold">{vendors?.communityPosts?.length || 0}</div>
                <div className="text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{vendors?.followers?.length || 0}</div>
                <div className="text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{vendors?.following?.length || 0}</div>
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
          </motion.div>

          <div className="p-4 mt-4 bg-white shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">RECOMMENDATION</h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="space-y-3"
            >
              {recommendations.map((recommendation) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={recommendation.avatar || "/placeholder.svg"}
                      alt={recommendation.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm">{recommendation.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">{recommendation.mutuals} Mutuals</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="p-4 mt-4 bg-white shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">MY COMMUNITIES</h3>
            {communities?.slice(0, 4)?.map((community: any) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-2 mb-[20px]"
              >
                <div className="flex flex-col items-center justify-between gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="mb-1 text-sm font-semibold text-orange-800">{community.name}</h4>
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
                      {community.admin === user?.vendor?._id ? "Owner" : "Member"}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
            {communities.length > 4 && (
              <button
                onClick={() => {
                  console.log("See More Clicked")
                }}
                className="mt-2 font-semibold text-orange-600 cursor-pointer"
              >
                See More
              </button>
            )}
          </div>

          <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </div>
    </div>
  )
}
