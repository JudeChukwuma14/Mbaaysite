import { useState, useRef, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategorySelector from "./CategorySelector";
import DescriptionSection from "./descriptionSection";
import CategorySpecificUI from "./categorySpecificUi";
import ImageUploader from "./imageUploader";
import VideoUploader from "./Video-Uploader";
import ReturnPolicyPopup from "./ReturnPolicyPopup";


// Import components

const NewProduct = () => {
  const [productName, setProductName] = useState("");
  const [value, setValue] = useState("");
  // Removed unused returnPolicyText state
  const [selectedCategories] = useState<string[]>([
    "Beauty and Wellness",
    "Jewelry and Gemstones",
  ]); // Pre-selected categories from account creation
  const [activeCategory, setActiveCategory] = useState("Beauty and Wellness"); // Default to first category
  const [subCategory, setSubCategory] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [returnPolicy] = useState<File | null>(null);
  // Removed unused returnPolicyName state
  const [descriptionFileName, setDescriptionFileName] = useState("");
  // Removed unused descriptionFile state
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");
  const [showReturnPolicyPopup, setShowReturnPolicyPopup] = useState(false);
  const [vendorPlan] = useState<"Shelves" | "Counter" | "Shop" | "Premium">(
    "Counter"
  ); // Set to Counter or Shop to see the new UI

  // References for file inputs
  const returnPolicyRef = useRef<HTMLInputElement>(null);

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
  const subCategories: {
    "Beauty and Wellness": string[];
    "Jewelry and Gemstones": string[];
    "Books and Poetry": string[];
    "Home Décor and Accessories": string[];
    "Vintage Stocks": string[];
    "Plant and Seeds": string[];
    "Spices, Condiments, and Seasonings": string[];
    "Local & Traditional Foods": string[];
    "Traditional Clothing & Fabrics": string[];
  } = {
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
    // Removed unused descriptionFile state
    setDescriptionFileName("");
  };

  const handleDiscard = () => {
    console.log("Discard remove.");
  };

  const handleSaveDraft = () => {
    console.log("Draft saved.");
  };

  const handleAddProduct = () => {
    if (!returnPolicy) {
      setShowReturnPolicyPopup(true);
      return;
    }
    console.log("Product added.");
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
      className="min-h-screen p-6 space-y-6 bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
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

      {/* Common product form fields */}
      <div className="grid items-start grid-cols-1 gap-6 md:grid-cols-2">
        {/* First Row - Description and Product Images */}
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

        {/* Second Row - Category and Product Video */}
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
            className="p-5 space-y-4 bg-white rounded-lg shadow"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-lg font-semibold">Subcategory</h2>
            <motion.select
              className="w-full p-2 border border-orange-500 rounded outline-orange-500"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="">Select Subcategory</option>
              {activeCategory &&
                subCategories[
                  activeCategory as keyof typeof subCategories
                ]?.map((subCat) => (
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
        />

        {/* Third Row - Return Policy and Inventory */}
        {/* <ReturnPolicyUploader
          returnPolicy={returnPolicy}
          returnPolicyName={returnPolicyName}
          setReturnPolicy={setReturnPolicy}
          setReturnPolicyName={setReturnPolicyName}
          setReturnPolicyText={setReturnPolicyText}
        /> */}

        <motion.div
          className="p-5 space-y-4 bg-white rounded-lg shadow"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-lg font-semibold">Inventory</h2>
          <input
            type="number"
            placeholder="Quantity"
            className="w-full p-2 border border-orange-500 rounded outline-orange-500"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="text"
            placeholder="SKU (Optional)"
            className="w-full p-2 border border-orange-500 rounded outline-orange-500"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </motion.div>

        {/* Fourth Row - Pricing */}
        <motion.div
          className="p-5 space-y-4 bg-white rounded-lg shadow md:col-span-2"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-lg font-semibold">Pricing</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Price"
              className="w-full p-2 border border-orange-500 rounded outline-orange-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Compare at pricing (Optional)"
              className="w-full p-2 border border-orange-500 rounded outline-orange-500"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
            />
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 text-red-500 border border-orange-500 rounded-lg"
          onClick={handleDiscard}
        >
          Discard
        </button>
        <button
          className="px-4 py-2 text-white bg-red-500 rounded-lg"
          onClick={handleSaveDraft}
        >
          Save Draft
        </button>
        <button
          className="px-4 py-2 text-white bg-green-500 rounded-lg"
          onClick={handleAddProduct}
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
    </motion.div>
  );
};

export default NewProduct;
