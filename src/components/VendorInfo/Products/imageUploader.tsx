"use client";

import type React from "react";

import { useRef, useCallback, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FiImage } from "react-icons/fi";

interface ImageUploaderProps {
  productImages: File[];
  imagePreviewUrls: string[];
  setProductImages: React.Dispatch<React.SetStateAction<File[]>>;
  setImagePreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ImageUploader({
  productImages,
  imagePreviewUrls,
  setProductImages,
  setImagePreviewUrls,
}: ImageUploaderProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Handle drag over event
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle image drop
  const handleImageDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleImageFiles(e.dataTransfer.files);
      }
    },
    [productImages]
  );

  // Handle image files
  const handleImageFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter((file) =>
      file.type.includes("image")
    );

    if (newFiles.length > 0) {
      setProductImages((prev) => [...prev, ...newFiles]);

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  // Handle image input change
  const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageFiles(e.target.files);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...productImages];
    const newPreviewUrls = [...imagePreviewUrls];

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);

    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setProductImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  // Replace image
  const replaceImage = (index: number) => {
    // Create a new file input and trigger click
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];

        // Revoke old URL to avoid memory leaks
        URL.revokeObjectURL(imagePreviewUrls[index]);

        // Create new preview URL
        const newPreviewUrl = URL.createObjectURL(file);

        // Update arrays
        const newImages = [...productImages];
        const newPreviewUrls = [...imagePreviewUrls];

        newImages[index] = file;
        newPreviewUrls[index] = newPreviewUrl;

        setProductImages(newImages);
        setImagePreviewUrls(newPreviewUrls);
      }
    };
    input.click();
  };

  return (
    <motion.div
      className="bg-white p-5 rounded-lg shadow space-y-4"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-semibold">Product Images</h2>

      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Upload area */}
          <div
            className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer h-40"
            onClick={() => imageInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleImageDrop}
          >
            <FiImage className="w-8 h-8 mb-2" />
            <div className="text-center">
              <p className="text-blue-600 font-medium">Click to upload</p>
              <p className="text-sm text-gray-500">or drag and drop</p>
            </div>
            <motion.input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageInputChange}
            />
          </div>

          {/* Image previews */}
          {imagePreviewUrls.map((url, index) => (
            <div
              key={index}
              className="relative border border-gray-200 rounded-lg overflow-hidden h-40"
            >
              <img
                src={url || "/placeholder.svg"}
                alt={`Product preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex flex-col items-center justify-center opacity-0 hover:opacity-100">
                <button
                  className="bg-white text-gray-800 px-4 py-1 rounded mb-2 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    replaceImage(index);
                  }}
                >
                  Replace
                </button>
                <button
                  className="bg-white text-gray-800 px-4 py-1 rounded text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Empty slots */}
          {imagePreviewUrls.length < 4 &&
            Array.from({ length: 4 - imagePreviewUrls.length }).map(
              (_, index) => (
                <div
                  key={`empty-${index}`}
                  className="border border-dashed border-gray-300 rounded-lg h-40"
                  onClick={() => imageInputRef.current?.click()}
                ></div>
              )
            )}
        </div>
      </div>
    </motion.div>
  );
}
