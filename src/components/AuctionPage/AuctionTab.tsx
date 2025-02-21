import { useState } from "react";

const AuctionTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof tabs>("Description");
  const [bids, setBids] = useState([
    { name: "Finbarr", amount: 4000 },
    { name: "Finbarr", amount: 3800 },
    { name: "Finbarr", amount: 3000 },
    { name: "Finbarr", amount: 2500 },
    { name: "Finbarr", amount: 2000 },
    { name: "Finbarr", amount: 1000 },
  ]);

  const placeBid = (amount: number) => {
    setBids((prevBids) =>
      [...prevBids, { name: "New Bidder", amount }].sort((a, b) => b.amount - a.amount)
    );
    setActiveTab("Current Bids"); // Switch to "Current Bids" tab automatically
  };

  const tabs: { [key: string]: React.ReactNode } = {
    Description: "PlayStation 5 Controller Skin. High-quality vinyl with air channel adhesive for easy, bubble-free installation and mess-free removal. Pressure-sensitive.",
    
    "Current Bids": (
      <table className="w-full mt-4 border-t">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 px-4">Information</th>
            <th className="py-2 px-4">Bids</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 flex items-center gap-2">
                <img src="/avatars/user1.jpg" alt="User" className="w-8 h-8 rounded-full" />
                {bid.name}
              </td>
              <td className="py-2 px-4 text-orange-500 font-semibold">${bid.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),

    Reviews: (
      <div>
        <h3 className="text-lg font-semibold">Review (03) :</h3>
        <div className="space-y-4 mt-2">
          <div className="flex gap-3 border-b pb-3">
            <img src="/avatars/user1.jpg" alt="User" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold">Mr. Bowmik Haldar, <span className="text-sm text-gray-500">12 January, 2024</span></p>
              <div className="flex text-yellow-500">{"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}</div>
              <p className="text-sm text-gray-700 mt-1">Great product, fast shipping. Would buy again!</p>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="border-t pt-4">
      <div className="flex gap-4 border-b pb-2">
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 ${activeTab === tab ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-600"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-700">{tabs[activeTab]}</div>

      {/* Simulated Bid Button */}
      <button
        onClick={() => placeBid(Math.floor(Math.random() * 5000) + 500)}
        className="mt-4 px-5 bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
      >
        Place Bid
      </button>
    </div>
  );
};

export default AuctionTabs;
