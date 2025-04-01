"use client";

import type React from "react";

import { useRef, useCallback, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CiVideoOn } from "react-icons/ci";
import { FaYoutube } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

interface VideoUploaderProps {
  youtubeUrl: string;
  youtubeEmbedUrl: string;
  showYoutubeInput: boolean;
  setYoutubeUrl: React.Dispatch<React.SetStateAction<string>>;
  setYoutubeEmbedUrl: React.Dispatch<React.SetStateAction<string>>;
  setShowYoutubeInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VideoUploader({
  youtubeUrl,
  youtubeEmbedUrl,
  showYoutubeInput,
  setYoutubeUrl,
  setYoutubeEmbedUrl,
  setShowYoutubeInput,
}: VideoUploaderProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Handle drag over event
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle video upload
  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.includes("video")) {
        // Handle video file upload logic here
        console.log("Video file uploaded:", file.name);
      } else {
        alert("Please upload a valid video file");
      }
    }
  };

  // Handle YouTube URL
  const handleYoutubeSubmit = () => {
    if (youtubeUrl) {
      let videoId = "";

      // Extract video ID from different YouTube URL formats
      if (youtubeUrl.includes("youtube.com/watch?v=")) {
        videoId = youtubeUrl.split("v=")[1].split("&")[0];
      } else if (youtubeUrl.includes("youtu.be/")) {
        videoId = youtubeUrl.split("youtu.be/")[1].split("?")[0];
      }

      if (videoId) {
        setYoutubeEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
        setShowYoutubeInput(false);
      } else {
        alert("Invalid YouTube URL");
      }
    }
  };

  // Remove YouTube video
  const removeYoutubeVideo = () => {
    setYoutubeUrl("");
    setYoutubeEmbedUrl("");
  };

  return (
    <motion.div
      className="bg-white p-5 rounded-lg shadow space-y-4"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center space-x-2">
        <h2 className="text-lg font-semibold">Product Video (Optional)</h2>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowYoutubeInput(true)}
        >
          <FaYoutube size={30} className="mr-1 text-red-600" />
          <h4 className="text-blue-600">Add youtube video</h4>
        </div>
      </div>

      {!youtubeEmbedUrl ? (
        <div
          className="border-dashed border-2 border-orange-500 p-5 rounded-lg text-center space-y-2 cursor-pointer"
          onClick={() => videoInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const file = e.dataTransfer.files[0];
              if (file.type.includes("video")) {
                console.log("Video dropped:", file.name);
              } else {
                alert("Please upload a valid video file");
              }
            }
          }}
        >
          <CiVideoOn size={40} className="mx-auto text-gray-400" />
          <p>Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">MP4, WebM, Ogg up to 100MB</p>
          <motion.input
            type="file"
            ref={videoInputRef}
            className="hidden"
            accept="video/*"
            onChange={handleVideoUpload}
          />
        </div>
      ) : (
        <div className="relative pt-4">
          <motion.button
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            onClick={removeYoutubeVideo}
          >
            <IoMdClose size={14} />
          </motion.button>
          <iframe
            width="100%"
            height="200"
            src={youtubeEmbedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      )}

      <AnimatePresence>
        {showYoutubeInput && (
          <motion.div
            className="mt-2 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Paste YouTube URL here"
                className="flex-1 p-2 border rounded outline-orange-500 border-orange-500"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={handleYoutubeSubmit}
              >
                Add
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
                onClick={() => setShowYoutubeInput(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
