import { ZoomIn, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react"; // Import necessary types

interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  price?: number;
}

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  onSelect: Dispatch<SetStateAction<Artwork | null>>; // Updated type
  isMasonry?: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  index,
  isFavorite,
  toggleFavorite,
  onSelect,
  isMasonry,
}) => {
  return (
    <div className={isMasonry ? "mb-6 break-inside-avoid" : ""}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative cursor-pointer group"
        onClick={() => onSelect(artwork)} // Call onSelect with artwork
      >
        <div className="relative overflow-hidden bg-gray-100 border-8 border-black">
          <img
            src={artwork.image || "/placeholder.svg"}
            alt={artwork.title}
            className="object-cover w-full h-auto transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-0 opacity-0 group-hover:bg-opacity-30 group-hover:opacity-100">
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(artwork); // Call onSelect with artwork
                }}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
              >
                <ZoomIn className="w-5 h-5 text-gray-900" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(artwork.id);
                }}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-900"}`}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900">{artwork.title}</h3>
          <p className="text-sm text-gray-500">{artwork.artist}</p>
          {artwork.price && <p className="mt-1 text-sm font-medium text-gray-900">${artwork.price}</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default ArtworkCard;