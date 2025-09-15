import { useState, useEffect } from "react";
import { Search, Filter, Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AuctionCard from "./AuctionCard";
import AuctionCardSkeleton from "./AuctionCardSkeleton";
import { getAuctionProduct } from "@/utils/productApi";

interface Auction {
  _id: string;
  name: string;
  images: string[];
  description: string;
  price: number;
  startingPrice: number;
  category: string;
  sub_category: string;
  auctionEndDate: string;
  auctionStatus: string;
  highestBid: { amount: number };
  poster: { _id: string; storeName: string; email: string };
  verified: boolean;
  bids: any[];
  createdAt: string;
  updatedAt: string;
}

const getCategories = (auctions: Auction[]) => {
  const uniqueCategories = [
    "All",
    ...new Set(auctions.map((auction) => auction.category)),
  ];
  return uniqueCategories;
};

const sortOptions = [
  { value: "ending-soon", label: "Ending Soon" },
  { value: "newest", label: "Newest Listed" },
  { value: "price-high", label: "Highest Price" },
  { value: "price-low", label: "Lowest Price" },
];

const AuctionList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("ending-soon");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const data = await getAuctionProduct();
        // Extract the 'data' array from the response, fallback to empty array
        const auctionData =
          data?.data && Array.isArray(data.data) ? data.data : [];
        console.log("Fetched Auctions:", auctionData); // Debug log
        setAuctions(auctionData);
        setCategories(getCategories(auctionData));
      } catch (err: any) {
        console.error("Error in fetchAuctions:", err);
        setError(
          err.response?.status === 404
            ? "Auction endpoint not found. Please check the API URL."
            : "Failed to load auctions. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const mappedAuctions = auctions.map((auction) => ({
    id: auction._id,
    image: auction.images[0] || "/placeholder.svg",
    title: auction.name,
    currentBid: auction.highestBid.amount || auction.startingPrice,
    lotNumber: `LOT${auction._id.slice(-4)}`,
    seller: auction.poster.storeName || "Unknown Seller",
    sellerImage: "/placeholder.svg",
    endTime: auction.auctionEndDate,
    category: auction.category,
    isPremium: auction.verified,
    isWatched: false,
  }));

  const filteredAuctions = mappedAuctions
    .filter(
      (auction) =>
        auction.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === "All" || auction.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "ending-soon":
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        case "newest":
          return b.id.localeCompare(a.id);
        case "price-high":
          return b.currentBid - a.currentBid;
        case "price-low":
          return a.currentBid - b.currentBid;
        default:
          return 0;
      }
    });

  const liveAuctions = filteredAuctions.filter(
    (auction) => new Date(auction.endTime) > new Date()
  );
  const endedAuctions = filteredAuctions.filter(
    (auction) => new Date(auction.endTime) <= new Date()
  );

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-hero text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto md:px-8 px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Premium Auction House
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Discover extraordinary collectibles, art, and luxury items from
              trusted sellers worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Badge className="bg-white/20 text-white border-white/30 w-fit">
                {liveAuctions.length} Live Auctions
              </Badge>
              <Badge className="bg-auction-premium/20 text-white border-auction-premium/30 w-fit">
                Premium Verified Items
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b bg-card shadow-sm sticky top-0 z-40">
        <div className="container mx-auto md:px-8 px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-[140px] h-10 px-3 py-2 text-sm bg-background border border-input rounded-md ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-[150px] h-10 px-3 py-2 text-sm bg-background border border-input rounded-md ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center border rounded-md bg-background">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none border-l"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-background"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>{filteredAuctions.length} auctions found</span>
            <div className="flex gap-4">
              <span className="text-auction-live">
                ● {liveAuctions.length} Live
              </span>
              <span className="text-auction-ended">
                ● {endedAuctions.length} Ended
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto md:px-8 px-4 py-8">
        {loading ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <AuctionCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No auctions found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} {...auction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionList;
