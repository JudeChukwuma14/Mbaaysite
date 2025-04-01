"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

// Define types for our category structure
interface SubSubCategory {
  name: string;
}

interface SubCategory {
  name: string;
  subSubCategories: SubSubCategory[];
}

interface MainCategory {
  name: string;
  subCategories: SubCategory[];
}

interface CategorySelectorProps {
  selectedCategories: string[]; // Array of selected category names
  activeCategory: string;
  handleCategoryChange: (category: string) => void;
  vendorPlan?: "Shelves" | "Counter" | "Shop" | "Premium";
  categoryData?: MainCategory[];
}

export default function CategorySelector({
  selectedCategories,
  activeCategory,
  handleCategoryChange,
  vendorPlan = "Shelves",
  categoryData = [
    {
      name: "Beauty and Wellness",
      subCategories: [
        {
          name: "Skincare",
          subSubCategories: [
            { name: "Natural Soaps" },
            { name: "Body Butters" },
            { name: "Face Masks" },
            { name: "Facial Oils and Serums" },
            { name: "Scrubs and Exfoliants" },
          ],
        },
        {
          name: "Haircare",
          subSubCategories: [
            { name: "Natural Shampoos and Conditioners" },
            { name: "Hair Oils and Treatments" },
            { name: "Herbal Hair Masks" },
            { name: "Combs and Brushes" },
            { name: "Scalp Treatments" },
          ],
        },
        {
          name: "Body Care",
          subSubCategories: [
            { name: "Herbal Bath Products" },
            { name: "Body Lotions and Creams" },
            { name: "Deodorants and Antiperspirants" },
            { name: "Sunscreens and Sunblocks" },
          ],
        },
        {
          name: "Makeup",
          subSubCategories: [
            { name: "Natural Foundations and Powders" },
            { name: "Lip Balms and Lipsticks" },
            { name: "Eye Makeup" },
            { name: "Blushes and Bronzers" },
          ],
        },
        {
          name: "Fragrances",
          subSubCategories: [
            { name: "Essential Oils" },
            { name: "Natural Perfumes" },
            { name: "Incense and Smudge Sticks" },
            { name: "Scented Candles" },
          ],
        },
      ],
    },
    {
      name: "Jewelry and Gemstones",
      subCategories: [
        {
          name: "Handmade Jewelry",
          subSubCategories: [
            { name: "Necklaces" },
            { name: "Bracelets" },
            { name: "Rings" },
            { name: "Earrings" },
            { name: "Anklets" },
            { name: "Brooches & Pins" },
            { name: "Custom Jewelry" },
          ],
        },
        {
          name: "Gemstones",
          subSubCategories: [
            { name: "Precious Gemstones" },
            { name: "Semi-precious Gemstones" },
            { name: "Raw Gemstones" },
            { name: "Cut & Polished Gemstones" },
            { name: "Gemstone Beads" },
          ],
        },
        {
          name: "Jewelry Materials",
          subSubCategories: [
            { name: "Metal Jewelry" },
            { name: "Beadwork Jewelry" },
            { name: "Wire Jewelry" },
            { name: "Leather Jewelry" },
            { name: "Wooden Jewelry" },
          ],
        },
      ],
    },
    {
      name: "Books and Poetry",
      subCategories: [
        {
          name: "Cultural and Ethnic Studies",
          subSubCategories: [
            { name: "Books on Indigenous Cultures" },
            { name: "Ethnographic Studies" },
            { name: "African, Asian, and Native American Heritage" },
            { name: "Cultural Identity and Diaspora Experiences" },
          ],
        },
        {
          name: "Traditional and Folk Literature",
          subSubCategories: [
            { name: "Folktales and Myths from Various Regions" },
            { name: "Oral Traditions and Storytelling" },
            { name: "Epic Poems and Legendary Tales" },
            { name: "Traditional Proverbs and Sayings" },
          ],
        },
        {
          name: "Poetry",
          subSubCategories: [
            { name: "Indigenous and Tribal Poetry" },
            { name: "Contemporary Poems by Diaspora Writers" },
            { name: "Traditional Poetic Forms" },
            { name: "Bilingual Poetry Collections" },
            { name: "Poetry about Migration and Identity" },
          ],
        },
      ],
    },
  ],
}: CategorySelectorProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] =
    useState<string>("");
  const isUpgraded =
    vendorPlan === "Counter" ||
    vendorPlan === "Shop" ||
    vendorPlan === "Premium";

  // Find the active main category object
  const activeCategoryObj = categoryData.find(
    (cat) => cat.name === activeCategory
  );

  // Reset subcategory when active category changes
  useEffect(() => {
    setSelectedSubCategory("");
    setSelectedSubSubCategory("");
  }, [activeCategory]);

  // Reset sub-subcategory when subcategory changes
  useEffect(() => {
    setSelectedSubSubCategory("");
  }, [selectedSubCategory]);

  // If vendor hasn't upgraded, show the dropdown filter
  if (!isUpgraded) {
    return (
      <div className="relative">
        <motion.select
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={activeCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">Filter by Category</option>
          {selectedCategories.map((cat: any) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </motion.select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    );
  }

  // For upgraded vendors, show the new category selection UI
  return (
    <div className="bg-white p-5 rounded-lg shadow w-full">
      <h2 className="text-2xl font-bold mb-4">Category</h2>
      <div className="border rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Product Category</label>
          <motion.input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={activeCategory}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">{activeCategory}</label>
          <div className="relative">
            <motion.select
              className="w-full p-3 border rounded-lg appearance-none pr-10"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              <option value="">Select Subcategory</option>
              {activeCategoryObj?.subCategories.map((subCat) => (
                <option key={subCat.name} value={subCat.name}>
                  {subCat.name}
                </option>
              ))}
            </motion.select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>

        {selectedSubCategory && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {selectedSubCategory}
            </label>
            <div className="relative">
              <motion.select
                className="w-full p-3 border rounded-lg appearance-none pr-10"
                value={selectedSubSubCategory}
                onChange={(e) => setSelectedSubSubCategory(e.target.value)}
              >
                <option value="">Select {selectedSubCategory} Type</option>
                {activeCategoryObj?.subCategories
                  .find((subCat) => subCat.name === selectedSubCategory)
                  ?.subSubCategories.map((subSubCat) => (
                    <option key={subSubCat.name} value={subSubCat.name}>
                      {subSubCat.name}
                    </option>
                  ))}
              </motion.select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
