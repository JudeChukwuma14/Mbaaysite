"use client"

import { Link } from "react-router-dom"
import MobileNavbar from "../ui/MobileNavbar"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

const Navbar = () => {
  // Access user and vendor from Redux store
  const { user } = useSelector((state: RootState) => state.user)
  const { vendor } = useSelector((state: RootState) => state.vendor)

  // Determine the display name and initials
  const displayName = user?.name || vendor?.storeName || ""
  const initials = displayName
    ? displayName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : ""

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#F3F4F6] w-full fixed z-50 flex items-center justify-between px-6 py-3 lg:px-10"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-1">
        <motion.img
          src="https://mbaaysite-6b8n.vercel.app/assets/MBLogo-spwX6zWd.png"
          alt="Logo"
          width={60}
          height={60}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        />
      </Link>

      {/* User Initials or Login Indicator */}
      <div className="flex items-center gap-5">
        {initials ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white bg-orange-500 rounded-full"
            title={displayName} // Tooltip with full name
          >
            {initials}
          </motion.div>
        ) : (
          <Link to="/signin" className="text-sm font-semibold text-orange-500 hover:underline">
            Sign In
          </Link>
        )}

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <MobileNavbar />
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
