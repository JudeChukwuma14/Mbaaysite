
import type React from "react"
import { useEffect, useState } from "react"
import { FaRegSadTear, FaShoppingCart, FaHome, FaChevronRight } from "react-icons/fa"
import Men from "@/assets/image/menF.jpg"
import Women from "@/assets/image/womenF.jpg"
import Kid from "@/assets/image/kidF.jpg"
import FJ from "@/assets/image/FashionJe.jpg"
import sportW from "@/assets/image/sportyF.jpg"
import AS from "@/assets/image/accessorieFA.jpg"
import FW from "@/assets/image/Footwear.jpg"
import EW from "@/assets/image/ethnicwear.jpg"

import { motion } from "framer-motion"

// // Mock components - replace with your actual components
const ProductCard2 = ({ image, name, price,  label }: any) => (
  <div className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
    <div className="overflow-hidden aspect-square">
      <img
        src={image || "/placeholder.svg?height=200&width=200"}
        alt={name}
        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
      />
    </div>
    <div className="p-4">
      <h3 className="mb-2 font-semibold text-gray-800 line-clamp-2">{name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-orange-500">${price}</span>
        {label && <span className="px-2 py-1 text-xs text-white bg-red-500 rounded">{label}</span>}
      </div>
    </div>
  </div>
)

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  createdAt: string
  category: string
  sub_category?: string
  sub_category2?: string
}

interface Subcategory {
  image: string
  link: string
  text: string
  description: string
}

const Fashion: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Mock API call - replace with your actual API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data - replace with actual API call
        const mockProducts: Product[] = [
          {
            _id: "1",
            name: "Elegant Summer Dress",
            price: 89.99,
            images: ["/placeholder.svg?height=300&width=300"],
            createdAt: new Date().toISOString(),
            category: "fashion",
          },
          {
            _id: "2",
            name: "Classic Denim Jacket",
            price: 129.99,
            images: ["/placeholder.svg?height=300&width=300"],
            createdAt: new Date().toISOString(),
            category: "fashion",
          },
        ]

        setProducts(mockProducts)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to fetch products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const fashionCategories: Subcategory[] = [
    {
      image: Women,
      text: "Women's Fashion",
      link: "/WomenFashion",
      description: "Trendy styles for every occasion",
    },
    {
      image: Men,
      text: "Men's Fashion",
      link: "/MenFashion",
      description: "Classic and modern menswear",
    },
    {
      image: Kid,
      text: "Kid's Fashion",
      link: "/KidFashion",
      description: "Comfortable and stylish kids wear",
    },
    {
      image: AS,
      text: "Accessories",
      link: "/Accessories",
      description: "Hats, belts, and more",
    },
    {
      image: FJ,
      text: "Fashion Jewelry",
      link: "/FashionJewelry",
      description: "Beautiful jewelry pieces",
    },
    {
      image: sportW,
      text: "Sportswear",
      link: "/SportWear",
      description: "Active and athletic wear",
    },
    {
      image: EW,
      text: "Ethnic Wear",
      link: "/EthnicWear",
      description: "Traditional and cultural clothing",
    },
    {
      image: FW,
      text: "Footwear",
      link: "/FootWear",
      description: "Shoes for every style",
    },
  ]

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 py-8 mx-auto lg:px-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full">
              <FaRegSadTear className="text-4xl text-red-400" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">Oops! Something went wrong</h2>
            <p className="max-w-md mb-8 text-lg text-gray-600">{error}</p>
            <a
              href="/"
              className="inline-flex items-center gap-3 px-8 py-3 font-semibold text-white transition-colors duration-300 bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 hover:shadow-xl"
            >
              <FaShoppingCart />
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto lg:px-8">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8 text-sm text-gray-600"
        >
          <a href="/" className="flex items-center gap-1 transition-colors hover:text-orange-500">
            <FaHome />
            Home
          </a>
          <FaChevronRight className="text-xs" />
          <span className="font-medium text-gray-800">Fashion</span>
        </motion.nav>

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Fashion Collection</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Discover the latest trends and timeless classics in our curated fashion collection
          </p>
        </motion.div>

        {/* Categories Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {fashionCategories.map((category, index) => (
              <motion.a
                key={index}
                href={category.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 text-center transition-all duration-300 bg-white shadow-md group rounded-xl hover:shadow-xl"
              >
                <div className="w-20 h-20 mx-auto mb-4 overflow-hidden transition-transform duration-300 bg-gray-100 rounded-full group-hover:scale-110">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.text}
                    className="object-cover w-full h-full "
                  />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 transition-colors group-hover:text-orange-500">
                  {category.text}
                </h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Products Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600">Handpicked items just for you</p>
            </div>
            <a
              href="/fashion/all"
              className="flex items-center gap-2 font-medium text-orange-500 hover:text-orange-600"
            >
              View All <FaChevronRight className="text-xs" />
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="overflow-hidden bg-white rounded-lg shadow-md animate-pulse">
                  <div className="bg-gray-200 aspect-square"></div>
                  <div className="p-4">
                    <div className="h-4 mb-2 bg-gray-200 rounded"></div>
                    <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full">
                <FaRegSadTear className="text-4xl text-gray-400" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-800">No Fashion Products Found</h3>
              <p className="max-w-md mx-auto mb-8 text-gray-600">
                We're currently updating our fashion collection. Check back soon for the latest styles!
              </p>
              <a
                href="/random-product"
                className="inline-flex items-center gap-3 px-8 py-3 font-semibold text-white transition-colors duration-300 bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 hover:shadow-xl"
              >
                <FaShoppingCart />
                Explore Other Categories
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10)
                .map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <ProductCard2
                      image={product.images[0] || ""}
                      name={product.name}
                      price={product.price.toString()}
                      rating={4}
                      label="New!"
                    />
                  </motion.div>
                ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}

export default Fashion
