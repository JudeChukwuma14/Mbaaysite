import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageIcon, ArrowLeft } from "lucide-react";

interface EditCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, image: File | null) => void;
  initialName: string;
  initialDescription: string;
  initialImage: string;
}

export default function EditCommunityModal({
  isOpen,
  onClose,
  onSave,
  initialName,
  initialDescription,
  initialImage,
}: EditCommunityModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
      setImagePreview(initialImage);
      setImage(null);
      setStep(1);
    }
  }, [isOpen, initialName, initialDescription, initialImage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, description, image);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "" || description.trim() === "") {
      return; // Don't proceed if required fields are empty
    }
    setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-x-4 top-20 bottom-20 md:inset-auto md:top-[10%] md:left-[35%] md:max-w-md w-full md:-translate-x-[50%] bg-white rounded-lg shadow-xl overflow-hidden z-50 flex flex-col max-h-[80vh] md:max-h-[85vh]"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
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
                    {step === 1
                      ? "Edit Community Details"
                      : "Edit Community Image"}
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
            </div>

            <form
              onSubmit={step === 1 ? handleNextStep : handleSubmit}
              className="flex-1 min-h-0 flex flex-col"
            >
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {step === 1 ? (
                  <>
                    <div>
                      <h1 className="mb-3 font-bold text-bold">Name:</h1>
                      <motion.input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <h1 className="mb-3 font-bold text-bold">Description:</h1>
                      <motion.textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 text-sm border rounded-lg resize-none bg-gray-50 focus:outline-none"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <h1 className="mb-3 font-bold text-bold">
                      Community Image:
                    </h1>
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
                          <p className="text-sm text-gray-500">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-12 h-12 mb-2 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">
                            Click to upload image
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
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

              <div className="flex items-center justify-end gap-2 p-4 border-t flex-shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
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
  );
}
