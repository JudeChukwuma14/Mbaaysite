import { useEffect, useState } from "react";

import { categories } from "../mockdata/categoryData";
import { Link } from "react-router-dom";


export default function Dropdown() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  
    const handleMouseEnter = (category: string) => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setActiveCategory(category);
    };

    const handleMouseLeave = () => {
      const timeout = setTimeout(() => setActiveCategory(null), 200);
      setHoverTimeout(timeout);
    };
  

    useEffect(() => {
      return () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
      };
    }, [hoverTimeout]);

  return (
    <div className="hidden md:block">
      <nav>
        <div className="relative z-10 flex items-center justify-center w-full h-8 gap-4 font-medium bg-white">
          {categories.map((category) => (
            <div
              key={category.name}
              className=""
              onClick={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
            >
            <Link to={category.link}>
            <p className="cursor-pointer text-[12px]">{category.name}</p>
            </Link>
              {/* Dropdown Menu */}
              {activeCategory === category.name && (
                <div className="absolute left-0 w-full px-6 py-3 bg-white shadow-lg top-full">
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
                              className="cursor-pointer hover:text-black"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {/* Image at bottom right */}
                    <div className="flex items-end justify-end col-span-1">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="object-cover w-32 h-32"
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
