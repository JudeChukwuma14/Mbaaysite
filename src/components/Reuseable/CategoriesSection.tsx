
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Assuming you're using lucide-react for icons
import CategoryCard from '../categorycardprops/CategoryCard';
import { useEffect, useRef, useState } from 'react';

// Categories data array
const categoriesData = [
  { imageSrc: "https://img.freepik.com/free-photo/funereal-cockatoo-calyptorhynchus-funereus-illustrated-by-elizabeth-gould_53876-65555.jpg?ga=GA1.1.642372306.1746340677&semt=ais_hybrid&w=740", title: 'Art and Sculpture', link: '/art' },
  { imageSrc: "https://i.pinimg.com/736x/09/c6/2d/09c62d72e596d2b4787b1f2c1afe1d1c.jpg", title: 'Beauty and Wellness', link: '/beautywellness' },
  { imageSrc: "https://i.pinimg.com/736x/41/59/c3/4159c3130c611456e97cb861d35a5858.jpg", title: 'Books and Poetry', link: '/book-poetry' },
  { imageSrc: "https://i.pinimg.com/736x/3f/90/28/3f9028655d750fce1ec5e8e5d059a431.jpg", title: 'Fashion', link: '/fashion' },
  { imageSrc: "https://i.pinimg.com/736x/0d/a9/c0/0da9c03185a9e8ef8cdf67f6196bf4f4.jpg", title: 'Handmade Furniture', link: '/furniture' },
  { imageSrc: "https://i.pinimg.com/736x/ef/28/60/ef2860d2ac4d31a20613198afcf78a94.jpg", title: 'Home Décor and Accessories', link: '/homedecor' },
  { imageSrc: "https://i.pinimg.com/736x/01/ad/73/01ad73f4506cf99c2c3c065545013880.jpg", title: 'Jewelry and Gemstones', link: '/jewelry' },
  { imageSrc: "https://i.pinimg.com/736x/9a/b8/19/9ab81906c6e93c501a8fb4a5397eb62d.jpg", title: 'Local & Traditional Foods', link: '/localfood' },
  { imageSrc: "https://i.pinimg.com/736x/a2/8b/90/a28b90cd971ba4a8ce9711eba8070b45.jpg", title: 'Local Food and Drink Products', link: '/localfooddrinks' },
  { imageSrc: "https://i.pinimg.com/736x/70/76/48/707648d88478a6bf29d6a7643ab74dec.jpg", title: 'Plant and Seeds', link: '/plantseed' },
  { imageSrc: "https://i.pinimg.com/736x/0e/70/ca/0e70ca1f4b145087c1bd23fb4f6aeb91.jpg", title: 'Spices, Condiments and Seasonings', link: '/spices' },
  { imageSrc: "https://img.freepik.com/free-photo/metallic-items-second-hand-market_23-2149338422.jpg?ga=GA1.1.642372306.1746340677&semt=ais_hybrid&w=740", title: 'Traditional and Religious Items', link: '/traditional-items' },
  { imageSrc: "https://img.freepik.com/free-photo/vintage-wooden-radios-cloth_23-2148695299.jpg?ga=GA1.1.642372306.1746340677&semt=ais_hybrid&w=740", title: 'Vintage Stocks', link: '/vintage' },
  { imageSrc: "https://i.pinimg.com/736x/20/aa/2c/20aa2cc0317fa7fe4b555ccad125651b.jpg", title: 'Vintage and Antique Jewelry', link: '/vintage-jewelry' },
];


const CategoriesSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  // Check scroll position and update button states
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  // Check if content is scrollable
  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current
      setShowScrollButtons(scrollWidth > clientWidth)
    }
  }

  useEffect(() => {
    checkScrollPosition()
    checkScrollable()

    const handleResize = () => {
      checkScrollPosition()
      checkScrollable()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="container px-4 mx-auto mb-16 md:px-8">
      {/* Section Header */}
      <div className="flex items-center mb-3">
        <div className="w-1 h-6 mr-3 bg-orange-500 rounded-full"></div>
        <span className="font-medium text-orange-500">Category</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Browse By Category</h2>
        <a
          href="/categories"
          className="flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-orange-500"
        >
          View All <ChevronRight size={16} />
        </a>
      </div>

      {/* Scrollable Categories Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        {showScrollButtons && (
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ${canScrollLeft
              ? "hover:bg-orange-50 hover:border-orange-200 text-gray-700 hover:text-orange-500"
              : "text-gray-300 cursor-not-allowed"
              }`}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Right Scroll Button */}
        {showScrollButtons && (
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ${canScrollRight
              ? "hover:bg-orange-50 hover:border-orange-200 text-gray-700 hover:text-orange-500"
              : "text-gray-300 cursor-not-allowed"
              }`}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Categories Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="flex gap-4 pb-4 overflow-x-auto sm:gap-6 scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: showScrollButtons ? "3rem" : "0",
            paddingRight: showScrollButtons ? "3rem" : "0",
          }}
        >
          {categoriesData.map((category, index) => (
            <CategoryCard key={index} imageSrc={category.imageSrc} title={category.title} link={category.link} />
          ))}
        </div>

        {/* Scroll Indicators (dots)
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: Math.ceil(categoriesData.length / 4) }).map((_, index) => (
            <div key={index} className="w-2 h-2 bg-gray-300 rounded-full opacity-50"></div>
          ))}
        </div> */}
      </div>

      {/* Mobile Scroll Hint */}
      {/* <div className="mt-4 text-center md:hidden">
        <p className="text-xs text-gray-500">← Swipe to see more categories →</p>
      </div> */}
    </section>
  )
}

export default CategoriesSection
