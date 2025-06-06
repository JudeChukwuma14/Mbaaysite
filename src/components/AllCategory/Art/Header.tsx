import { Search, Heart, X } from "lucide-react";
import type React from "react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  favoritesCount: number;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  showSearch,
  setShowSearch,
  favoritesCount,
}) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearch(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-light tracking-tight text-gray-900">artistry</h1>
            <nav className="hidden space-x-6 md:flex">
              <button className="text-gray-900 hover:text-gray-600">Gallery</button>
              <button className="text-gray-500 hover:text-gray-900">Artists</button>
              <button className="text-gray-500 hover:text-gray-900">Collections</button>
              <button className="text-gray-500 hover:text-gray-900">About</button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {showSearch ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search artworks or artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute text-gray-400 -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
                  onClick={clearSearch}
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                className="text-gray-500 hover:text-gray-900"
                onClick={() => setShowSearch(true)}
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            <button className="relative text-gray-500 hover:text-gray-900">
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;