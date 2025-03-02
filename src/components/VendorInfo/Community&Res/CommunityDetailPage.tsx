"use client"

import { motion } from "framer-motion"
import { PenSquare, MessageSquare, FileText, Users } from "lucide-react"
import { useState } from "react"
import { RiCommunityLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { get_one_community } from "@/utils/communityApi";
import { useParams } from "react-router-dom";
import CreatePostcommModal from "./CreatePostcommModal";
import { useSelector } from "react-redux";
import moment from "moment";
import EditCommunityModal from "./EditCommunityModal";
import DeleteConfirmationModal from "./DeleteCommunityConfirmationModal";


export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleEditSave = (name: string, description: string, image: File | null) => {
    // Implement the logic to save the edited community details
    console.log("Saving edited community:", { name, description, image })
    // You'll need to implement the API call to update the community details here
  }

  const handleDelete = () => {
    // Implement the logic to delete the community
    console.log("Deleting community")
    // You'll need to implement the API call to delete the community here
  }

  const {communityid} = useParams()
  const user = useSelector((state: any) => state.vendor)


  const {data:one_community} = useQuery({
    queryKey: ['one_community'],
    queryFn: () => get_one_community(communityid)
  })

  return (
    <div className="max-w-4xl min-h-screen mx-auto bg-white">
      {/* Banner with Logo */}
      <div className="relative h-32 overflow-hidden bg-black border rounded-xl">
        <img src={one_community?.community_Images} alt="banner" className="w-[100%] h-[100%] object-cover"/>
      </div>

      {/* Profile Info */}
      <div className="px-6 pt-8">
        <div className="space-y-1">
          {/*main Holder For Community Name and Created By*/}
           <div className="flex items-center justify-between">
             {/* Community Name and Created By*/}
             <div className="flex items-center gap-2">
                <h2>Community</h2>
                <RiCommunityLine size={25}/>
            </div>
             {/*  Created By*/}
            <div className="flex items-center gap-2">
                <h2>Created by:</h2>
                <span>{one_community?.admin?.userName}</span>
            </div>
           </div>
          <div className="flex items-center">
          <h2 className="text-xl font-semibold">{one_community?.name}</h2>
          <div className="flex items-center justify-between gap-3 ml-7">
          <CiEdit size={20} className="text-blue-600 cursor-pointer" onClick={() => setIsEditModalOpen(true)}/>
          <MdDelete size={20} className="text-red-600 cursor-pointer" onClick={() => setIsDeleteModalOpen(true)}/>
          </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span className="w-[600px]">{one_community?.description}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          <motion.div whileHover={{ scale: 1.02 }} className="flex-1 p-2 bg-white border shadow-sm rounded-xl">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-semibold">{one_community?.members?.length || 0}</div>
                <div className="text-xs text-gray-500">Members</div>
              </div>
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="flex-1 p-2 bg-white border shadow-sm rounded-xl">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-semibold">{one_community?.communityPosts?.length || 0}</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button className="px-6 py-2 text-sm font-medium rounded-full bg-gray-50">Posts</button>
         {
          one_community?.admin._id === user.vendor.id ?  <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B00] text-white py-2 rounded-full text-sm"
        >
          <PenSquare className="w-4 h-4" />
          Create Post
        </motion.button>: 
        <div className="flex gap-[20px]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="w-[200px] h-[50px] flex items-center justify-center gap-2 bg-[#FF6B00] text-white py-2 rounded-full text-sm"
          >
            <PenSquare className="w-4 h-4" />
            Leave Group
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="w-[200px] h-[50px] flex items-center justify-center gap-2 bg-[#FF6B00] text-white py-2 rounded-full text-sm"
          >
            <PenSquare className="w-4 h-4" />
           Report
          </motion.button>
        </div>
         }
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {one_community?.communityPosts?.map((props:any) => (
            <motion.div
              key={props?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white border rounded-xl"
            >
             {props.posts_Images?.length > 0 && (
          <div
            className={`grid gap-1 w-full ${
              props.posts_Images.length === 1
                ? "grid-cols-1 h-60"
                : props.posts_Images.length === 2
                ? "grid-cols-2 h-60"
                : "grid-cols-2 grid-rows-2 h-80"
            }`}
          >
            {props?.posts_Images?.slice(0, 3).map((image: string, index: number) => (
              <div
                key={index}
                className={`overflow-hidden ${
                  props.posts_Images.length === 1
                    ? "rounded-lg"
                    : props.posts_Images.length === 2
                    ? "rounded-md"
                    : index === 0
                    ? "row-span-2 rounded-lg"
                    : "rounded-md"
                }`}
              >
                <img
                  src={image}
                  alt={`Post ${props.id} - Image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
              <div className="p-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {props?.createdTime.split("T")[0]}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    {moment(props?.createdTime).fromNow()}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{props?.content}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-gray-500">
                      👍
                    </motion.button>
                    <span className="text-sm text-gray-500">{props?.likes?.length ||0} Likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{props?.comments?.length ||0} Comments</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <CreatePostcommModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <EditCommunityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        initialName={one_community?.name}
        initialDescription={one_community?.description}
        initialImage={one_community?.image || "/placeholder.svg"}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      </div>
    </div>
  )
}