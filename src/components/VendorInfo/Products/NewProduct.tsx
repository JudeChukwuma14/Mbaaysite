import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import components
import CategorySelector from "./CategorySelector";
import CategorySpecificUI from "./categorySpecificUi";
import DescriptionSection from "./descriptionSection";
import ImageUploader from "./imageUploader";
import VideoUploader from "./Video-Uploader";
import ReturnPolicyPopup from "./ReturnPolicyPopup";

// Define product data interface for saving/loading
interface ProductData {
  productName: string;
  description: string;
  descriptionFileName: string;
  activeCategory: string;
  subCategory: string;
  quantity: string;
  sku: string;
  price: string;
  imagePreviewUrls: string[]; // Store image preview URLs
  youtubeUrl: string;
  youtubeEmbedUrl: string;
  uploadedVideoInfo: {
    name?: string;
    size?: number;
    type?: string;
    thumbnailUrl?: string;
  } | null;
  selectedCategories: string[];
}

const NewProduct = () => {
  // Product form states
  const [productName, setProductName] = useState("");
  const [value, setValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Beauty and Wellness",
    "Jewelry and Gemstones",
  ]); // Pre-selected categories from account creation
  const [activeCategory, setActiveCategory] = useState("Beauty and Wellness"); // Default to first category
  const [subCategory, setSubCategory] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [returnPolicy] = useState<File | null>(null);
  const [descriptionFileName, setDescriptionFileName] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState<{
    name?: string;
    size?: number;
    type?: string;
    thumbnailUrl?: string;
  } | null>(null);
  const [showReturnPolicyPopup, setShowReturnPolicyPopup] = useState(false);
  const [vendorPlan] = useState<"Shelves" | "Counter" | "Shop" | "Premium">(
    "Counter"
  ); // Set to Counter or Shop to see the new UI
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // References for file inputs
  const returnPolicyRef = useRef<HTMLInputElement>(null);

  // Track form changes
  useEffect(() => {
    // Set form as dirty if any field has a value
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

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("productDraft");
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft) as Partial<ProductData>;

        // Restore text fields
        if (draftData.productName) setProductName(draftData.productName);
        if (draftData.description) setValue(draftData.description);
        if (draftData.descriptionFileName)
          setDescriptionFileName(draftData.descriptionFileName);
        if (draftData.activeCategory)
          setActiveCategory(draftData.activeCategory);
        if (draftData.subCategory) setSubCategory(draftData.subCategory);
        if (draftData.quantity) setQuantity(draftData.quantity);
        if (draftData.sku) setSku(draftData.sku);
        if (draftData.price) setPrice(draftData.price);

        // Restore YouTube video data
        if (draftData.youtubeUrl) setYoutubeUrl(draftData.youtubeUrl);
        if (draftData.youtubeEmbedUrl)
          setYoutubeEmbedUrl(draftData.youtubeEmbedUrl);

        // Restore uploaded video info
        if (draftData.uploadedVideoInfo)
          setUploadedVideoInfo(draftData.uploadedVideoInfo);

        // Restore image preview URLs
        if (
          draftData.imagePreviewUrls &&
          draftData.imagePreviewUrls.length > 0
        ) {
          setImagePreviewUrls(draftData.imagePreviewUrls);

          // Note: We can't restore the actual File objects, but we can show the previews
          // The user will need to re-upload the files if they want to submit the form
        }

        // Restore selected categories
        if (
          draftData.selectedCategories &&
          draftData.selectedCategories.length > 0
        ) {
          setSelectedCategories(draftData.selectedCategories);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  // Category color themes
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

  // Subcategories for each main category
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

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    if (category && selectedCategories.includes(category)) {
      setActiveCategory(category);
      setSubCategory("");
    }
  };

  // Handle description file upload
  const handleDescriptionFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "text/plain") {
        setDescriptionFileName(file.name);

        // Read the file content
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setValue(event.target.result as string);
          }
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a .txt file for description");
      }
    }
  };

  // Remove description file
  const removeDescriptionFile = () => {
    setDescriptionFileName("");
  };

  // Handle video info update
  const handleVideoInfoUpdate = (
    info: {
      name?: string;
      size?: number;
      type?: string;
      thumbnailUrl?: string;
    } | null
  ) => {
    setUploadedVideoInfo(info);
  };

  // Save draft to localStorage
  const saveDraft = () => {
    setIsLoading(true);

    try {
      // Create draft object with current form values
      const draftData: Partial<ProductData> = {
        productName,
        description: value,
        descriptionFileName,
        activeCategory,
        subCategory,
        quantity,
        sku,
        price,
        youtubeUrl,
        youtubeEmbedUrl,
        uploadedVideoInfo,
        imagePreviewUrls,
        selectedCategories,
      };

      // Save to localStorage
      localStorage.setItem("productDraft", JSON.stringify(draftData));

      // Show success message or toast
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle discard action
  const handleDiscard = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      discardChanges();
    }
  };

  // Discard changes and reset form
  const discardChanges = () => {
    // Clear localStorage
    localStorage.removeItem("productDraft");

    // Reset form fields
    setProductName("");
    setValue("");
    setDescriptionFileName("");
    setActiveCategory("Beauty and Wellness");
    setSubCategory("");
    setQuantity("0");
    setSku("");
    setPrice("");
    setProductImages([]);
    setImagePreviewUrls([]);
    setYoutubeUrl("");
    setYoutubeEmbedUrl("");
    setUploadedVideoInfo(null);
    setSelectedCategories(["Beauty and Wellness", "Jewelry and Gemstones"]);

    // Show confirmation message
    alert("Changes discarded successfully");
  };

  // Handle save draft button click
  const handleSaveDraft = () => {
    saveDraft();
  };

  // Handle add product button click
  const handleAddProduct = () => {
    if (!returnPolicy) {
      setShowReturnPolicyPopup(true);
      return;
    }

    // Here you would submit the form data to your backend
    console.log("Product added.");

    // Clear the draft after successful submission
    localStorage.removeItem("productDraft");
  };

  // Get current theme based on active category
  const getCurrentTheme = () => {
    if (!activeCategory)
      return {
        primary: "orange-500",
        secondary: "orange-100",
        accent: "orange-700",
      };
    return categoryThemes[activeCategory];
  };

  // Check if vendor has upgraded
  const isUpgraded =
    vendorPlan === "Counter" ||
    vendorPlan === "Shop" ||
    vendorPlan === "Premium";

  return (
    <motion.div
      className="p-6 space-y-6 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with title and category filter */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold">New Product</h1>

        {selectedCategories.length > 0 && !isUpgraded && (
          <CategorySelector
            selectedCategories={selectedCategories}
            activeCategory={activeCategory}
            handleCategoryChange={handleCategoryChange}
            vendorPlan={vendorPlan}
          />
        )}
      </div>

      {/* Category-specific UI */}
      {!isUpgraded && activeCategory && (
        <CategorySpecificUI
          activeCategory={activeCategory}
          getCurrentTheme={getCurrentTheme}
        />
      )}

      {/* Main content area */}
      <div className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description Section */}
            <DescriptionSection
              productName={productName}
              value={value}
              descriptionFileName={descriptionFileName}
              setProductName={setProductName}
              setValue={setValue}
              removeDescriptionFile={removeDescriptionFile}
              handleDescriptionFileUpload={handleDescriptionFileUpload}
            />

            {/* Product Images */}
            <ImageUploader
              productImages={productImages}
              imagePreviewUrls={imagePreviewUrls}
              setProductImages={setProductImages}
              setImagePreviewUrls={setImagePreviewUrls}
            />
          </div>
        </div>

        {/* Section 2: Categories and Media */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Categories and Media
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Selector */}
            {isUpgraded ? (
              <CategorySelector
                selectedCategories={selectedCategories}
                activeCategory={activeCategory}
                handleCategoryChange={handleCategoryChange}
                vendorPlan={vendorPlan}
                categoryData={Object.entries(subCategories).map(
                  ([name, subCategories]) => ({
                    name,
                    subCategories: subCategories.map((subCategory) => ({
                      name: subCategory,
                      subSubCategories: [],
                    })),
                  })
                )}
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
                >
                  <option value="">Select Subcategory</option>
                  {activeCategory &&
                    subCategories[activeCategory]?.map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                </motion.select>
              </motion.div>
            )}

            {/* Video Uploader */}
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

        {/* Section 3: Inventory and Pricing */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Inventory and Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inventory */}
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

            {/* Pricing - Reduced size */}
            <div className="space-y-4">
              <h3 className="font-medium">Pricing</h3>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  placeholder="Price"
                  className="w-full p-2 border rounded outline-orange-500 border-orange-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-4 rounded-lg shadow flex justify-end space-x-4">
        <button
          className="border border-orange-500 text-red-500 px-4 py-2 rounded-lg"
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
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={handleAddProduct}
          disabled={isLoading}
        >
          Add Product
        </button>
      </div>

      {/* Return Policy Popup */}
      <AnimatePresence>
        {showReturnPolicyPopup && (
          <ReturnPolicyPopup
            showReturnPolicyPopup={showReturnPolicyPopup}
            setShowReturnPolicyPopup={setShowReturnPolicyPopup}
            returnPolicyRef={returnPolicyRef}
          />
        )}
      </AnimatePresence>

      {/* Discard Confirmation Dialog */}
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
