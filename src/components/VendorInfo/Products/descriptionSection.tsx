"use client";

import type React from "react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

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

  // Text formatting functions that replicate text editor functionality
  const handleTextFormatting = (action: string) => {
    const textarea = document.getElementById(
      "product-description"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let newText = value;

    switch (action) {
      case "bold":
        if (selectedText) {
          newText =
            value.substring(0, start) +
            `**${selectedText}**` +
            value.substring(end);
        } else {
          newText =
            value.substring(0, start) + "**bold text**" + value.substring(end);
        }
        break;
      case "italic":
        if (selectedText) {
          newText =
            value.substring(0, start) +
            `*${selectedText}*` +
            value.substring(end);
        } else {
          newText =
            value.substring(0, start) + "*italic text*" + value.substring(end);
        }
        break;
      case "underline":
        if (selectedText) {
          newText =
            value.substring(0, start) +
            `<u>${selectedText}</u>` +
            value.substring(end);
        } else {
          newText =
            value.substring(0, start) +
            "<u>underlined text</u>" +
            value.substring(end);
        }
        break;
      case "bullet":
        const lines = value.split("\n");
        const currentLineIndex =
          value.substring(0, start).split("\n").length - 1;
        lines[currentLineIndex] = "• " + lines[currentLineIndex];
        newText = lines.join("\n");
        break;
      case "numbered":
        const numberedLines = value.split("\n");
        const currentNumberedLineIndex =
          value.substring(0, start).split("\n").length - 1;
        numberedLines[currentNumberedLineIndex] =
          "1. " + numberedLines[currentNumberedLineIndex];
        newText = numberedLines.join("\n");
        break;
      case "link":
        if (selectedText) {
          newText =
            value.substring(0, start) +
            `[${selectedText}](url)` +
            value.substring(end);
        } else {
          newText =
            value.substring(0, start) +
            "[link text](url)" +
            value.substring(end);
        }
        break;
      default:
        break;
    }

    setValue(newText);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          handleTextFormatting("bold");
          break;
        case "i":
          e.preventDefault();
          handleTextFormatting("italic");
          break;
        case "u":
          e.preventDefault();
          handleTextFormatting("underline");
          break;
        default:
          break;
      }
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

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

      <div className="space-y-2 flex-1 flex flex-col">
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

        {/* Textarea with enhanced functionality */}
        <div className="flex-1 flex flex-col">
          <motion.textarea
            id="product-description"
            placeholder="Enter your product description here..."
            className="w-full flex-1 p-3 border rounded outline-orange-500 border-orange-500 resize-none min-h-[200px] font-sans text-sm leading-relaxed"
            value={value}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            style={{ minHeight: "200px" }}
          />
          <div className="text-xs text-gray-500 mt-1 flex justify-between">
            <span>Characters: {value.length}</span>
            <span>
              Words: {value.trim() ? value.trim().split(/\s+/).length : 0}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
