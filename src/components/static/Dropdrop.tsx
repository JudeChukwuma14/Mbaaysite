import { useEffect, useState } from "react";

import { categories } from "../mockdata/categoryData";
import { Link } from "react-router-dom";


export default function Dropdown() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  
    // Function to set active category
    const handleMouseEnter = (category: string) => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setActiveCategory(category);
    };
  
    // Function to remove active category with delay
    const handleMouseLeave = () => {
      const timeout = setTimeout(() => setActiveCategory(null), 200);
      setHoverTimeout(timeout);
    };
  
    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
      };
    }, [hoverTimeout]);

  return (
    <div className="">
      <nav>
        <div className="flex gap-4 bg-white font-medium h-8 w-full items-center justify-center relative z-10">
          {categories.map((category) => (
            <div
              key={category.name}
              className=""
              onMouseEnter={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
            >
            <Link to={category.link}>
            <p className="cursor-pointer text-[12px]">{category.name}</p>
            </Link>
              {/* Dropdown Menu */}
              {activeCategory === category.name && (
                <div className="absolute left-0 top-full w-full bg-white shadow-lg px-6 py-3">
                  <div className="grid grid-cols-8 gap-6">
                    {category.subcategories.map((sub) => (
                      <div key={sub.title}>
                        <Link to={sub.link}>
                        <span className="font-semibold text-[12px] cursor-pointer mb-2 underline">
                          {sub.title}
                        </span>
                        </Link>
                        <ul className="text-[10px] text-gray-600">
                          {sub.items.map((item) => (
                            <li
                              key={item}
                              className="hover:text-black cursor-pointer"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {/* Image at bottom right */}
                    <div className="col-span-1 flex justify-end items-end">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-32 h-32 object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
