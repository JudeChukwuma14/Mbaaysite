import { useState, useRef } from "react"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
import { motion, AnimatePresence } from "framer-motion"
import CreatePostModal from "./CreatePostModal"
import SocialList from "./SocailPost"
import { get_single_vendor } from "@/utils/vendorApi"
import { useSelector } from "react-redux"
import { comment_on_posts, get_communities, get_posts_feed, like_posts, unlike_posts } from "@/utils/communityApi"
import moment from "moment"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FaHeart } from "react-icons/fa"
import { toast } from "react-toastify"

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
      <img src={src || "/placeholder.svg"} alt={alt} className="object-cover w-full h-full" />
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

  interface RootState {
    vendor: {
      token: string;
      _id: string;
      vendor: {
        id: string;
      };
    };
  }

  const user = useSelector((state: RootState) => state.vendor)
  // const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  
    const { data: communities = [] } = useQuery({
      queryKey: ["communities"],
      queryFn: () => get_communities(user?.token),
      enabled: !!user?.token,  // Only fetch if token exists
    })


  const { data: comm_posts,isLoading  } = useQuery({
    queryKey: ["comm_posts"],
    queryFn: () => get_posts_feed(user.token),
  });

  // const { data: comments } = useQuery({
  //   queryKey: ["comments"],
  //   queryFn: () => get_posts_comments("67bb54180851001aa027c1bb"),
  // });

  // console.log(comments)

  const queryClient = useQueryClient();
const likeMutation = useMutation({
  mutationFn: (postId: string) => like_posts(user?.token, postId),
  onMutate: async (postId: string) => {
    // Optimistic Update: Update cache immediately before the request
    await queryClient.cancelQueries({ queryKey: ['comm_posts'] });

    const previousPosts = queryClient.getQueryData(['comm_posts']);

    queryClient.setQueryData(['comm_posts'], (oldPosts: any) => {
      return oldPosts.map((post: any) => {
        if (post._id === postId) {
          return {
            ...post,
            likes: [...post.likes, user._id] // Add current user to likes
          };
        }
        return post;
      });
    });

    return { previousPosts };
  },
  onError: (_, __, context) => {
    // Revert to previous state if mutation fails
    queryClient.setQueryData(['comm_posts'], context?.previousPosts);
  },
  onSettled: () => {
    // Always refetch posts after mutation (ensure data consistency)
    queryClient.invalidateQueries({ queryKey: ['comm_posts'] });
  },
});

// Unlike Post Mutation
const unlikeMutation = useMutation({
  mutationFn: (postId: string) => unlike_posts(user?.token, postId),
  onMutate: async (postId: string) => {
    await queryClient.cancelQueries({ queryKey: ['comm_posts'] });

    const previousPosts = queryClient.getQueryData(['comm_posts']);

    queryClient.setQueryData(['comm_posts'], (oldPosts: any) => {
      return oldPosts.map((post: any) => {
        if (post._id === postId) {
          return {
            ...post,
            likes: post.likes.filter((like: string) => like !== user._id) // Remove current user from likes
          };
        }
        return post;
      });
    });

    return { previousPosts };
  },
  onError: (_, __, context) => {
    queryClient.setQueryData(['comm_posts'], context?.previousPosts);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['comm_posts'] });
  },
});

