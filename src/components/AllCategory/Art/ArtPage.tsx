import { useState, useEffect } from "react";
import Header from "./Header";
import FiltersPanel from "./FiltersPanel";
import ArtworkGrid from "./ArtworkGrid";
import Pagination from "./Pagination";
import ArtworkModal from "./ArtworkModal";

interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  year: string;
  medium: string;
  dimensions: string;
  category: string;
  price?: number;
  isFeatured?: boolean;
}

interface Artist {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
}

export default function ArtPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"masonry" | "grid">("masonry");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  const mockArtworks: Artwork[] = [
    {
      id: "1",
      title: "Spring Forest",
      artist: "Elena Mikhailova",
      image: "https://img.freepik.com/free-vector/hand-drawn-crowned-pigeon_53876-40757.jpg?ga=GA1.1.642372306.1746340677&semt=ais_items_boosted&w=740",
      year: "2023",
      medium: "Oil on canvas",
      dimensions: "24 × 36 in",
      category: "landscape",
      price: 1200,
      isFeatured: true,
    },
    {
      id: "2",
      title: "Native Spirit",
      artist: "James Redfeather",
      image: "https://img.freepik.com/free-psd/illustration-animal-adult-coloring-page_53876-12254.jpg?ga=GA1.1.642372306.1746340677&semt=ais_items_boosted&w=740",
      year: "2022",
      medium: "Digital art",
      dimensions: "18 × 36 in",
      category: "portrait",
      price: 950,
    },
    {
      id: "3",
      title: "Fading Memory",
      artist: "Sofia Chen",
      image: "https://img.freepik.com/free-photo/tattooed-young-man-with-pierced-ear-nose-holding-flower-bouquet-front-his-face_23-2148121963.jpg?ga=GA1.1.642372306.1746340677&semt=ais_items_boosted&w=740",
      year: "2023",
      medium: "Charcoal on paper",
      dimensions: "16 × 20 in",
      category: "portrait",
      price: 850,
      isFeatured: true,
    },
    {
      id: "4",
      title: "Cosmic Eyes",
      artist: "Marcus Blue",
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=400&fit=crop",
      year: "2021",
      medium: "Mixed media",
      dimensions: "24 × 24 in",
      category: "abstract",
      price: 1400,
    },
    {
      id: "5",
      title: "Urban Reflections",
      artist: "Carlos Mendez",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=500&fit=crop",
      year: "2022",
      medium: "Acrylic on canvas",
      dimensions: "30 × 30 in",
      category: "landscape",
      price: 1800,
    },
    {
      id: "6",
      title: "Ethereal Beauty",
      artist: "Amelia Rose",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=700&fit=crop",
      year: "2023",
      medium: "Watercolor",
      dimensions: "18 × 24 in",
      category: "portrait",
      price: 920,
      isFeatured: true,
    },
    {
      id: "7",
      title: "Ancient Wisdom",
      artist: "James Redfeather",
      image: "https://img.freepik.com/free-vector/woman-hand-holding-microphone-vector-illustration_460848-6796.jpg?ga=GA1.1.642372306.1746340677&semt=ais_items_boosted&w=740",
      year: "2021",
      medium: "Digital art",
      dimensions: "20 × 30 in",
      category: "portrait",
      price: 1050,
    },
    {
      id: "8",
      title: "Midnight Glamour",
      artist: "Sophia Chen",
      image: "https://img.freepik.com/free-photo/parakeet-platycercus-barnardii-illustrated-by-elizabeth-gould_53876-65557.jpg?ga=GA1.1.642372306.1746340677&semt=ais_items_boosted&w=740",
      year: "2022",
      medium: "Oil on canvas",
      dimensions: "36 × 48 in",
      category: "portrait",
      price: 2200,
      isFeatured: true,
    },
    {
      id: "9",
      title: "Sunset Harbor",
      artist: "Thomas Rivera",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop",
      year: "2023",
      medium: "Acrylic on canvas",
      dimensions: "24 × 36 in",
      category: "landscape",
      price: 1600,
    },
    {
      id: "10",
      title: "Venetian Dreams",
      artist: "Isabella Conti",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
      year: "2022",
      medium: "Oil on canvas",
      dimensions: "20 × 24 in",
      category: "landscape",
      price: 1350,
    },
    {
      id: "11",
      title: "Abstract Flow",
      artist: "Marcus Blue",
      image: "https://img.freepik.com/free-vector/goliath-cockatoo_53876-75772.jpg?ga=GA1.1.642372306.1746340677&semt=ais_items_boosted&w=740",
      year: "2023",
      medium: "Acrylic on canvas",
      dimensions: "30 × 40 in",
      category: "abstract",
      price: 1900,
    },
    {
      id: "12",
      title: "Mountain Serenity",
      artist: "Elena Mikhailova",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop",
      year: "2022",
      medium: "Oil on canvas",
      dimensions: "28 × 35 in",
      category: "landscape",
      price: 1450,
    },
  ]

  // Mock data for artists
  const mockArtists: Artist[] = [
    {
      id: "1",
      name: "Elena Mikhailova",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      bio: "Contemporary landscape artist known for vibrant colors and emotional depth.",
    },
    {
      id: "2",
      name: "James Redfeather",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      bio: "Digital artist exploring indigenous themes and cultural heritage.",
    },
    {
      id: "3",
      name: "Sofia Chen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      bio: "Portrait artist working with traditional media and experimental techniques.",
    },
    {
      id: "4",
      name: "Marcus Blue",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Abstract artist focused on cosmic themes and spiritual exploration.",
    },
    {
      id: "5",
      name: "Carlos Mendez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      bio: "Urban landscape painter capturing the essence of city life.",
    },
  ]

  const itemsPerPage = 30

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setArtworks(mockArtworks);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, priceRange]);

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesCategory = activeCategory === "all" || artwork.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = !artwork.price || (artwork.price >= priceRange[0] && artwork.price <= priceRange[1]);
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const currentArtworks = filteredArtworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]);

  const findArtist = (name: string): Artist | undefined =>
    mockArtists.find((artist) => artist.name === name);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setPriceRange([0, 5000]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        favoritesCount={favorites.length}
      />
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <FiltersPanel
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        <ArtworkGrid
          artworks={currentArtworks}
          viewMode={viewMode}
          loading={loading}
          searchQuery={searchQuery}
          totalArtworks={filteredArtworks.length}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onSelectArtwork={(artwork:any) => setSelectedArtwork(artwork)}
          clearFilters={clearFilters}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        isFavorite={selectedArtwork ? favorites.includes(selectedArtwork.id) : false}
        toggleFavorite={toggleFavorite}
        findArtist={findArtist}
      />
    </div>
  );
}