import { useState, useRef, useEffect } from "react"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
// import EmojiPicker from "emoji-picker-react"
import { motion, AnimatePresence } from "framer-motion"
import CreatePostModal from "./CreatePostModal"
import SocialList from "./SocailPost"
import { get_single_vendor } from "@/utils/vendorApi"
import { useSelector } from "react-redux"
import { comment_on_posts, get_posts_feed, like_posts, unlike_posts } from "@/utils/communityApi"
import moment from "moment"


interface Recommendation {
  id: string
  name: string
  mutuals: number
  avatar: string
}

interface Topic {
  id: string
  name: string
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

const topics: Topic[] = [
  { id: "1", name: "Design" },
  { id: "2", name: "Beauty & Skincare" },
  { id: "3", name: "Photography" },
  { id: "4", name: "Marketing" },
]

// interface User {
//   id: string
//   name: string
//   category: string
//   avatar: string
//   following?: boolean
// }

// interface Reaction {
//   emoji: string
//   count: number
//   users: string[]
// }

// interface Comment {
//   id: string
//   author: User
//   content: string
//   timestamp: string
//   reactions: Reaction[]
//   replies: Comment[]
// }

// interface Post {
//   id: string
//   author: User
//   content: string
//   timestamp: string
//   likes: number
//   comments: Comment[]
//   hashtags: string[]
// }

interface AvatarProps {
  src: string
  alt: string
  size?: "sm" | "md" | "lg"
}

function Avatar({ src, alt, size = "sm" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  )
}

// interface BadgeProps {
//   children: React.ReactNode
//   variant?: "default" | "secondary"
// }

// function Badge({ children, variant = "default" }: BadgeProps) {
//   const variantClasses = {
//     default: "bg-orange-100 text-orange-600",
//     secondary: "bg-gray-100 text-gray-600",
//   }

//   return (
//     <motion.span
//       className={`${variantClasses[variant]} text-xs px-2.5 py-0.5 rounded-full font-medium`}
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//     >
//       {children}
//     </motion.span>
//   )
// }

export default function SocialFeed() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState<Record<string, boolean>>({})
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  const user = useSelector((state:any)=> state.vendor)
  const [vendor,setVendor] = useState<any>([])
  const [my_posts,setMyposts] = useState<any>([])
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});



   useEffect(()=>{
    const fetchAdmin = async () => {
        if (!user?.token) return;
        try {
          const vendordata = await get_single_vendor(user.token);
          setVendor(vendordata);
        } catch (error) {
          console.error("Error fetching admin:", error);
        }
      };
      fetchAdmin()
    })

   useEffect(()=>{
    const fetchPosts = async () => {
        if (!user?.token) return;
        try {
          const vendorposts = await get_posts_feed(user.token);
          setMyposts(vendorposts);
        } catch (error) {
          console.error("Error fetching admin:", error);
        }
      };
      fetchPosts()
    })

    // console.log(my_posts)
   
     

    const handleLike = async (postId: string) => {
      try {
        const isLiked = likedPosts[postId]; // Check if the post is already liked
    
        if (isLiked) {
          await unlike_posts(user?.token, postId);
        } else {
          await like_posts(user?.token, postId);
        }
    
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: !isLiked, // Toggle like state
        }));
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr_280px] gap-6 p-4 h-screen">
        {/* Left Sidebar */}

        <SocialList/>

        {/* Main Content */}
        <motion.div
          className="space-y-6 overflow-y-auto max-h-[calc(100vh-2rem)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {my_posts?.data?.data?.feedPosts?.map((post:any, index:any) => (
            <motion.div
              key={my_posts.id}
              className="bg-white rounded-lg shadow p-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <Avatar src={post?.author?.avatar} alt={post?.author?.name} />
                  <div>
                    <h3 className="font-semibold">{post?.poster?.userName}</h3>
                    <p className="text-sm text-gray-500">
                      {post?.poster?.craftCategories[0]} • {moment(post?.createdTime).fromNow()}
                    </p>
                   
                  </div>
                  
                </div>
                <motion.button
                  className="p-1 hover:bg-gray-100 rounded-full"
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

              <p className="text-sm mb-4">{post?.content}</p>
              
              <div className="w-full h-[200px] object-cover border">
              <img src={post?.posts_Images[0]} alt="image" className="w-full h-full object-cover border" />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {/* {post.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))} */}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <motion.button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-1 hover:text-red-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                   className={`w-4 h-4 ${
                    likedPosts[post._id] ? "fill-red-500 stroke-red-500" : "stroke-gray-500"
                  }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{post?.likes?.length || 0} Likes</span>
                </motion.button>
                <span>{post?.comments?.length || 0} Comments</span>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {post?.comments?.map((comment:any) => (
                  <motion.div
                    key={comment.id}
                    className="mt-4 bg-gray-50 p-3 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex items-start gap-2">
                      <Avatar src={comment?.author?.avatar} alt={comment?.author?.name} size="sm" />
                      <div className="flex-grow">
                        <p className="text-sm font-medium">{comment?.name}</p>
                        <p className="text-sm">{comment?.text}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{comment?.timestamp}</span>
                          <motion.button
                            className="hover:text-gray-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Reply
                          </motion.button>
                        </div>
                        {/* Comment Reactions */}
                        <div className="flex items-center gap-1 mt-1">
                          {comment?.reactions?.map((reaction:any) => (
                            <motion.button
                              key={reaction?.emoji}
                              className="text-sm hover:bg-gray-200 rounded-full px-2 py-1"
                              // onClick={() => handleReaction(post.id, comment.id, reaction.emoji)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {reaction?.emoji} {reaction?.count}
                            </motion.button>
                          ))}
                          <motion.button
                            className="text-sm hover:bg-gray-200 rounded-full px-2 py-1"
                            onClick={() => setShowEmojiPicker((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            😊
                          </motion.button>
                        </div>
                        {showEmojiPicker[comment.id] && (
                          <div ref={emojiPickerRef} className="absolute z-10">
                            <EmojiPicker
                              onEmojiClick={(emojiData: EmojiClickData) => {
                                // handleReaction(post.id, comment.id, emojiData.emoji)
                                setShowEmojiPicker((prev) => ({ ...prev, [comment.id]: false }))
                                console.log(emojiData)
                              }}
                            />
                          </div>
                        )}
                        {/* Replies */}
                        <AnimatePresence>
                          {comment?.replies?.map((reply) => (
                            <motion.div
                              key={reply.id}
                              className="ml-6 mt-2 bg-white p-2 rounded-lg"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                            >
                              <div className="flex items-start gap-2">
                                <Avatar src={reply?.author?.avatar} alt={reply?.author?.name} size="sm" />
                                <div>
                                  <p className="text-sm font-medium">{reply?.author?.name}</p>
                                  <p className="text-sm">{reply?.content}</p>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                    <span>{reply?.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Comment Input */}
              <div className="mt-4 flex items-center gap-2">
                {/* <Avatar src={vendors[0].avatar} alt={vendors[0].name} size="sm" /> */}
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    data-post-id={post.id}
                    className="w-full p-2 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        comment_on_posts(user?.token,post._id, {text:e.currentTarget.value,userType:"vendors"})
                        setShowEmojiPicker((prev) => ({ ...prev, [post.id]: false }))
                      }
                    }}
                  />
                  <motion.button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowEmojiPicker((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    😊
                  </motion.button>
                </div>
                {showEmojiPicker[post.id] && (
                  <div ref={emojiPickerRef} className="absolute z-10 bottom-full right-0">
                    {/* <EmojiPicker onEmojiClick={(emojiData) => handleEmojiSelect(emojiData, post.id)} /> */}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Sidebar */}
        <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* <img src="/placeholder.svg?height=60&width=60" alt="Profile" className="w-12 h-12 rounded-full" /> */}
            <div className="bg-orange-500 w-[40px] h-[40px] rounded-full text-white flex items-center justify-center">
                       <p>{vendor?.userName?.charAt()}</p>
                       </div>
            <div>
              <h2 className="font-semibold">{vendor?.userName}</h2>
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-4 text-sm">
          <div className="text-center">
            <div className="font-bold">{vendor?.communityPosts?.length || 0}</div>
            <div className="text-gray-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{vendor?.followers?.length || 0}</div>
            <div className="text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{vendor?.following?.length || 0}</div>
            <div className="text-gray-600">Following</div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-orange-500 text-white py-2 rounded-md font-medium"
        >
          Create Post
        </motion.button>
      </motion.div>

      <div className="mt-4 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">RECOMMENDATION</h3>
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

      <div className="mt-4 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">TOPICS YOU FOLLOW</h3>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <motion.span
              key={topic.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm"
            >
              {topic.name}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
      </div>
    </div>
  )
}