// Handle Like/Unlike Action
const handleLikeToggle = (postId: string, isLiked: boolean) => {
  if (isLiked) {
    unlikeMutation.mutate(postId);
  } else {
    likeMutation.mutate(postId);
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
          {isLoading? <p>Loading...</p> : comm_posts?.map((post:any, index:any) => (
            <motion.div
              key={post?.id}
              className="p-4 bg-white rounded-lg shadow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                 {
                  post?.posterType === "vendors" ? <div className = "w-[45px] h-[45px] rounded-full bg-orange-500 flex justify-center items-center text-white"><p>{post?.poster?.userName?.charAt(0)}</p></div> :  <Avatar src={post?.poster?.community_Images} alt={post?.author?.name} />
                 }
                  <div>
                    {
                      post?.posterType === "vendors" ?<h3 className="font-semibold">{post?.poster?.userName}</h3>:<h3 className="font-semibold">{post?.poster?.name}</h3>
                    }
                    <p className="text-sm text-gray-500">
                     {post?.posterType === "vendors"  ?  post?.poster?.craftCategories[0] : 'COMMUNITY'}• {moment(post?.createdTime).fromNow()}
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
              
              <div className="w-full h-[200px] object-cover border">
              <img src={post?.posts_Images[0]} alt="image" className="object-cover w-full h-full border" />
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
  onClick={() => handleLikeToggle(post._id, post.likes.includes(user._id))}
  className="flex items-center gap-1 hover:text-red-500"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
 {post.likes.includes(user._id) ?  <CiHeart /> :  <FaHeart className="text-red-700"/>}
  <span>{post.likes.length} Likes</span>
</motion.button>
                <span>{post?.comments?.length || 0} Comments</span>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {post?.comments?.map((comment:any) => (
                  <motion.div
                    key={comment.id}
                    className="p-3 mt-4 rounded-lg bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex items-start gap-2">
                      <Avatar src={comment?.author?.avatar} alt={comment?.author?.name} size="sm" />
                      <div className="flex-grow">
                        <p className="text-sm font-medium">{comment?.comment_poster}</p>
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
                              className="px-2 py-1 text-sm rounded-full hover:bg-gray-200"
                              // onClick={() => handleReaction(post.id, comment.id, reaction.emoji)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {reaction?.emoji} {reaction?.count}
                            </motion.button>
                          ))}
                          <motion.button
                            className="px-2 py-1 text-sm rounded-full hover:bg-gray-200"
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
                          {comment?.replies?.map((reply:any) => (
                            <motion.div
                              key={reply.id}
                              className="p-2 mt-2 ml-6 bg-white rounded-lg"
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
              <div className="flex items-center gap-2 mt-4">
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
                         toast.success("Comment created successfully", {
                              position: "top-right",
                              autoClose: 4000,
                            })
                        setTimeout(() => {
                          window.location.reload();
                        }, 1000); 
                      }
                    }}
                  />
                  <motion.button
                    className="absolute text-gray-500 transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-700"
                    onClick={() => setShowEmojiPicker((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    😊
                  </motion.button>
                </div>
                {showEmojiPicker[post.id] && (
                  <div ref={emojiPickerRef} className="absolute right-0 z-10 bottom-full">
                    {/* <EmojiPicker onEmojiClick={(emojiData) => handleEmojiSelect(emojiData, post.id)} /> */}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Sidebar */}
        <div className="max-w-md min-h-screen mx-auto bg-gray-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* <img src="/placeholder.svg?height=60&width=60" alt="Profile" className="w-12 h-12 rounded-full" /> */}
            <div className="bg-orange-500 w-[40px] h-[40px] rounded-full text-white flex items-center justify-center">
                       <p>{vendors?.userName?.charAt()}</p>
                       </div>
            <div>
              <h2 className="font-semibold">{vendors?.userName}</h2>
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
        {
          communities.slice(0, 4).map((communities:any)=>(
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mb-[20px]">
          <div className="flex flex-col items-center justify-between gap-3">
          <div className="flex items-center justify-between">
          <h4 className="mb-1 text-sm font-semibold text-orange-800">{communities.name}</h4>
          <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className={`px-3 py-2 rounded-full ${communities.admin === user?.vendor?.id ? "bg-orange-200 text-orange-800" : "bg-blue-200 text-blue-800"} text-sm ml-4 cursor-pointer`}>
             {communities.admin === user?.vendor?.id ? "Owner" : "Member"}</motion.span>
          </div>
            </div>  
        </motion.div>
          ))
        }
        {communities.length > 4 && (
  <button
    onClick={() => {
      // Handle what you want to do when user clicks 'See More'
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

