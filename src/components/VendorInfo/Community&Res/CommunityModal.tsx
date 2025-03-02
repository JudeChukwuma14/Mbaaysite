"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowLeft, ImageIcon } from "lucide-react"
import { create_community } from "@/utils/communityApi"
import { useSelector } from "react-redux"

interface CommunityModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (name: string, description: string, image: any) => void}

export default function CommunityModal({ isOpen, onClose, onSend }: CommunityModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const user = useSelector((state: any) => state.vendor)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!image) {
      alert("Please upload an image before submitting.")
      return
    }
  
    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
  
    if (image) {
      formData.append("community_Images", image)  // Ensure image is not null
    }
  
    const token = user?.token || null
  
    try {
      await create_community(token, formData)
      onSend(name, description, image)
      resetForm()
      onClose()
    } catch (error) {
      console.error("Failed to create community:", error)
      alert("Failed to create community. Please try again.")
    }
  }
  
  const resetForm = () => {
    setName("")
    setDescription("")
    setImage(null)
    setImagePreview(null)
    setStep(1)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() === "" || description.trim() === "") {
      return // Don't proceed if required fields are empty
    }
    setStep(2)
  }

  const handlePreviousStep = () => {
    setStep(1)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 left-1/3 top-1/4"
          >
            <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="bg-white rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  {step === 2 && (
                    <motion.button
                      type="button"
                      onClick={handlePreviousStep}
                      className="mr-2 text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                  )}
                  <h2 className="text-lg font-semibold">
                    {step === 1 ? "Create Community" : "Upload Community Image"}
                  </h2>
                </div>
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 transition-colors hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-4 space-y-4">
                {step === 1 ? (
                  <>
                    <div>
                      <h1 className="mb-3 font-bold text-bold">Name:</h1>
                      <input
                        type="text"
                        placeholder="Community Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <h1 className="mb-3 font-bold text-bold">Description:</h1>
                      <textarea
                        placeholder="Type your description here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 text-sm border rounded-lg resize-none bg-gray-50 focus:outline-none"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <h1 className="mb-3 font-bold text-bold">Community Image:</h1>
                    <div
                      onClick={triggerFileInput}
                      className="flex flex-col items-center justify-center p-6 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-orange-500"
                    >
                      {imagePreview ? (
                        <div className="flex flex-col items-center w-full">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Community preview"
                            className="object-cover w-32 h-32 mb-2 rounded-lg"
                          />
                          <p className="text-sm text-gray-500">Click to change image</p>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-12 h-12 mb-2 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                      <motion.input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 p-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B00] hover:bg-[#FF6B00] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                {step === 1 ? (
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B00] hover:bg-orange-300 rounded-lg transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!image}
                    className={`px-4 py-2 text-sm font-medium text-white bg-[#FF6B00] hover:bg-orange-300 rounded-lg transition-colors ${
                      !image ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Create
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

