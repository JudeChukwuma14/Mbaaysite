import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Auction } from "../mockdata/data";
import { useParams } from "react-router-dom";
import AuctionCard from "./AuctionCard";
import AuctionTabs from "./AuctionTab";

const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const auction = Auction.find((item) => item.id === id);

  if (!auction) {
    return <div className="text-center text-red-500">Auction not found</div>;
  }

  const [selectedImage, setSelectedImage] = useState(auction.image);
  const [bidAmount, setBidAmount] = useState(auction.currentBid + 100);
  const [activeTab, setActiveTab] = useState("Description");

  useEffect(() => {
    setSelectedImage(auction.image);
  }, [auction]);

  const increaseBid = () => setBidAmount((prev) => prev + 100);
  const decreaseBid = () =>
    setBidAmount((prev) => (prev > auction.currentBid ? prev - 100 : prev));

  return (
    <div className="px-8">
      <div className="max-w-6xl mx-auto mt-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          <img src={selectedImage} alt="Product" className="w-full h-96 object-cover rounded-lg" />
          <div className="flex gap-2">
            {[auction.image, auction.image, auction.image, auction.image].map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Thumbnail"
                className={`w-20 h-20 object-cover border ${
                  selectedImage === img ? "border-orange-500" : "border-gray-300"
                } cursor-pointer`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right: Auction Details */}
        <div className="space-y-6">
          <div>
            <span className="bg-orange-200 text-orange-700 px-2 py-1 text-xs rounded">
              Lot: #{auction.lotNumber}
            </span>
            <h1 className="text-3xl font-bold mt-2">{auction.title}</h1>
            <p className="text-gray-500">{auction.description}</p>
          </div>

          <div className="border-t pt-4">
            <p className="text-3xl font-semibold">${auction.currentBid}</p>
            <p className="text-sm text-gray-600">Auction ends: {auction.endTime.toLocaleString()}</p>
          </div>

          {/* Bid Input */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold">Place your bid:</p>
            <div className="flex items-center gap-2 mt-2">
              <button className="p-2 border rounded bg-gray-200" onClick={decreaseBid}>
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="text-center w-24 border rounded px-2 py-1"
              />
              <button className="p-2 border rounded bg-gray-200" onClick={increaseBid}>
                <Plus size={16} />
              </button>
            </div>
            <button className="mt-4 px-5 bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
              Place Bid
            </button>
          </div>

          {/* Payment Options */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold">Guaranteed Safe Checkout</p>
            <div className="flex gap-2 mt-2">
              <img src="/icons/paypal.png" alt="PayPal" className="h-8" />
              <img src="/icons/stripe.png" alt="Stripe" className="h-8" />
              <img src="/icons/visa.png" alt="Visa" className="h-8" />
              <img src="/icons/applepay.png" alt="Apple Pay" className="h-8" />
            </div>
          </div>

          {/* Tabs Section */}
          <div className=" pt-4">
          <AuctionTabs/>
          </div>
        </div>
      </div>

      {/* Related Auctions */}
      <div className="mt-10">
        <h1 className="text-4xl font-bold mb-6">Related Auctions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {Auction.slice(0, 8).map((item) => (
            <AuctionCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
