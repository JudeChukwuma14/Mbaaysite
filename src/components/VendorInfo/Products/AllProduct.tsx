"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getVendorProducts } from "@/utils/VendorProductApi";
import { useSelector } from "react-redux";
import ProductDetailModal from "./ProductDetailModal";
import { get_single_vendor } from "@/utils/vendorApi";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Product {
  _id: string;
  name: string;
  category: string;
  sub_category: string;
  price: number;
  inventory: number;
  createdAt: string;
  description: string;
  status: string;
  subSubCategory: string;
  images: string[];
}

const AllProduct: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(5);
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const user = useSelector((state: any) => state.vendor);
  const { data: products } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => getVendorProducts(user.token),
  });

  const { data: vendors } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => get_single_vendor(user.token),
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [category, status]);

  const handleFilter = () => {
    setCurrentPage(1); // Reset to first page when filtering
    console.log(`Category: ${category}, Status: ${status}`);
  };

  // Filter products based on category and status
  const filteredProducts =
    products?.filter((product: Product) => {
      const categoryMatch = !category || product.category === category;
      const statusMatch =
        !status ||
        (status === "Stock" && product.inventory > 0) ||
        (status === "Out-Of-Stock" && product.inventory <= 0);

      return categoryMatch && statusMatch;
    }) || [];

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleProductClick = (product: Product, id: any) => {
    setSelectedProduct({
      ...product,
      productName: product.name,
      subCategory: product.sub_category,
      dateAdded: product.createdAt,
    });

    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const chartData = {
    labels: ["Clicks", "Sales", "Views"],
    datasets: [
      {
        label: "Overview",
        data: [25, 15, 40], // Replace with real data
        backgroundColor: ["#FFA500", "#4CAF50", "#2196F3"],
        hoverOffset: 6,
      },
    ],
  };

  return (
    <main className="p-5">
      <motion.div
        className="flex justify-between items-center mb-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Products Overview</h1>
        <NavLink to={"/app/new-product"}>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            + New Product
          </button>
        </NavLink>
      </motion.div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        <motion.div
          className="col-span-2 bg-white p-5 rounded-lg shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ maxWidth: "400px", maxHeight: "400px" }} // Reduced size
        >
          <Doughnut data={chartData} options={{ maintainAspectRatio: true }} />
        </motion.div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <motion.select
          className="border p-2 rounded outline-orange-500 border-orange-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {vendors?.craftCategories?.map((cat: string) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </motion.select>
        <motion.select
          className="border p-2 rounded border-orange-500 outline-orange-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Stock">Stock</option>
          <option value="Out-Of-Stock">Out-Of-Stock</option>
        </motion.select>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
          onClick={handleFilter}
        >
          Filter
        </button>
        <input
          type="text"
          placeholder="Search Product..."
          className="border p-2 flex-1 rounded border-orange-500 outline-orange-500"
        />
      </div>

      <motion.table
        className="w-full bg-white rounded-lg shadow overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Product Name</th>
            <th className="text-left p-3">Category</th>
            <th className="text-left p-3">Sub-Category</th>
            <th className="text-left p-3">Amount</th>
            <th className="text-left p-3">Stock</th>
            <th className="text-left p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts?.map((product: Product, index: number) => (
            <motion.tr
              key={product._id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleProductClick(product, product._id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <td className="p-3">{product.name}</td>
              <td className="p-3">{product.category}</td>
              <td className="p-3">{product.sub_category}</td>
              <td className="p-3">{product.price}</td>
              <td
                className={`p-3 ${
                  product.inventory <= 0
                    ? "text-red-500"
                    : product.inventory < 10
                    ? "text-amber-500"
                    : "text-green-500"
                }`}
              >
                {product.inventory <= 0
                  ? "Out of Stock"
                  : product.inventory < 10
                  ? "Low Stock"
                  : "In Stock"}
              </td>
              <td className="p-3">{product.createdAt.split("T")[0]}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productId={selectedProductId}
      />
    </main>
  );
};

export default AllProduct;
