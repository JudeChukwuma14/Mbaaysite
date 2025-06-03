"use client";

import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { get_single_vendor } from "@/utils/vendorApi";
import { uploadVendorProduct } from "@/utils/VendorProductApi";
import { toast } from "react-hot-toast";
import type { RootState } from "@/redux/store";
import CategorySelector from "./CategorySelector";
import CategorySpecificUI from "./categorySpecificUi";
import DescriptionSection from "./descriptionSection";
import ImageUploader from "./imageUploader";
import VideoUploader from "./Video-Uploader";
import CurrencyInput from "./CurrencyInput";
import ReturnPolicyPopup from "./ReturnPolicyPopup";

interface ProductData {
  productName: string;
  description: string;
  descriptionFileName: string;
  activeCategory: string;
  subCategory: string;
  subSubCategory: string;
  quantity: string;
  sku: string;
  price: string;
  vendorCountry?: string;
  imagePreviewUrls: string[];
  youtubeUrl: string;
  youtubeEmbedUrl: string;
  uploadedVideoInfo: {
    name?: string;
    size?: number;
    type?: string;
    thumbnailUrl?: string;
    file?: File;
  } | null;
  selectedCategories: string[];
  productImages?: File[];
}

const NewProduct = () => {
  const user = useSelector((state: RootState) => state.vendor);

  // Fetch vendor data with real-time updates
  const { data: vendors, isLoading: vendorLoading } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
    refetchOnWindowFocus: true, // Refetch when window gains focus
    staleTime: 0, // Always consider data stale to ensure fresh data
  });

  const subCategories: Record<string, string[]> = {
    "Beauty and Wellness": ["Skincare", "Haircare", "Makeup", "Fragrance"],
    "Jewelry and Gemstones": ["Necklaces", "Rings", "Earrings", "Bracelets"],
    "Books and Poetry": ["Fiction", "Non-fiction", "Poetry", "Academic"],
    "Home Décor and Accessories": [
      "Wall Art",
      "Furniture",
      "Lighting",
      "Textiles",
    ],
    "Vintage Stocks": [
      "Clothing",
      "Accessories",
      "Collectibles",
      "Memorabilia",
    ],
    "Plant and Seeds": [
      "Indoor Plants",
      "Outdoor Plants",
      "Seeds",
      "Gardening Tools",
    ],
    "Spices, Condiments, and Seasonings": [
      "Herbs",
      "Spices",
      "Condiments",
      "Blends",
    ],
    "Local & Traditional Foods": [
      "Snacks",
      "Beverages",
      "Preserves",
      "Staples",
    ],
    "Traditional Clothing & Fabrics": [
      "Men's Wear",
      "Women's Wear",
      "Fabrics",
      "Accessories",
    ],
  };

  const defaultCategory = "Beauty and Wellness";
  const defaultSubCategory = subCategories[defaultCategory][0];

  const [productName, setProductName] = useState("");
  const [value, setValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [descriptionFileName, setDescriptionFileName] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState<{
    name?: string;
    size?: number;
    type?: string;
    thumbnailUrl?: string;
    file?: File;
  } | null>(null);
  const [showReturnPolicyPopup, setShowReturnPolicyPopup] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [vendorCountry, setVendorCountry] = useState("United States");

  const returnPolicyRef = useRef<HTMLInputElement>(null);

  // Get vendor plan from the fetched vendor data
  const vendorPlan = vendors?.vendorPlan || "Starter";

  // Determine if vendor is upgraded based on their plan
  const isUpgraded =
    vendorPlan === "Shelf" ||
    vendorPlan === "Counter" ||
    vendorPlan === "Shop" ||
    vendorPlan === "Premium";

  const categoryThemes: Record<
    string,
    { primary: string; secondary: string; accent: string }
  > = {
    "Beauty and Wellness": {
      primary: "pink-500",
      secondary: "pink-100",
      accent: "pink-700",
    },
    "Jewelry and Gemstones": {
      primary: "purple-500",
      secondary: "purple-100",
      accent: "purple-700",
    },
    "Books and Poetry": {
      primary: "blue-500",
      secondary: "blue-100",
      accent: "blue-700",
    },
    "Home Décor and Accessories": {
      primary: "yellow-500",
      secondary: "yellow-100",
      accent: "yellow-700",
    },
    "Vintage Stocks": {
      primary: "red-500",
      secondary: "red-100",
      accent: "red-700",
    },
    "Plant and Seeds": {
      primary: "green-500",
      secondary: "green-100",
      accent: "green-700",
    },
    "Spices, Condiments, and Seasonings": {
      primary: "orange-500",
      secondary: "orange-100",
      accent: "orange-700",
    },
    "Local & Traditional Foods": {
      primary: "amber-500",
      secondary: "amber-100",
      accent: "amber-700",
    },
    "Traditional Clothing & Fabrics": {
      primary: "indigo-500",
      secondary: "indigo-100",
      accent: "indigo-700",
    },
  };

  // Initialize categories and active category based on vendor plan and craft categories
  useEffect(() => {
    if (
      vendors &&
      vendors.craftCategories &&
      vendors.craftCategories.length > 0
    ) {
      setSelectedCategories(vendors.craftCategories);
      setActiveCategory(vendors.craftCategories[0]);

      // Set default subcategory for the first category
      const firstCategory = vendors.craftCategories[0];
      if (subCategories[firstCategory]) {
        setSubCategory(subCategories[firstCategory][0]);
      }
    } else if (!isUpgraded) {
      // For non-upgraded users, set default categories
      setSelectedCategories([defaultCategory, "Jewelry and Gemstones"]);
      setActiveCategory(defaultCategory);
      setSubCategory(defaultSubCategory);
    }
  }, [vendors, isUpgraded]);

  useEffect(() => {
    const fetchVendorCountry = async () => {
      try {
        setVendorCountry(vendors?.country || "United States");
      } catch (error) {
        console.error("Error fetching vendor country:", error);
      }
    };
    fetchVendorCountry();
  }, [vendors]);

  useEffect(() => {
    if (
      productName ||
      value ||
      subCategory ||
      quantity !== "0" ||
      sku ||
      price ||
      productImages.length > 0 ||
      youtubeEmbedUrl ||
      uploadedVideoInfo
    ) {
      setIsDirty(true);
    }
  }, [
    productName,
    value,
    subCategory,
    quantity,
    sku,
    price,
    productImages,
    youtubeEmbedUrl,
    uploadedVideoInfo,
  ]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("productDraft");
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft) as Partial<ProductData>;
        if (draftData.productName) setProductName(draftData.productName);
        if (draftData.description) setValue(draftData.description);
        if (draftData.descriptionFileName)
          setDescriptionFileName(draftData.descriptionFileName);
        if (draftData.activeCategory)
          setActiveCategory(draftData.activeCategory);
        if (draftData.subCategory) setSubCategory(draftData.subCategory);
        if (draftData.subSubCategory)
          setSubSubCategory(draftData.subSubCategory);
        if (draftData.quantity) setQuantity(draftData.quantity);
        if (draftData.sku) setSku(draftData.sku);
        if (draftData.price) setPrice(draftData.price);
        if (draftData.vendorCountry) setVendorCountry(draftData.vendorCountry);
        if (draftData.youtubeUrl) setYoutubeUrl(draftData.youtubeUrl);
        if (draftData.youtubeEmbedUrl)
          setYoutubeEmbedUrl(draftData.youtubeEmbedUrl);
        if (draftData.uploadedVideoInfo)
          setUploadedVideoInfo(draftData.uploadedVideoInfo);
        if (draftData.imagePreviewUrls && draftData.imagePreviewUrls.length > 0)
          setImagePreviewUrls(draftData.imagePreviewUrls);
        if (
          draftData.selectedCategories &&
          draftData.selectedCategories.length > 0
        )
          setSelectedCategories(draftData.selectedCategories);
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  const handleCategoryChange = (category: string) => {
    if (category && selectedCategories.includes(category)) {
      setActiveCategory(category);
      const firstSubCategory = subCategories[category]?.[0] || "";
      setSubCategory(firstSubCategory);
      setSubSubCategory("");
    }
  };

  const handleDescriptionFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "text/plain") {
        setDescriptionFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) setValue(event.target.result as string);
        };
        reader.readAsText(file);
      } else {
        toast.error("Please upload a .txt file for description");
      }
    }
  };

  const removeDescriptionFile = () => setDescriptionFileName("");

  const handleVideoInfoUpdate = (
    info: {
      name?: string;
      size?: number;
      type?: string;
      thumbnailUrl?: string;
      file?: File;
    } | null
  ) => {
    setUploadedVideoInfo(info);
  };

  const saveDraft = () => {
    setIsLoading(true);

    try {
      if (!productName.trim()) throw new Error("Product name is required");
      if (!activeCategory) throw new Error("Please select a category");
      if (!subCategory || subCategory === "")
        throw new Error("Please select a subcategory");
      if (!quantity || isNaN(Number(quantity)))
        throw new Error("Please enter a valid quantity");
      if (Number(quantity) < 0) throw new Error("Quantity cannot be negative");
      const numericPrice = Number(price.replace(/[^0-9.-]+/g, ""));
      if (isNaN(numericPrice)) throw new Error("Please enter a valid price");
      if (productImages.length === 0)
        throw new Error("Please upload at least one product image");

      const draftData: Partial<ProductData> = {
        productName,
        description: value,
        descriptionFileName,
        activeCategory,
        subCategory,
        subSubCategory,
        quantity,
        sku,
        price,
        vendorCountry,
        youtubeUrl,
        youtubeEmbedUrl,
        uploadedVideoInfo,
        imagePreviewUrls,
        selectedCategories,
        productImages: productImages,
      };
      localStorage.setItem("productDraft", JSON.stringify(draftData));
      toast.success("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save draft. Please fill all required fields."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    if (isDirty) setShowDiscardConfirm(true);
    else discardChanges();
  };

  const discardChanges = () => {
    localStorage.removeItem("productDraft");
    setProductName("");
    setValue("");
    setDescriptionFileName("");
    setActiveCategory(selectedCategories[0] || defaultCategory);
    setSubCategory(
      subCategories[selectedCategories[0] || defaultCategory]?.[0] ||
        defaultSubCategory
    );
    setSubSubCategory("");
    setQuantity("0");
    setSku("");
    setPrice("");
    setProductImages([]);
    setImagePreviewUrls([]);
    setYoutubeUrl("");
    setYoutubeEmbedUrl("");
    setUploadedVideoInfo(null);
    toast.success("Changes discarded successfully");
  };

  const handleSaveDraft = () => saveDraft();

  const resetForm = () => {
    setProductName("");
    setValue("");
    setDescriptionFileName("");
    setActiveCategory(selectedCategories[0] || defaultCategory);
    setSubCategory(
      subCategories[selectedCategories[0] || defaultCategory]?.[0] ||
        defaultSubCategory
    );
    setSubSubCategory("");
    setQuantity("0");
    setSku("");
    setPrice("");
    setProductImages([]);
    setImagePreviewUrls([]);
    setYoutubeUrl("");
    setYoutubeEmbedUrl("");
    setUploadedVideoInfo(null);
    setIsDirty(false);
  };

  const handleAddProduct = async () => {
    if (!vendors?.returnPolicy) {
      setShowReturnPolicyPopup(true);
      return;
    }

    setIsLoading(true);

    try {
      if (!productName.trim()) throw new Error("Product name is required");
      if (!activeCategory) throw new Error("Please select a category");
      if (!subCategory || subCategory === "")
        throw new Error("Please select a subcategory");
      if (!quantity || isNaN(Number(quantity)))
        throw new Error("Please enter a valid quantity");
      if (Number(quantity) < 0) throw new Error("Quantity cannot be negative");
      const numericPrice = Number(price.replace(/[^0-9.-]+/g, ""));
      if (isNaN(numericPrice)) throw new Error("Please enter a valid price");
      if (productImages.length === 0)
        throw new Error("Please upload at least one product image");

      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", value);
      formData.append("category", activeCategory);
      formData.append("sub_category", subCategory);
      formData.append("sub_category2", subSubCategory);
      formData.append("inventory", quantity);
      formData.append("price", numericPrice.toString());

      productImages.forEach((image) => {
        formData.append("images", image);
      });

      if (uploadedVideoInfo?.file) {
        formData.append("upload_type", "upload");
        formData.append("product_video", uploadedVideoInfo.file);
      } else if (youtubeEmbedUrl) {
        formData.append("upload_type", "link");
        formData.append("product_video", youtubeEmbedUrl);
      }

      await uploadVendorProduct(user.token ?? "", formData);
      localStorage.removeItem("productDraft");
      toast.success("Product added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentTheme = () => {
    if (!activeCategory)
      return {
        primary: "orange-500",
        secondary: "orange-100",
        accent: "orange-700",
      };
    return categoryThemes[activeCategory];
  };

  // Show loading state while vendor data is being fetched
  if (vendorLoading) {
    return (
      <div className="min-h-screen p-6 space-y-6 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor information...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-6 space-y-6 bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
        <div>
          <h1 className="text-2xl font-bold">New Product</h1>
          <p className="text-sm text-gray-500">
            Current Plan:{" "}
            <span className="font-medium text-blue-600">{vendorPlan}</span>
            {isUpgraded && vendors?.craftCategories && (
              <span className="ml-2">
                | Categories: {vendors.craftCategories.join(", ")}
              </span>
            )}
          </p>
        </div>
        {selectedCategories.length > 0 && !isUpgraded && (
          <CategorySelector
            selectedCategories={selectedCategories}
            activeCategory={activeCategory}
            handleCategoryChange={handleCategoryChange}
            vendorPlan={
              vendorPlan as "Shelves" | "Counter" | "Shop" | "Premium"
            }
            selectedSubCategory={subCategory}
            setSelectedSubCategory={setSubCategory}
            selectedSubSubCategory={subSubCategory}
            setSelectedSubSubCategory={setSubSubCategory}
          />
        )}
      </div>

      {!isUpgraded && activeCategory && (
        <CategorySpecificUI
          activeCategory={activeCategory}
          getCurrentTheme={getCurrentTheme}
        />
      )}

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DescriptionSection
              productName={productName}
              value={value}
              descriptionFileName={descriptionFileName}
              setProductName={setProductName}
              setValue={setValue}
              removeDescriptionFile={removeDescriptionFile}
              handleDescriptionFileUpload={handleDescriptionFileUpload}
            />
            <ImageUploader
              productImages={productImages}
              imagePreviewUrls={imagePreviewUrls}
              setProductImages={setProductImages}
              setImagePreviewUrls={setImagePreviewUrls}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Categories and Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isUpgraded ? (
              <CategorySelector
                selectedCategories={selectedCategories}
                activeCategory={activeCategory}
                handleCategoryChange={handleCategoryChange}
                vendorPlan={
                  vendorPlan as "Shelves" | "Counter" | "Shop" | "Premium"
                }
                selectedSubCategory={subCategory}
                setSelectedSubCategory={setSubCategory}
                selectedSubSubCategory={subSubCategory}
                setSelectedSubSubCategory={setSubSubCategory}
              />
            ) : (
              <motion.div
                className="bg-white p-4 rounded-lg border space-y-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-lg font-semibold">Subcategory</h2>
                <motion.select
                  className="w-full p-2 border rounded outline-orange-500 border-orange-500"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  required
                >
                  {activeCategory &&
                    subCategories[activeCategory]?.map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                </motion.select>
              </motion.div>
            )}

            <VideoUploader
              youtubeUrl={youtubeUrl}
              youtubeEmbedUrl={youtubeEmbedUrl}
              showYoutubeInput={showYoutubeInput}
              setYoutubeUrl={setYoutubeUrl}
              setYoutubeEmbedUrl={setYoutubeEmbedUrl}
              setShowYoutubeInput={setShowYoutubeInput}
              onVideoInfoUpdate={handleVideoInfoUpdate}
              uploadedVideoInfo={uploadedVideoInfo}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Inventory and Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-medium">Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="w-full p-2 border rounded outline-orange-500 border-orange-500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    SKU (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="SKU"
                    className="w-full p-2 border rounded outline-orange-500 border-orange-500"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Pricing</h3>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Price
                </label>
                <CurrencyInput
                  value={price}
                  onChange={setPrice}
                  country={vendors?.country}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex justify-end space-x-4">
        <button
          className="px-4 py-2 text-red-500 border border-orange-500 rounded-lg"
          onClick={handleDiscard}
          disabled={isLoading}
        >
          Discard
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
          onClick={handleSaveDraft}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Draft"
          )}
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
          onClick={handleAddProduct}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding...
            </>
          ) : (
            "Add Product"
          )}
        </button>
      </div>

      <AnimatePresence>
        {showReturnPolicyPopup && (
          <ReturnPolicyPopup
            showReturnPolicyPopup={showReturnPolicyPopup}
            setShowReturnPolicyPopup={setShowReturnPolicyPopup}
            returnPolicyRef={returnPolicyRef}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDiscardConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg max-w-md w-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-red-500">
                    Discard Changes?
                  </h2>
                  <p className="mt-2 text-gray-600">
                    You have unsaved changes. Are you sure you want to discard
                    them? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700"
                    onClick={() => setShowDiscardConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={() => {
                      setShowDiscardConfirm(false);
                      discardChanges();
                    }}
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewProduct;
