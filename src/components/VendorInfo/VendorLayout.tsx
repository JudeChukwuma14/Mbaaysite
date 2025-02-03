import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import VendorHeader from "./VendorHeader";

const DashboardLayout = () => {
    return (
      <div className="flex h-screen bg-gray-100">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <VendorHeader />
          <main className="p-5 flex-1 overflow-auto">
            {/* <div className="grid grid-cols-4 gap-4 mb-5">
              <Card title="Wallet Balance" value="$34,000" />
              <Card title="Total Orders" value="3,234" />
              <Card title="Products Sold" value="1,455" />
              <Card title="Account Type" value="Counter" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-white rounded-lg p-5 shadow">
                <h2 className="font-bold mb-4">Revenue Report</h2>
                <div className="h-40 bg-gray-200 rounded">Graph Placeholder</div>
              </div>
              <div className="bg-white rounded-lg p-5 shadow">
                <h2 className="font-bold mb-4">Recent Notifications</h2>
                <ul className="text-sm">
                  <li className="mb-2">Your account is logged in...</li>
                  <li className="mb-2">Your account is logged in...</li>
                  <li>Your account is logged in...</li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 shadow mt-5">
              <h2 className="font-bold mb-4">All Orders</h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">ID</th>
                    <th>Client Name</th>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">#12356</td>
                    <td>Chukwuma Jude</td>
                    <td>Wooden Pots (Clay)</td>
                    <td>10</td>
                    <td>$50,000</td>
                    <td>Arts and craft</td>
                    <td className="text-yellow-500">Pending</td>
                  </tr>
                  <tr>
                    <td className="py-2">#12357</td>
                    <td>Abbas Mohammed</td>
                    <td>Ankara Dress</td>
                    <td>15</td>
                    <td>$75,000</td>
                    <td>Fashion</td>
                    <td className="text-green-500">Delivered</td>
                  </tr>
                </tbody>
              </table>
            </div> */}
            <Outlet/>
          </main>
        </div>
      </div>
    );
  };
  
//   const Card = ({ title, value }: { title: string; value: string }) => (
//     <div className="bg-white rounded-lg p-5 shadow">
//       <h3 className="text-sm text-gray-500">{title}</h3>
//       <p className="text-2xl font-bold text-gray-800">{value}</p>
//     </div>
//   );
  
  export default DashboardLayout;