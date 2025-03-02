"use client"

import type React from "react"

import { createPost } from "@/utils/communityApi"
import { motion, AnimatePresence } from "framer-motion"
import { X, Smile, ImageIcon, MapPin, User, XCircle } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
import { useQuery } from "@tanstack/react-query"
import { get_single_vendor } from "@/utils/vendorApi"
// import { LoadScript } from "@react-google-maps/api"
// import GooglePlacesAutocomplete from "react-google-autocomplete"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

// interface ApiError {
//   response?: {
//     data?: {
//       message?: string
//     }
//   }
// }

interface TaggedUser {
  id: string
  name: string
}

const userSuggestions = [
  { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
]

// const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([])
  const [showTagInput, setShowTagInput] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [location, setLocation] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  interface RootState {
    vendor: {
      token: string;
      vendor:any;
    };
  }

  const user = useSelector((state: RootState) => state.vendor)


  const posts = useQuery({ queryKey: ['posts'], queryFn: () => get_single_vendor(user.token) })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // const isApiError = (error: unknown): error is ApiError => {
  //   return (
  //     typeof error === "object" &&
  //     error !== null &&
  //     "response" in error &&
  //     typeof (error as ApiError).response === "object"
  //   )
  // }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files)
      setImages((prev) => [...prev, ...newImages])
      const newPreviews = newImages.map((file) => URL.createObjectURL(file))
      setImagesPreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagesPreviews[index])
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTagUser = (user: { id: string; name: string }) => {
    if (!taggedUsers.find((tagged) => tagged.id === user.id)) {
      setTaggedUsers([...taggedUsers, user])
    }
    setTagInput("")
    setShowSuggestions(false)
  }

  const removeTag = (userId: string) => {
    setTaggedUsers(taggedUsers.filter((user) => user.id !== userId))
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji)
  }

  // const handleLocationSelect = (place: google.maps.places.PlaceResult) => {
  //   if (place.formatted_address) {
  //     setLocation(place.formatted_address)
  //   }
  //   setShowLocationPicker(false)
  // }
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast.error("Post content cannot be empty.", {
        position: "top-right",
        autoClose: 4000,
      })
      return
    }
  
    setLoading(true)
  
    try {
      const formData = new FormData()
      formData.append("content", content)
      formData.append("userType", "vendors")
      formData.append("posterId", user.vendor.id)
      
      images.forEach((image) => {
        formData.append("posts_Images", image) 
      })
  
      taggedUsers.forEach((user) => {
        formData.append("tags", user.id)
      })
  
      if (location) {
        formData.append("location", location)
      }
  
      const token = user?.token || null
      await createPost(formData, token)
  
      toast.success("Post created successfully", {
        position: "top-right",
        autoClose: 4000,
      })

      window.location.reload()
  
      setContent("")
      setImages([])
      setImagesPreviews([])
      setTaggedUsers([])
      setLocation("")
      onClose()
    } catch {
      toast.error("Failed to post. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
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
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </motion.button>
              <h2 className="text-lg font-semibold text-center">Create Post</h2>
            </div>

            <div ref={modalContentRef} className="flex-1 overflow-y-auto p-4">
              <form onSubmit={handlePost}>
                <div className="mb-4 flex items-center space-x-3">
                  {/* <img src="/placeholder.svg?height=48&width=48" alt="Profile" className="w-12 h-12 rounded-full" /> */}
                  <div className="w-[50px] h-[50px] bg-orange-500 rounded-full text-white flex items-center justify-center">
                  <p>{posts?.data?.storeName?.charAt(0)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">{posts?.data?.storeName}</h3>
                    <p className="text-sm text-gray-600">{posts?.data?.craftCategories[0]}</p>
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {taggedUsers.map((user) => (
                      <span
                        key={user.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                      >
                        @{user.name}
                        <motion.button type="button" onClick={() => removeTag(user.id)}>
                          <XCircle className="w-4 h-4" />
                        </motion.button>
                      </span>
                    ))}
                  </div>
                )}

                {imagesPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {imagesPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <motion.button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                )}

                {showTagInput && (
                  <div className="mt-2 relative">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value)
                        setShowSuggestions(true)
                      }}
                      placeholder="Tag someone..."
                      className="w-full p-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {showSuggestions && tagInput && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
                        {userSuggestions
                          .filter((user) => user.name.toLowerCase().includes(tagInput.toLowerCase()))
                          .map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleTagUser(user)}
                              className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 text-left"
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

                {location && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}

                {/* {showLocationPicker && (
                  <div className="mt-2">
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                      {typeof google !== "undefined" ? (
                        <GooglePlacesAutocomplete
                          apiKey={GOOGLE_MAPS_API_KEY}
                          onPlaceSelected={handleLocationSelect}
                          options={{
                            types: ["(regions)"],
                          }}
                          style={{
                            input: {
                              width: "100%",
                              padding: "0.5rem",
                              fontSize: "0.875rem",
                              borderRadius: "0.375rem",
                              backgroundColor: "#f3f4f6",
                              border: "none",
                              outline: "none",
                            },
                          }}
                        />
                      ) : (
                        <div>Loading Google Maps...</div>
                      )}
                    </LoadScript>
                  </div>
                )} */}
              </form>
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <div ref={emojiPickerRef} className="relative">
                    <motion.button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      <Smile className="w-6 h-6" />
                    </motion.button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <ImageIcon className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowTagInput(!showTagInput)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <User className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowLocationPicker(!showLocationPicker)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <MapPin className="w-6 h-6" />
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
  )
}

