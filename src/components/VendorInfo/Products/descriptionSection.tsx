"use client";

import type React from "react";

import { useRef } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface DescriptionSectionProps {
  productName: string;
  value: string;
  descriptionFileName: string;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  removeDescriptionFile: () => void;
  handleDescriptionFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DescriptionSection({
  productName,
  value,
  descriptionFileName,
  setProductName,
  setValue,
  removeDescriptionFile,
  handleDescriptionFileUpload,
}: DescriptionSectionProps) {
  const descriptionFileRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      className="bg-white p-5 rounded-lg shadow space-y-4 h-[500px] flex flex-col"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-semibold">Description</h2>
      <input
        type="text"
        placeholder="Product Name"
        className="w-full p-2 border rounded outline-orange-500 border-orange-500"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-600">Product Description</label>
          <button
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={() => descriptionFileRef.current?.click()}
          >
            Upload .txt file
          </button>
          <motion.input
            type="file"
            ref={descriptionFileRef}
            className="hidden"
            accept=".txt"
            onChange={handleDescriptionFileUpload}
          />
        </div>

        {descriptionFileName && (
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="text-sm truncate">{descriptionFileName}</span>
            <motion.button
              className="text-red-500 hover:text-red-700"
              onClick={removeDescriptionFile}
            >
              <IoMdClose />
            </motion.button>
          </div>
        )}

        <div className="flex-grow overflow-hidden h-[350px]">
          <ReactQuill
            theme="snow"
            placeholder="Product Description"
            value={value}
            onChange={setValue}
            className="border outline-orange-500 border-orange-500 h-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
