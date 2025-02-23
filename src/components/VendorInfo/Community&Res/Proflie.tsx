"use client"

import { motion } from "framer-motion"
import { MapPin, PenSquare, MessageSquare, Users, FileText, User } from "lucide-react"
import { useEffect, useState } from "react"
import CreatePostModal from "./CreatePostModal"
import CommunityModal from "./CommunityModal"
import mbayy from "../../../assets/image/MBLogo.png"
import { get_single_vendor } from "@/utils/vendorApi"
import { useSelector } from "react-redux"

interface Post {
  id: number
  image: string
  date: string
  time: string
  likes: string
  comments: []
  description: string
}



export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false)
  const user = useSelector((state:any)=> state.user)
  const [posts,setPosts] = useState<any>({})


   useEffect(()=>{
    const fetchAdmin = async () => {
        if (!user?.token) return;
        try {
          const vendordata = await get_single_vendor(user.token);
          setPosts(vendordata);
        } catch (error) {
          console.error("Error fetching admin:", error);
        }
      };
      fetchAdmin()
    })

  
  const handlecreateCommunity = (name: string, description: string) => {
    // Handle the create community logic here
    console.log("Sending message:", { name, description })
  }
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      {/* Banner with Logo */}
      <div className="relative h-32 border rounded-xl">
        <div className="absolute -bottom-6 left-4">
          <img
            src="/placeholder.svg?height=48&width=48"
            alt="Profile"
            className="w-12 h-12 rounded-lg border-2 border-white"
          />
        </div>
        {/* <div className="h-full flex items-center justify-center">
          <h1 className="text-5xl font-bold tracking-wider">
            <span className="text-[#00FF00]">m</span>
            <span className="text-[#FFFF00]">oo</span>
            <span className="text-[#00FFFF]">i</span>
          </h1>
        </div> */}
        <img src={mbayy} alt="banner" className="w-[100%] h-[100%]"/>
      </div>

      {/* Profile Info */}
      <div className="px-6 pt-8">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{posts.userName
          }</h2>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>{posts.craftCategories
            }</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {posts.state},
              {posts.country}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          <motion.div whileHover={{ scale: 1.02 }} className="flex-1 bg-white rounded-xl shadow-sm border p-2">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-semibold">{posts?.followers?.length || <p>0</p>}</div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="flex-1 bg-white rounded-xl shadow-sm border p-2">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-semibold">{posts?.following?.length || <p>0</p>}</div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="flex-1 bg-white rounded-xl shadow-sm border p-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-semibold">{posts?.communityPosts?.length || <p>0</p>}</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button className="px-6 py-2 text-sm font-medium rounded-full bg-gray-50">Posts</button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B00] text-white py-2 rounded-full text-sm"
          >
            <PenSquare className="w-4 h-4" />
            Create Post
          </motion.button>
          {/* <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsMessageModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#FF6B00] text-white px-6 py-2 rounded-full text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Message
          </motion.button> */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCommunityModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#FF6B00] text-white px-6 py-2 rounded-full text-sm"
          >
            <Users className="w-4 h-4" />
            Create Community
          </motion.button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 gap-4 mt-[50px] ">
        {posts?.communityPosts?.length > 0 ? (
  [...posts.communityPosts].reverse().map((props: any) => (
      <motion.div
        key={props.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl overflow-hidden border"
      >
        <img
          src={"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-19%20040101-Lr9Y3NS9z1VF51t4pz7IPXfHtwCstK.png"}
          alt={`Post ${props.id}`}
          className="w-full aspect-[16/9] object-cover"
        />
        <div className="p-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {props.updatedAt.split("T")[0]}
            </div>
            <div className="flex items-center gap-1">
              <span>•</span>
              {props.updatedAt.split("T")[1]}
            </div>
          </div>
          <p className="text-sm text-black-600 mt-2 line-clamp-2">{props.content}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-gray-500">
                {props.likes.length || 0}
              </motion.button>
              <span className="text-sm text-gray-500">{props.likes} Likes</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{props.comments?.length || 0} Comments</span>
            </div>
          </div>
        </div>
      </motion.div>
  ))
) : (
  <p className="text-gray-500 text-center mt-6">No community posts available.</p>
)}
        </div>
        
        

        <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
      <CommunityModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        onSend={handlecreateCommunity}
      />
    </div>
  )
}