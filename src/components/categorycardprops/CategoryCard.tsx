import React from "react"
import { Link } from "react-router-dom"

interface CategoryCardProps {
  imageSrc: string
  title: string
  link: string
}
const CategoryCard: React.FC<CategoryCardProps> = ({ imageSrc, title, link }) => {
  return (
    <Link to={link} className="block group">
      <div className="flex flex-col items-center min-w-[200px] sm:min-w-[220px] transition-transform duration-300 group-hover:scale-105">
        <div className="relative overflow-hidden transition-shadow duration-300 shadow-lg rounded-xl group-hover:shadow-xl">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            className="object-cover w-48 h-48 transition-transform duration-300 sm:h-56 sm:w-56 group-hover:scale-110"
          />
          <div className="absolute inset-0 transition-opacity duration-300 bg-black bg-opacity-0 group-hover:bg-opacity-20" />
        </div>
        <h3 className="px-2 mt-4 text-sm font-semibold text-center text-gray-800 transition-colors duration-300 sm:text-base group-hover:text-orange-500">
          {title}
        </h3>
      </div>
    </Link>
  )
}
export default CategoryCard