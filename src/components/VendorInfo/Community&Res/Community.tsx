import React, { useState, useRef, type ChangeEvent, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Users,
  MessageCircle,
  Share2,
  ThumbsUp,
  Send,
  ImageIcon,
  Smile,
  PlusCircle,
  Heart,
  Camera,
} from "lucide-react";

// Use React.lazy for dynamic import
const EmojiPicker = React.lazy(() => import("emoji-picker-react"));

interface User {
  id: string;
  name: string;
  avatar: string;
  isOwner: boolean;
}

interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

const currentUser: User = {
  id: "current-user",
  name: "Current User",
  avatar: "/placeholder.svg?height=32&width=32",
  isOwner: true, // Set this based on your authentication logic
};

const initialPosts: Post[] = [
  {
    id: "1",
    author: {
      id: "santiago",
      name: "Santiago Ava",
      avatar: "/placeholder.svg?height=40&width=40",
      isOwner: false,
    },
    content:
      "how many apples are there 🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍏\nthe winner takes $3000",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-27%20045302-iI3UnZITwPhrJYIQj2dZUilhmUG828.png",
    timestamp: "2h",
    likes: 1,
    isLiked: false,
    comments: [
      {
        id: "c1",
        author: {
          id: "estela",
          name: "Estela Condori",
          avatar: "/placeholder.svg?height=32&width=32",
          isOwner: false,
        },
        content: "Hay 15 manzanas y 22 tomates",
        timestamp: "2h",
        likes: 0,
        isLiked: false,
        replies: [],
      },
    ],
  },
];

export const CommunityPage: React.FC = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    postId: string;
    commentId: string;
  } | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleJoinLeave = () => {
    setIsJoined(!isJoined);
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleCommentLike = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      likes: comment.isLiked
                        ? comment.likes - 1
                        : comment.likes + 1,
                      isLiked: !comment.isLiked,
                    }
                  : comment
              ),
            }
          : post
      )
    );
  };

  const handleCommentSubmit = (postId: string, parentCommentId?: string) => {
    if (newComment.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: parentCommentId
                  ? post.comments.map((comment) =>
                      comment.id === parentCommentId
                        ? {
                            ...comment,
                            replies: [
                              ...comment.replies,
                              {
                                id: `r${comment.replies.length + 1}`,
                                author: currentUser,
                                content: newComment,
                                timestamp: "Just now",
                                likes: 0,
                                isLiked: false,
                                replies: [],
                              },
                            ],
                          }
                        : comment
                    )
                  : [
                      ...post.comments,
                      {
                        id: `c${post.comments.length + 1}`,
                        author: currentUser,
                        content: newComment,
                        timestamp: "Just now",
                        likes: 0,
                        isLiked: false,
                        replies: [],
                      },
                    ],
              }
            : post
        )
      );
      setNewComment("");
      setReplyingTo(null);
    }
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewComment(newComment + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically upload the image to your server
      // and get back a URL to add to the comment
      console.log("Image selected:", file.name);
      // For now, we'll just add a placeholder text
      setNewComment(newComment + " [Image Uploaded] ");
    }
  };

  const handleBannerUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderComments = (
    comments: Comment[],
    postId: string,
    isReply = false
  ) => {
    return comments.map((comment) => (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${isReply ? "ml-8 mt-2" : "mt-4"}`}
      >
        <img
          src={comment.author.avatar || "/placeholder.svg"}
          alt=""
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="px-4 py-2 bg-gray-100 rounded-2xl">
            <h4 className="text-sm font-semibold">{comment.author.name}</h4>
            <p className="text-sm">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <button
              onClick={() => handleCommentLike(postId, comment.id)}
              className="flex items-center gap-1 transition-colors hover:text-blue-500"
            >
              {comment.isLiked ? (
                <Heart className="w-4 h-4 text-blue-500 fill-blue-500" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </button>
            <button
              onClick={() => setReplyingTo({ postId, commentId: comment.id })}
              className="hover:underline"
            >
              Reply
            </button>
            <span>{comment.timestamp}</span>
          </div>
          {renderComments(comment.replies, postId, true)}
          {replyingTo?.commentId === comment.id && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-1 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleCommentSubmit(postId, comment.id)}
                className="mt-1 text-sm text-blue-500 hover:underline"
              >
                Post Reply
              </button>
            </div>
          )}
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div
        className="relative h-64 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600"
        onClick={() => bannerInputRef.current?.click()}
      >
        {bannerImage ? (
          <img
            src={bannerImage || "/placeholder.svg"}
            alt="Community Banner"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Camera className="w-12 h-12 text-white" />
          </div>
        )}
        <motion.input
          type="file"
          ref={bannerInputRef}
          onChange={handleBannerUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Community Info */}
      <div className="max-w-4xl px-4 mx-auto -mt-16">
        <div className="p-6 mb-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold">
                Tech Enthusiasts Community
              </h1>
              <div className="flex items-center gap-4 mb-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Globe className="w-5 h-5" />
                  <span>Public Group</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>15.3K members</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">Created by: John Doe</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleJoinLeave}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isJoined
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isJoined ? "Leave Group" : "Join Group"}
              </button>
              {currentUser.isOwner && (
                <button className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <PlusCircle className="inline-block w-5 h-5 mr-2" />
                  Create Post
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white shadow rounded-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={post.author.avatar || "/placeholder.svg"}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{post.author.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                    {post.isLiked && (
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    )}
                  </div>
                </div>
              </div>

              <p className="mb-4 whitespace-pre-line">{post.content}</p>

              {post.image && (
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Post content"
                  className="w-full mb-4 rounded-lg"
                />
              )}

              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="p-1 text-white bg-blue-500 rounded-full">
                    <ThumbsUp className="w-3 h-3" />
                  </div>
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="hover:underline">
                    {post.comments.length} comments
                  </button>
                  <button className="hover:underline">2 shares</button>
                </div>
              </div>

              <div className="flex items-center gap-4 py-2 border-y">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center justify-center flex-1 gap-2 py-2 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ThumbsUp
                    className={`w-5 h-5 ${post.isLiked ? "text-blue-500" : ""}`}
                  />
                  <span>{post.isLiked ? "Liked" : "Like"}</span>
                </button>
                <button className="flex items-center justify-center flex-1 gap-2 py-2 transition-colors rounded-lg hover:bg-gray-100">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center justify-center flex-1 gap-2 py-2 transition-colors rounded-lg hover:bg-gray-100">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Comments */}
              <div className="mt-4 space-y-4">
                {renderComments(post.comments, post.id)}

                {/* Comment Input */}
                <div className="flex gap-3 mt-4">
                  <img
                    src={currentUser.avatar || "/placeholder.svg"}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={
                        replyingTo ? "Write a reply..." : "Write a comment..."
                      }
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-2 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute flex items-center gap-2 -translate-y-1/2 right-3 top-1/2">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ImageIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleCommentSubmit(post.id, replyingTo?.commentId)
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                    {showEmojiPicker && (
                      <div className="absolute right-0 mb-2 bottom-full">
                        <Suspense fallback={<div>Loading...</div>}>
                          <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </Suspense>
                      </div>
                    )}
                  </div>
                  <motion.input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
