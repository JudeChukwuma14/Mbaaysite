import { Filter, Grid, Columns } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type React from "react";

interface FiltersPanelProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  viewMode: "masonry" | "grid";
  setViewMode: (mode: "masonry" | "grid") => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const categories = [
  { id: "all", name: "All Artworks" },
  { id: "portrait", name: "Portraits" },
  { id: "landscape", name: "Landscapes" },
  { id: "abstract", name: "Abstract" },
  { id: "modern", name: "Modern" },
  { id: "photography", name: "Photography" },
];

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  activeCategory,
  setActiveCategory,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
  priceRange,
  setPriceRange,
}) => {
  return (
    <div className="flex flex-col items-start justify-between mb-8 space-y-4 lg:flex-row lg:items-center lg:space-y-0">
      <div className="flex w-full pb-2 space-x-4 overflow-x-auto hide-scrollbar lg:w-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              activeCategory === category.id
                ? "text-gray-900 font-medium border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded ${showFilters ? "bg-gray-100" : "hover:bg-gray-50"}`}
        >
          <Filter className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
        >
          <Grid className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => setViewMode("masonry")}
          className={`p-2 rounded ${viewMode === "masonry" ? "bg-gray-100" : "hover:bg-gray-50"}`}
        >
          <Columns className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full p-6 mb-8 bg-white border border-gray-200 rounded-lg"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <h3 className="mb-3 text-sm font-medium">Price Range</h3>
                <div className="flex items-center mb-3 space-x-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-24 p-2 text-sm border border-gray-300 rounded"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 5000])}
                    className="w-24 p-2 text-sm border border-gray-300 rounded"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium">Medium</h3>
                <div className="space-y-2">
                  {["Oil on canvas", "Watercolor", "Digital art", "Mixed media", "Acrylic"].map((medium) => (
                    <label key={medium} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">{medium}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium">Year</h3>
                <select className="w-full p-2 text-sm border border-gray-300 rounded">
                  <option value="">All years</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FiltersPanel;