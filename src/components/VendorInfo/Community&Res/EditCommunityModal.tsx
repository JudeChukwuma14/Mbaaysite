import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ImageIcon, ArrowLeft } from "lucide-react"

interface EditCommunityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, description: string, image: File | null) => void
  initialName: string
  initialDescription: string
  initialImage: string
}

export default function EditCommunityModal({
  isOpen,
  onClose,
  onSave,
  initialName,
  initialDescription,
  initialImage,
}: EditCommunityModalProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setName(initialName)
      setDescription(initialDescription)
      setImagePreview(initialImage)
      setImage(null)
      setStep(1)
    }
  }, [isOpen, initialName, initialDescription, initialImage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(name, description, image)
    onClose()
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

  const triggerFileInput = () => {
    fileInputRef.current?.click()
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed left-1/3 top-[100px] -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
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
                    {step === 1 ? "Edit Community Details" : "Edit Community Image"}
                  </h2>
                </div>
                <motion.button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="p-4 space-y-4">
                {step === 1 ? (
                  <>
                    <div>
                      <h1 className="text-bold font-bold mb-3">Name:</h1>
                      <motion.input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none border"
                        required
                      />
                    </div>
                    <div>
                      <h1 className="text-bold font-bold mb-3">Description:</h1>
                      <motion.textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none resize-none border"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <h1 className="text-bold font-bold mb-3">Community Image:</h1>
                    <div
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors"
                    >
                      {imagePreview ? (
                        <div className="w-full flex flex-col items-center">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Community preview"
                            className="w-32 h-32 object-cover rounded-lg mb-2"
                          />
                          <p className="text-sm text-gray-500">Click to change image</p>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                      <motion.input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
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
                    className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B00] hover:bg-orange-300 rounded-lg transition-colors"
                  >
                    Save Changes
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

