import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeSession } from "@/redux/slices/sessionSlice";
import {
  ArrowLeft,
  Heart,
  Share2,
  Gavel,
  Clock,
  Eye,
  Shield,
  Award,
  TrendingUp,
  Users,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuctionDetailSkeleton from "./AuctionDetailSkeleton";
import { getAuctionById, placeBid, upgradeBid } from "@/utils/productApi";
import { toast } from "react-toastify";
import {
  convertPrice,
  formatPrice,
  getCurrencySymbol,
} from "@/utils/currencyCoverter";
import { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";

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
  highestBid: {
    bidder: string & { _id: string; storeName: string } | { _id: string; name: string };
    bidderModel: string;
    amount: number;
  } | null;
  poster: { _id: string; storeName: string; email: string; image?: string };
  verified: boolean;
  bids: {
    bidder: string & { _id: string; name: string } | { _id: string; storeName: string };
    bidderModel: string;
    amount: number;
    createdAt: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  inventory: number;
  productType: string;
  product_video: string;
  reservePrice: number;
  auctionDuration: number;
  sub_category2: string;
  uploadedBy: string | null;
}

// Custom hook for price conversion
const useConvertedPrices = (auction: Auction | null, currency: string) => {
  const [prices, setPrices] = useState({
    currentBid: 0,
    startingPrice: 0,
    nextBid: 0,
    bids: {} as { [key: string]: number },
  });
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  useEffect(() => {
    if (auction) {
      const convertPrices = async () => {
        setIsPriceLoading(true);
        try {
          const [currentBid, startingPrice, nextBid, convertedBids] = await Promise.all([
            convertPrice(auction.highestBid?.amount || auction.startingPrice, "NGN", currency),
            convertPrice(auction.startingPrice, "NGN", currency),
            convertPrice((auction.highestBid?.amount || auction.startingPrice) + 250, "NGN", currency),
            Promise.all(
              auction.bids.map(async (bid) => ({
                _id: bid._id,
                amount: Math.round(await convertPrice(bid.amount, "NGN", currency)),
              }))
            ).then((bids) => bids.reduce((acc, { _id, amount }) => ({ ...acc, [_id]: amount }), {})),
          ]);
          setPrices({
            currentBid: Math.round(currentBid),
            startingPrice: Math.round(startingPrice),
            nextBid: Math.round(nextBid),
            bids: convertedBids,
          });
        } catch (error) {
          console.error("Failed to convert prices:", error);
          setPrices({
            currentBid: auction.highestBid?.amount || auction.startingPrice,
            startingPrice: auction.startingPrice,
            nextBid: (auction.highestBid?.amount || auction.startingPrice) + 250,
            bids: auction.bids.reduce((acc, bid) => ({ ...acc, [bid._id]: bid.amount }), {}),
          });
        } finally {
          setIsPriceLoading(false);
        }
      };
      convertPrices();
    }
  }, [auction, currency]);

  return { prices, isPriceLoading };
};

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isWatching, setIsWatching] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const prevBidsRef = useRef<Auction["bids"]>([]);

  // Redux selectors
  const user = useSelector((state: RootState) => state.user.user);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const userToken = useSelector((state: RootState) => state.user.token);
  const vendorToken = useSelector((state: RootState) => state.vendor?.token);
  const { currency } = useSelector((state: RootState) => state.settings);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const authToken = userToken || vendorToken || "";
  const currencySymbol = getCurrencySymbol(currency);

  // Owner and bidding status
  const currentUserId = user?._id || vendor?._id;
  const isOwner = auction?.poster._id === currentUserId;
  const userBids = auction?.bids.filter((bid) => bid.bidder === currentUserId) || [];
  const showUpdateBid = userBids.length > 0;
  const hasExistingBid = userBids.length > 0;

  // Convert prices using custom hook
  const { prices, isPriceLoading } = useConvertedPrices(auction, currency);

  // Initialize sessionId
  useEffect(() => {
    if (!sessionId) dispatch(initializeSession());
  }, [dispatch, sessionId]);

  // Fetch auction data with polling
  useEffect(() => {
    if (!id) {
      setError("Invalid auction ID. Please check the URL.");
      setLoading(false);
      return;
    }

    const fetchAuctionData = async () => {
      try {
        const auctionData = await getAuctionById(id);
        const auctionItem = auctionData?.data;
        if (!auctionItem) throw new Error("Auction not found");

        // Notify on new bids
        if (auction && auctionItem.bids.length > prevBidsRef.current.length) {
          const newBids = auctionItem.bids.filter(
            (newBid:any) => !prevBidsRef.current.some((prevBid) => prevBid._id === newBid._id)
          );
          for (const bid of newBids) {
            if (bid.bidder !== currentUserId) {
              const convertedAmount = await convertPrice(bid.amount, "NGN", currency);
              toast.info(
                `New bid placed: ${currencySymbol} ${formatPrice(Math.round(convertedAmount))} by ${getBidderName(
                  bid.bidder,
                  bid.bidderModel
                )}`
              );
            }
          }
        }
        prevBidsRef.current = auctionItem.bids;

        setAuction(auctionItem);
        setTimeLeft(getTimeLeft(auctionItem.auctionEndDate));
      } catch (err: any) {
        setError(
          err.response?.status === 404
            ? "Auction not found. Please check the auction ID."
            : "Failed to load auction details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionData();
    if (!timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) {
      return; // Stop polling if auction has ended
    }
    const intervalId = setInterval(fetchAuctionData, 5000);
    return () => clearInterval(intervalId);
  }, [id, currentUserId, currencySymbol, currency, timeLeft]);

  // Pre-fill bid amount for existing bids
  useEffect(() => {
    if (hasExistingBid && auction) {
      const currentBid = auction.bids.find((bid) => bid.bidder === currentUserId);
      if (currentBid) {
        (async () => {
          try {
            const converted = await convertPrice(currentBid.amount, "NGN", currency);
            setBidAmount(Math.round(converted).toString());
          } catch (error) {
            console.error("Failed to convert bid amount:", error);
            setBidAmount(currentBid.amount.toString());
          }
        })();
      }
    }
  }, [auction, currency, currentUserId, hasExistingBid]);

  // Update countdown timer
  useEffect(() => {
    if (auction) {
      const timer = setInterval(() => {
        setTimeLeft(getTimeLeft(auction.auctionEndDate));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [auction]);

  // Calculate time left
  const getTimeLeft = (endTime: string) => {
    const now = new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" });
    const diff = new Date(endTime).getTime() - new Date(now).getTime();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const isEnded = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  // Resolve bidder names
  const getBidderName = (bidder: any, bidderModel: string) => {
    if (bidderModel === "users" && user && user._id === bidder._id) return user.name || "You";
    if (bidderModel === "vendors" && vendor && vendor._id === bidder._id) return vendor.storeName || "You";
    if (auction && bidder._id === auction.poster._id) return auction.poster.storeName;
    return "storeName" in bidder ? bidder.storeName : "name" in bidder ? bidder.name : "Anonymous Bidder";
  };

  const handlePlaceBid = async () => {
    if (!authToken) {
      navigate("/selectpath", { state: { from: `/auction/${id}` } });
      toast.error("Please log in to place a bid.");
      return;
    }
    if (!bidAmount || parseFloat(bidAmount) < prices.nextBid) {
      toast.error(`Bid must be at least ${currencySymbol} ${formatPrice(prices.nextBid)}`);
      return;
    }
    if (showUpdateBid && !window.confirm("Are you sure you want to update your bid?")) {
      return;
    }
    try {
      const bidInNGN = await convertPrice(parseFloat(bidAmount), currency, "NGN");
      if (showUpdateBid) {
        await upgradeBid(id!, Math.round(bidInNGN), authToken);
        toast.success(`Bid updated: ${currencySymbol} ${formatPrice(parseFloat(bidAmount))}`);
      } else {
        await placeBid(id!, Math.round(bidInNGN), authToken);
        toast.success(`Bid placed: ${currencySymbol} ${formatPrice(parseFloat(bidAmount))}`);
      }
      setBidAmount("");
      const auctionData = await getAuctionById(id!);
      setAuction(auctionData?.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message === "Bidder not found"
          ? "Cannot place/update bid: Your account could not be verified. Please log in again or contact support."
          : err.response?.data?.message || "Failed to place/update bid. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (loading) return <AuctionDetailSkeleton />;
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-red-500 text-sm sm:text-base">{error}</p>
        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
          <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">Retry</Button>
          <Link to="/">
            <Button className="w-full sm:w-auto mt-2 sm:mt-0">Back to Auctions</Button>
          </Link>
        </div>
      </div>
    );
  }
  if (!auction) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Auctions</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWatching(!isWatching)}
                className={`min-w-[100px] ${isWatching ? "text-red-500 border-red-500" : ""}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isWatching ? "fill-red-500" : ""}`} />
                {isWatching ? "Watching" : "Watch"}
              </Button>
              <Button variant="outline" size="sm" className="min-w-[100px]">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 xl:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden shadow-auction">
              <img
                src={auction.images[currentImageIndex] || "/placeholder.svg"}
                alt={auction.name}
                className="w-full h-full object-cover"
              />
              {auction.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 bg-white/90 hover:bg-white"
                    onClick={() =>
                      setCurrentImageIndex(
                        currentImageIndex === 0 ? auction.images.length - 1 : currentImageIndex - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 bg-white/90 hover:bg-white"
                    onClick={() =>
                      setCurrentImageIndex((currentImageIndex + 1) % auction.images.length)
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            {auction.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {auction.images.map((image, index) => (
                  <button
                    key={image || `image-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? "border-primary shadow-md" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img src={image} alt={`${auction.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <Badge
                  variant={isEnded ? "destructive" : "default"}
                  className={`text-xs sm:text-sm ${isEnded ? "border-auction-ended text-slate-500" : "border-auction-live"}`}
                >
                  <Gavel className="mr-1 h-3 w-3" />
                  {isEnded ? "Auction Ended" : "Live Auction"}
                </Badge>
                {auction.verified && (
                  <Badge className="bg-gradient-gold text-primary font-semibold text-xs sm:text-sm">
                    <Award className="mr-1 h-3 w-3" />
                    Premium
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs sm:text-sm">Lot #LOT{auction._id.slice(-4)}</Badge>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-2">{auction.name}</h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">{auction.description}</p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {auction.bids.length} views
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />0 watching
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {auction.bids.length} bids
                </div>
              </div>
            </div>

            <Card className="border-primary/20 shadow-auction">
              <CardContent className="p-4 sm:p-6">
                <motion.div
                  key={prices.currentBid}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">Current Bid</p>
                      {isPriceLoading ? (
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">Loading...</span>
                      ) : (auction.highestBid?.amount ?? 0) === 0 && auction.bids.length === 0 ? (
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-muted-foreground">No bids yet</p>
                      ) : (
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text">
                          {currencySymbol} {formatPrice(prices.currentBid)}
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">Starting Bid</p>
                      {isPriceLoading ? (
                        <span className="text-base sm:text-lg font-semibold text-foreground">Loading...</span>
                      ) : (
                        <p className="text-base sm:text-lg font-semibold text-foreground">
                          {currencySymbol} {formatPrice(prices.startingPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {!isEnded && (
                  <div className="bg-muted rounded-xl p-3 sm:p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">Time Remaining</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      {["days", "hours", "minutes", "seconds"].map((unit) => (
                        <div key={unit} className="text-center">
                          <div className="text-lg sm:text-2xl font-bold text-foreground">
                            {timeLeft[unit as keyof typeof timeLeft].toString().padStart(2, "0")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isEnded ? (
                  <div className="text-center py-4">
                    <p className="text-base sm:text-lg font-semibold text-muted-foreground">Auction has ended</p>
                    {auction.highestBid ? (
                      <p className="text-sm sm:text-md text-foreground mt-2">
                        Winner: {"storeName" in auction.highestBid.bidder
                          ? auction.highestBid.bidder.storeName
                          : auction.highestBid.bidder.name} at {currencySymbol} {formatPrice(prices.currentBid)}
                      </p>
                    ) : (
                      <p className="text-sm sm:text-md text-foreground mt-2">No bids were placed.</p>
                    )}
                    <Button variant="outline" className="mt-2 w-full sm:w-auto">View Final Results</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                      <Input
                        type="number"
                        placeholder={`Minimum bid: ${currencySymbol} ${formatPrice(prices.nextBid)}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="flex-1 text-sm sm:text-base h-10"
                        disabled={isOwner}
                      />
                      <Button
                        onClick={handlePlaceBid}
                        disabled={isOwner || !bidAmount || parseFloat(bidAmount) < prices.nextBid}
                        className="w-full sm:w-auto bg-gradient-gold hover:opacity-90 text-primary font-semibold px-4 sm:px-8 h-10"
                      >
                        {isOwner ? "You can't bid" : showUpdateBid ? "Update Bid" : "Place Bid"}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[0, 500, 1000].map((increment) => (
                        <Button
                          key={increment}
                          variant="outline"
                          size="sm"
                          onClick={() => setBidAmount((prices.nextBid + increment).toString())}
                          disabled={isOwner}
                          className="flex-1 sm:flex-none min-w-[80px] h-10 text-xs sm:text-sm"
                        >
                          {currencySymbol} {formatPrice(prices.nextBid + increment)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-border">
                      <AvatarImage src={auction.poster.image || "/placeholder.svg"} alt={auction.poster.storeName} />
                      <AvatarFallback className="font-bold text-lg sm:text-xl">{auction.poster.storeName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">{auction.poster.storeName}</h3>
                        {auction.verified && <Shield className="h-4 w-4 text-green-600" />}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">★ 4.9 • 0 sales</div>
                    </div>
                  </div>
                  <Link to={`/views-profile/${auction.poster._id}`}>
                    <Button variant="outline" className="w-full sm:w-auto h-10">View Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 sm:mt-12">
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 bg-muted p-1 rounded-md">
              {["details", "bidding", "condition", "shipping"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-sm transition-all ${
                    activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  } ${tab === "shipping" ? "hidden sm:flex" : ""}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "details" && (
              <div className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                      Item Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground text-sm sm:text-base mb-2">Specifications</h4>
                          <div className="space-y-2 text-xs sm:text-sm">
                            {[
                              { label: "Category", value: auction.category },
                              { label: "Sub-Category", value: auction.sub_category },
                              { label: "Sub-Category 2", value: auction.sub_category2 },
                              { label: "Inventory", value: auction.inventory },
                            ].map(({ label, value }) => (
                              <div key={label} className="flex justify-between">
                                <span className="text-muted-foreground">{label}:</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground text-sm sm:text-base mb-2">Provenance</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                            This item is from a reputable seller and has been verified for authenticity.
                          </p>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Authenticity:</span>
                              <span className="font-medium text-green-600">
                                {auction.verified ? "Verified" : "Not Verified"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Created At:</span>
                              <span className="font-medium">{new Date(auction.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "bidding" && (
              <div className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Bidding History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
                      {auction.bids.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No bids yet.</p>
                      ) : (
                        <AnimatePresence>
                          {[...auction.bids]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((bid) => (
                              <motion.div
                                key={bid._id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted text-xs sm:text-sm"
                              >
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      bid.amount === auction.highestBid?.amount ? "bg-green-500" : "bg-muted-foreground"
                                    }`}
                                  />
                                  <span className="font-medium">
                                    {"storeName" in bid.bidder
                                      ? bid.bidder.storeName
                                      : "name" in bid.bidder
                                      ? bid.bidder.name
                                      : "Anonymous Bidder"}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">
                                    {currencySymbol} {formatPrice(prices.bids[bid._id] || bid.amount)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(bid.createdAt).toLocaleString("en-NG", {
                                      timeZone: "Africa/Lagos",
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "condition" && (
              <div className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Condition Report</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">
                            {auction.verified ? "Excellent" : "Unknown"}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                          Condition details are not provided in the API. Please contact the seller for a detailed condition report.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Shipping & Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base mb-3">Shipping Information</h4>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p className="text-muted-foreground">Contact seller for shipping details.</p>
                          <p><span className="font-medium">Domestic:</span> Available</p>
                          <p><span className="font-medium">International:</span> Available</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base mb-3">Payment Methods</h4>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p className="text-muted-foreground">Contact seller for payment options.</p>
                          <p>• Wire Transfer</p>
                          <p>• Credit Card</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;