"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  PenSquare,
  MessageSquare,
  Users,
  FileText,
  User,
} from "lucide-react";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import CommunityModal from "./CommunityModal";
import { get_single_vendor } from "@/utils/vendorApi";
import { useSelector } from "react-redux";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";

// interface Post {
//   id: number
//   image: string
//   date: string
//   time: string
//   likes: string
//   comments: []
//   description: string
// }
const defaultBanner = "https://www.mbaay.com/assets/MBLogo-spwX6zWd.png";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const user = useSelector((state: any) => state.vendor);

  const posts = useQuery({
    queryKey: ["posts"],
    queryFn: () => get_single_vendor(user.token),
  });
  console.log("Post", posts);

  const handlecreateCommunity = (name: string, description: string) => {
    // Handle the create community logic here
    console.log("Sending message:", { name, description });
  };
  return (
    <div className="max-w-4xl min-h-screen mx-auto bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      {posts.isLoading ? (
        <div className="animate-pulse">
          {/* Banner skeleton */}
          <div className="relative h-32 border rounded-xl bg-gray-50" />
          <div className="px-6 pt-8">
            {/* Profile info skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-56 bg-gray-200 rounded" />
            </div>
            {/* Stats skeleton */}
            <div className="flex gap-3 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 p-3 bg-gray-50 border rounded-xl">
                  <div className="h-4 w-14 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
            {/* Buttons skeleton */}
            <div className="flex items-center gap-3 mt-4">
              <div className="h-9 w-24 bg-gray-200 rounded-full" />
              <div className="h-9 flex-1 bg-gray-200 rounded-full" />
              <div className="h-9 w-40 bg-gray-200 rounded-full" />
            </div>
            {/* Posts skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[50px]">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-50 border rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Banner with Logo */}
          <div className="relative h-32 border rounded-xl">
            <div className="absolute -bottom-6 left-4">
              {posts?.data?.avatar ? (
                <img
                  src={posts?.data?.avatar}
                  alt="Profile"
                  className="w-12 h-12 border-2 border-white rounded-lg"
                />
              ) : (
                <span className="bg-orange-300 flex items-center justify-center w-12 h-12 text-white rounded-full text-[17px] font-bold shadow">
                  {posts?.data?.storeName?.charAt(0)}
                </span>
              )}
            </div>
            {posts?.data?.businessLogo ? (
              <img
                src={posts?.data?.businessLogo}
                alt="Profile"
                className="w-12 h-12 border-2 border-white rounded-lg"
              />
            ) : (
              <img
                src={defaultBanner}
                alt="Profile"
                className="w-full h-full object-contain border-2 border-white rounded-lg"
              />
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pt-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{posts?.data?.userName}</h2>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>{posts?.data?.craftCategories}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {posts?.data?.state},{posts?.data?.country}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mt-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1 p-2 bg-white border shadow-sm rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold">
                      {posts?.data?.followers?.length ?? 0}
                    </div>
                    <div className="text-xs text-gray-500">Followers</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1 p-2 bg-white border shadow-sm rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold">
                      {posts?.data?.following?.length ?? 0}
                    </div>
                    <div className="text-xs text-gray-500">Following</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1 p-2 bg-white border shadow-sm rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold">
                      {posts?.data?.communityPosts?.length ?? 0}
                    </div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1 p-2 bg-white border shadow-sm rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold">
                      {posts?.data?.communities?.length ?? 0}
                    </div>
                    <div className="text-xs text-gray-500">Communities</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button className="px-6 py-2 text-sm font-medium rounded-full bg-gray-50">
                Posts
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B00] text-white py-2 rounded-full text-sm"
              >
                <PenSquare className="w-4 h-4" />
                Create Post
              </motion.button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[50px] auto-rows-auto">
              {posts?.data?.communityPosts?.length > 0 ? (
                [...posts?.data?.communityPosts]
                  .reverse()
                  .map((props: any, index: number) => (
                    <motion.div
                      key={props.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-white rounded-xl overflow-hidden border ${
                        props.posts_Images?.length > 0 ? "p-2" : "p-3"
                      } ${
                        !props.posts_Images?.length && index % 2 === 0
                          ? "md:col-span-2"
                          : ""
                      }`}
                    >
                      {/* IMAGE CONTAINER */}
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
                          {props.posts_Images
                            .slice(0, 3)
                            .map((image: string, index: number) => (
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

                      {/* TEXT & DETAILS */}
                      <div className="p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {props.createdTime.split("T")[0]}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>•</span>
                            {moment(props.createdTime).fromNow()}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                          {props.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-gray-500"
                            ></motion.button>
                            <span className="text-sm text-gray-500">
                              {props?.likes?.length || 0} Likes
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {props.comments?.length || 0} Comments
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed rounded-xl bg-gray-50 md:col-span-2"
                >
                  <div className="mb-3">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="5" width="18" height="14" rx="3" className="fill-orange-50 stroke-orange-300" strokeWidth="1.5" />
                      <path d="M7 12h6M7 9h10M7 15h10" className="stroke-orange-400" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">No community posts yet</h4>
                  <p className="mt-1 text-xs text-gray-600 max-w-sm">
                    Share updates with your audience by creating your first post.
                  </p>
                </motion.div>
              )}
            </div>

            <CreatePostModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </>
      )}
      <CommunityModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        onSend={handlecreateCommunity}
      />
    </div>
  );
}
