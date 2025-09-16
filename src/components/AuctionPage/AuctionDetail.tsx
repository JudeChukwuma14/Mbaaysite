import { useState, useEffect } from "react";
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
  highestBid: { bidder: string; bidderModel: string; amount: number } | null;
  poster: { _id: string; storeName: string; email: string; image?: string };
  verified: boolean;
  bids: {
    bidder: string | { _id?: string; email?: string; name?: string };
    bidderModel: string;
    amount: number;
    createdAt: string;
    _id?: string;
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

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isWatching, setIsWatching] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [convertedCurrentBid, setConvertedCurrentBid] = useState(0);
  const [convertedStartingPrice, setConvertedStartingPrice] = useState(0);
  const [convertedNextBid, setConvertedNextBid] = useState(0);

  // Get auth token and currency from Redux
  const user = useSelector((state: RootState) => state.user.user);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const userToken = useSelector((state: RootState) => state.user.token);
  const vendorToken = useSelector((state: RootState) => state.vendor?.token);
  const { currency } = useSelector((state: RootState) => state.settings);
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const authToken = userToken || vendorToken || "";
  const currencySymbol = getCurrencySymbol(currency);

  // Owner cannot bid
  const currentUserId = user?._id || vendor?._id;
  const isOwner = auction?.poster._id === currentUserId;
  const hasExistingBid = auction?.bids.some((bid, index) => {
    const bidderId = typeof bid.bidder === "string" ? bid.bidder : bid.bidder?._id;
    const matches = bidderId === currentUserId;
    console.log("Checking bid:", {
      bidId: bid._id,
      bidder: bid.bidder,
      bidderId,
      currentUserId,
      matches,
      index,
    });
    if (!bid._id) {
      console.warn(`Bid at index ${index} has undefined _id`);
    }
    if (typeof bid.bidder !== "string" && !bid.bidder?._id) {
      console.warn(`Bid at index ${index} has invalid bidder format:`, bid.bidder);
    }
    return matches;
  });
  console.log("hasExistingBid:", hasExistingBid);

  // Ensure sessionId is initialized
  useEffect(() => {
    if (!sessionId) {
      dispatch(initializeSession());
    }
  }, [dispatch, sessionId]);

  // Fetch auction data
  useEffect(() => {
    if (!id) {
      setError("Invalid auction ID. Please check the URL.");
      setLoading(false);
      return;
    }

    const fetchAuctionData = async () => {
      setLoading(true);
      try {
        const auctionData = await getAuctionById(id);
        const auctionItem = auctionData?.data;
        if (!auctionItem) throw new Error("Auction not found");

        // Log raw auction data to inspect bids
        console.log("Raw auction data:", JSON.stringify(auctionItem, null, 2));
        setAuction(auctionItem);
        setTimeLeft(getTimeLeft(auctionItem.auctionEndDate));
      } catch (err: any) {
        console.error("Error fetching auction data:", err);
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
  }, [id]);

  // Convert prices when auction or currency changes
  useEffect(() => {
    if (auction) {
      const convertPrices = async () => {
        setIsPriceLoading(true);
        try {
          const currentBid = await convertPrice(
            auction.highestBid?.amount || auction.startingPrice,
            "NGN",
            currency
          );
          const startingPrice = await convertPrice(
            auction.startingPrice,
            "NGN",
            currency
          );
          const nextBid = await convertPrice(
            (auction.highestBid?.amount || auction.startingPrice) + 250,
            "NGN",
            currency
          );
          setConvertedCurrentBid(currentBid);
          setConvertedStartingPrice(startingPrice);
          setConvertedNextBid(nextBid);
        } catch (error) {
          console.error("Failed to convert prices:", error);
          setConvertedCurrentBid(
            auction.highestBid?.amount || auction.startingPrice
          );
          setConvertedStartingPrice(auction.startingPrice);
          setConvertedNextBid(
            (auction.highestBid?.amount || auction.startingPrice) + 250
          );
        } finally {
          setIsPriceLoading(false);
        }
      };
      convertPrices();
    }
  }, [auction, currency]);

  // Pre-fill bid amount for existing bids
  useEffect(() => {
    if (hasExistingBid && auction) {
      const currentBid = auction.bids.find((bid) => {
        const bidderId = typeof bid.bidder === "string" ? bid.bidder : bid.bidder?._id;
        return bidderId === currentUserId;
      });
      if (currentBid) {
        const converted = convertPrice(currentBid.amount, "NGN", currency);
        setBidAmount(converted.toString());
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

  // Calculate time left with Africa/Lagos time zone
  function getTimeLeft(endTime: string) {
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
  }

  const isEnded =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  // Resolve bidder names for bidding history
  const getBidderName = (bidder: string | { _id?: string; email?: string; name?: string }, bidderModel: string) => {
    const bidderId = typeof bidder === "string" ? bidder : bidder?._id;
    if (bidderModel === "users" && user?._id === bidderId) {
      return user?.name || "You";
    }
    if (bidderModel === "vendors" && vendor?._id === bidderId) {
      return vendor?.storeName || "You";
    }
    if (auction && bidderId === auction.poster._id) {
      return auction.poster.storeName;
    }
    return typeof bidder === "string" ? "Anonymous Bidder" : bidder.name || "Anonymous Bidder";
  };

  const handlePlaceBid = async () => {
    if (!authToken) {
      navigate("/selectpath", { state: { from: `/auction/${id}` } });
      toast.error("Please log in to place a bid.");
      return;
    }
    if (!bidAmount || parseFloat(bidAmount) < convertedNextBid) {
      toast.error(
        `Bid must be at least ${currencySymbol} ${formatPrice(convertedNextBid)}`
      );
      return;
    }
    if (hasExistingBid && !window.confirm("Are you sure you want to update your bid?")) {
      return;
    }
    try {
      const bidInNGN = await convertPrice(parseFloat(bidAmount), currency, "NGN");
      console.log("Submitting bid:", { id, bidInNGN, authToken, hasExistingBid });
      let response;
      if (hasExistingBid) {
        console.log("Calling upgradeBid for auction:", id);
        response = await upgradeBid(id!, bidInNGN, authToken);
        toast.success(`Bid updated: ${currencySymbol} ${formatPrice(parseFloat(bidAmount))}`);
      } else {
        console.log("Calling placeBid for auction:", id);
        response = await placeBid(id!, bidInNGN, authToken);
        toast.success(`Bid placed: ${currencySymbol} ${formatPrice(parseFloat(bidAmount))}`);
      }
      console.log("Bid response:", response);
      setBidAmount("");
      const auctionData = await getAuctionById(id!);
      setAuction(auctionData?.data);
    } catch (err: any) {
      console.error("Error placing/updating bid:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
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
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
        <Link to="/">
          <Button className="mt-4 ml-4">Back to Auctions</Button>
        </Link>
      </div>
    );
  }
  if (!auction) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <p className="text-lg font-semibold text-foreground mb-2">
            Welcome to Mbaay
          </p>
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Auctions</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWatching(!isWatching)}
                className={isWatching ? "text-red-500 border-red-500" : ""}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isWatching ? "fill-red-500" : ""}`}
                />
                {isWatching ? "Watching" : "Watch"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Image Gallery */}
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full p-0 bg-white/90 hover:bg-white"
                    onClick={() =>
                      setCurrentImageIndex(
                        currentImageIndex === 0
                          ? auction.images.length - 1
                          : currentImageIndex - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full p-0 bg-white/90 hover:bg-white"
                    onClick={() =>
                      setCurrentImageIndex(
                        (currentImageIndex + 1) % auction.images.length
                      )
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {auction.images.length > 1 && (
              <div className="flex gap-3">
                {auction.images.map((image, index) => (
                  <button
                    key={image || `image-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-primary shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${auction.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auction Details */}
          <div className="space-y-6">
            {/* Title & Status */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge
                  variant={isEnded ? "destructive" : "default"}
                  className={`${
                    isEnded
                      ? "border-auction-ended text-slate-500"
                      : "border-auction-live"
                  }`}
                >
                  <Gavel className="mr-1 h-3 w-3" />
                  {isEnded ? "Auction Ended" : "Live Auction"}
                </Badge>
                {auction.verified && (
                  <Badge className="bg-gradient-gold text-primary font-semibold">
                    <Award className="mr-1 h-3 w-3" />
                    Premium
                  </Badge>
                )}
                <Badge variant="outline">Lot #LOT{auction._id.slice(-4)}</Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {auction.name}
              </h1>

              <p className="text-muted-foreground mb-4">
                {auction.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
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

            {/* Current Bid */}
            <Card className="border-primary/20 shadow-auction">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Current Bid
                    </p>
                    {isPriceLoading ? (
                      <span className="text-4xl font-bold">Loading...</span>
                    ) : (auction.highestBid?.amount ?? 0) === 0 &&
                      auction.bids.length === 0 ? (
                      <p className="text-4xl font-bold text-muted-foreground">
                        No bids yet
                      </p>
                    ) : (
                      <p className="text-4xl font-bold bg-gradient-primary bg-clip-text">
                        {currencySymbol} {formatPrice(convertedCurrentBid)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">
                      Starting Bid
                    </p>
                    {isPriceLoading ? (
                      <span className="text-lg font-semibold text-foreground">
                        Loading...
                      </span>
                    ) : (
                      <p className="text-lg font-semibold text-foreground">
                        {currencySymbol} {formatPrice(convertedStartingPrice)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Countdown */}
                {!isEnded && (
                  <div className="bg-muted rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Time Remaining
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {timeLeft.days.toString().padStart(2, "0")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Days
                        </div>
                      </div>
                      <span className="text-xl text-muted-foreground">:</span>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {timeLeft.hours.toString().padStart(2, "0")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Hours
                        </div>
                      </div>
                      <span className="text-xl text-muted-foreground">:</span>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {timeLeft.minutes.toString().padStart(2, "0")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Minutes
                        </div>
                      </div>
                      <span className="text-xl text-muted-foreground">:</span>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {timeLeft.seconds.toString().padStart(2, "0")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Seconds
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bidding */}
                {!isEnded ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        placeholder={`Minimum bid: ${currencySymbol} ${formatPrice(
                          convertedNextBid
                        )}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="flex-1"
                        disabled={isOwner}
                      />
                      <Button
                        onClick={handlePlaceBid}
                        disabled={
                          isOwner ||
                          !bidAmount ||
                          parseFloat(bidAmount) < convertedNextBid
                        }
                        className="bg-gradient-gold hover:opacity-90 text-primary font-semibold px-8"
                      >
                        {isOwner
                          ? "You can't bid"
                          : hasExistingBid
                          ? "Update Bid"
                          : "Place Bid"}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setBidAmount(convertedNextBid.toString())
                        }
                        disabled={isOwner}
                      >
                        {currencySymbol} {formatPrice(convertedNextBid)}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setBidAmount((convertedNextBid + 500).toString())
                        }
                        disabled={isOwner}
                      >
                        {currencySymbol} {formatPrice(convertedNextBid + 500)}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setBidAmount((convertedNextBid + 1000).toString())
                        }
                        disabled={isOwner}
                      >
                        {currencySymbol} {formatPrice(convertedNextBid + 1000)}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-lg font-semibold text-muted-foreground">
                      Auction has ended
                    </p>
                    <Button variant="outline" className="mt-2">
                      View Final Results
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-border">
                      <AvatarImage
                        src={auction.poster.image || "/placeholder.svg"}
                        alt={auction.poster.storeName}
                      />
                      <AvatarFallback className="font-bold text-xl">
                        {auction.poster.storeName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {auction.poster.storeName}
                        </h3>
                        {auction.verified && (
                          <Shield className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ★ 4.9 • 0 sales
                      </div>
                    </div>
                  </div>
                  <Link to={`/views-profile/${auction.poster._id}`}>
                    <Button variant="outline">View Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-12">
          <div className="w-full">
            {/* Tab Navigation */}
            <div className="grid w-full grid-cols-3 lg:grid-cols-4 lg:w-auto bg-muted p-1 rounded-md">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-all ${
                  activeTab === "details"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("bidding")}
                className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-all ${
                  activeTab === "bidding"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Bid History
              </button>
              <button
                onClick={() => setActiveTab("condition")}
                className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-all ${
                  activeTab === "condition"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Condition
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`hidden lg:flex px-3 py-1.5 text-sm font-medium rounded-sm transition-all ${
                  activeTab === "shipping"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Shipping
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "details" && (
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Item Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">
                            Specifications
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Category:
                              </span>
                              <span className="font-medium">
                                {auction.category}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Sub-Category:
                              </span>
                              <span className="font-medium">
                                {auction.sub_category}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Sub-Category 2:
                              </span>
                              <span className="font-medium">
                                {auction.sub_category2}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Inventory:
                              </span>
                              <span className="font-medium">
                                {auction.inventory}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">
                            Provenance
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            This item is from a reputable seller and has been
                            verified for authenticity.
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Authenticity:
                              </span>
                              <span className="font-medium text-green-600">
                                {auction.verified ? "Verified" : "Not Verified"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Created At:
                              </span>
                              <span className="font-medium">
                                {new Date(
                                  auction.createdAt
                                ).toLocaleDateString()}
                              </span>
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
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bidding History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auction.bids.length === 0 ? (
                        <p className="text-muted-foreground">No bids yet.</p>
                      ) : (
                        <>
                          {console.log(
                            "Bids for history:",
                            auction.bids.map((bid, index) => ({
                              id: bid._id,
                              bidder: bid.bidder,
                              amount: bid.amount,
                              createdAt: bid.createdAt,
                              index,
                            }))
                          )}
                          {[...auction.bids]
                            .sort((a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                            )
                            .map((bid, index) => {
                              if (!bid._id) {
                                console.warn(`Bid at index ${index} has undefined _id`);
                              }
                              return (
                                <div
                                  key={bid._id || `bid-${index}`}
                                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        bid.amount === auction.highestBid?.amount
                                          ? "bg-green-500"
                                          : "bg-muted-foreground"
                                      }`}
                                    />
                                    <span className="font-medium">
                                      {getBidderName(bid.bidder, bid.bidderModel)}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">
                                      {currencySymbol} {formatPrice(bid.amount)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(bid.createdAt).toLocaleString(
                                        "en-NG",
                                        {
                                          timeZone: "Africa/Lagos",
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "condition" && (
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Condition Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            {auction.verified ? "Excellent" : "Unknown"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Condition details are not provided in the API. Please
                          contact the seller for a detailed condition report.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping & Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">
                          Shipping Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground">
                            Contact seller for shipping details.
                          </p>
                          <p>
                            <span className="font-medium">Domestic:</span>{" "}
                            Available
                          </p>
                          <p>
                            <span className="font-medium">International:</span>{" "}
                            Available
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Payment Methods</h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground">
                            Contact seller for payment options.
                          </p>
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