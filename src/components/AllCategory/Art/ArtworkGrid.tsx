import { Search } from "lucide-react";
import type React from "react";
import ArtworkCard from "./ArtworkCard";
import { Dispatch, SetStateAction } from "react"; // Import necessary types

interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  price?: number;
}

interface ArtworkGridProps {
  artworks: Artwork[];
  viewMode: "masonry" | "grid";
  loading: boolean;
  searchQuery: string;
  totalArtworks: number;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onSelectArtwork: Dispatch<SetStateAction<Artwork | null>>; // Updated type
  clearFilters: () => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({
  artworks,
  viewMode,
  loading,
  searchQuery,
  totalArtworks,
  favorites,
  toggleFavorite,
  onSelectArtwork,
  clearFilters,
}) => {
  return (
    <>
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {artworks.length} of {totalArtworks} artworks{searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-[3/4] mb-4 border-8 border-gray-300"></div>
              <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <div className="py-16 text-center">
          <Search className="w-16 h-16 mx-auto text-gray-400" />
          <h3 className="mb-2 text-xl font-medium text-gray-900">No artworks found</h3>
          <p className="mb-6 text-gray-600">Try adjusting your search or filter criteria</p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 text-white bg-gray-900 rounded-md hover:bg-gray-800"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === "masonry" ? (
        <div className="gap-6 space-y-6 columns-1 sm:columns-2 md:columns-3 lg:columns-4">
          {artworks.map((artwork, index) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              index={index}
              isFavorite={favorites.includes(artwork.id)}
              toggleFavorite={toggleFavorite}
              onSelect={onSelectArtwork} // Pass onSelectArtwork directly
              isMasonry
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {artworks.map((artwork, index) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              index={index}
              isFavorite={favorites.includes(artwork.id)}
              toggleFavorite={toggleFavorite}
              onSelect={onSelectArtwork} // Pass onSelectArtwork directly
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ArtworkGrid;