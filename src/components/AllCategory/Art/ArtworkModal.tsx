import { X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type React from "react";

interface Artist {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
}

interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  year: string;
  medium: string;
  dimensions: string;
  price?: number;
}

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  findArtist: (name: string) => Artist | undefined;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({
  artwork,
  onClose,
  isFavorite,
  toggleFavorite,
  findArtist,
}) => {
  if (!artwork) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute z-10 p-1 text-gray-400 bg-white rounded-full top-4 right-4 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-center p-4 bg-gray-100 md:w-2/3">
            <img
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              className="max-h-[70vh] max-w-full object-contain border-8 border-black"
            />
          </div>
          <div className="p-6 overflow-y-auto md:w-1/3">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">{artwork.title}</h2>
            <p className="mb-4 text-lg text-gray-600">{artwork.artist}</p>
            <div className="mb-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="text-base">{artwork.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Medium</p>
                <p className="text-base">{artwork.medium}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dimensions</p>
                <p className="text-base">{artwork.dimensions}</p>
              </div>
              {artwork.price && (
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-xl font-medium">${artwork.price}</p>
                </div>
              )}
            </div>
            {findArtist(artwork.artist) && (
              <div className="pt-6 mt-6 border-t border-gray-200">
                <h3 className="mb-4 text-lg font-medium">About the Artist</h3>
                <div className="flex items-center mb-4 space-x-4">
                  <img
                    src={findArtist(artwork.artist)?.avatar || "/placeholder.svg"}
                    alt={artwork.artist}
                    className="object-cover w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{artwork.artist}</p>
                    <button className="text-sm text-blue-600 hover:underline">View Profile</button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{findArtist(artwork.artist)?.bio}</p>
              </div>
            )}
            <div className="flex mt-8 space-x-4">
              <button className="flex-1 py-3 text-white bg-gray-900 rounded-md hover:bg-gray-800">
                Purchase
              </button>
              <button
                onClick={() => toggleFavorite(artwork.id)}
                className={`px-4 py-3 rounded-md border ${
                  isFavorite ? "bg-red-50 border-red-200 text-red-500" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArtworkModal;