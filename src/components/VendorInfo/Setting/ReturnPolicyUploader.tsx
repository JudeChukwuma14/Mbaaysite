"use client";

import type React from "react";

import { useRef, useCallback, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

interface ReturnPolicyUploaderProps {
  returnPolicy: File | null;
  returnPolicyName: string;
  setReturnPolicy: React.Dispatch<React.SetStateAction<File | null>>;
  setReturnPolicyName: React.Dispatch<React.SetStateAction<string>>;
  setReturnPolicyText: React.Dispatch<React.SetStateAction<string>>;
}

export default function ReturnPolicyUploader({
  returnPolicy,
  returnPolicyName,
  setReturnPolicy,
  setReturnPolicyName,
  setReturnPolicyText,
}: ReturnPolicyUploaderProps) {
  const returnPolicyRef = useRef<HTMLInputElement>(null);

  // Handle drag over event
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle return policy upload
  const handleReturnPolicyUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "text/plain") {
        setReturnPolicy(file);
        setReturnPolicyName(file.name);

        // Read the file content
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setReturnPolicyText(event.target.result as string);
          }
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a .txt file for return policy");
      }
    }
  };

  // Remove return policy
  const removeReturnPolicy = () => {
    setReturnPolicy(null);
    setReturnPolicyName("");
    setReturnPolicyText("");
  };

  return (
    <motion.div
      className="bg-white p-5 rounded-lg shadow space-y-4"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <h2 className="text-lg font-semibold">Return Policy</h2>

      {!returnPolicy ? (
        <div
          className="border-dashed border-2 border-orange-500 p-5 rounded-lg text-center space-y-2 cursor-pointer"
          onClick={() => returnPolicyRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const file = e.dataTransfer.files[0];
              if (file.type === "text/plain") {
                setReturnPolicy(file);
                setReturnPolicyName(file.name);

                // Read the file content
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) {
                    setReturnPolicyText(event.target.result as string);
                  }
                };
                reader.readAsText(file);
              } else {
                alert("Please upload a .txt file for return policy");
              }
            }
          }}
        >
          <FiUploadCloud size={40} className="mx-auto text-gray-400" />
          <p>Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">
            Upload your return policy (.txt)
          </p>
          <motion.input
            type="file"
            ref={returnPolicyRef}
            className="hidden"
            accept=".txt"
            onChange={handleReturnPolicyUpload}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded mt-2">
          <span className="text-sm truncate">{returnPolicyName}</span>
          <motion.button
            className="text-red-500 hover:text-red-700"
            onClick={removeReturnPolicy}
          >
            <IoMdClose />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
