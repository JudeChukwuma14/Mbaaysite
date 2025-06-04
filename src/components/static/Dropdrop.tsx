

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ChevronUp } from "lucide-react"
import { categories } from "../mockdata/categoryData"

export default function Dropdown() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleToggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category)
    if (hoverTimeout) clearTimeout(hoverTimeout)
  }

  const handleMouseEnter = (category: string) => {
    if (hoverTimeout) clearTimeout(hoverTimeout)
    setActiveCategory(category)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setActiveCategory(null), 300) // Increased timeout for better UX
    setHoverTimeout(timeout as NodeJS.Timeout)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout)
    }
  }, [hoverTimeout])

  return (
    <div className="relative bg-white border-b border-gray-200">
      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <div className="relative flex items-center justify-center w-full h-8 gap-4 font-medium bg-white">
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


      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100"
        >
          <span>Browse Categories</span>
          {mobileMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {mobileMenuOpen && (
          <div className="bg-white shadow-md">
            {categories.map((category) => (
              <div key={category.name} className="border-b border-gray-200">
                <button
                  onClick={() => handleToggleCategory(category.name)}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  aria-expanded={activeCategory === category.name}
                  aria-label={`Toggle ${category.name} subcategories`}
                >
                  <Link to={category.link} onClick={(e) => e.stopPropagation()}>
                    {category.name}
                  </Link>
                  {activeCategory === category.name ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {activeCategory === category.name && (
                  <div className="px-4 py-2 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {category.subcategories.map((sub) => (
                        <div key={sub.title} className="mb-4">
                          <Link
                            to={sub.link}
                            className="text-xs font-semibold text-gray-900 underline hover:text-orange-500"
                          >
                            {sub.title}
                          </Link>
                          <ul className="mt-1 space-y-1">
                            {sub.items.slice(0, 5).map(
                              (
                                item, // Limit items on mobile
                              ) => (
                                <li key={item} className="text-xs text-gray-600 hover:text-orange-500">
                                  <Link to="#">{item}</Link>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="object-cover w-full h-24 rounded-lg sm:h-32"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
