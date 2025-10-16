import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaArrowRight } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Paypal from "@/assets/image/PayPal.png";
import MasterCard from "@/assets/image/Mastercard.png";
import Stripe from "@/assets/image/Stripe.png";
import Visa from "@/assets/image/Visa.png";
import logo from "@/assets/image/mbbaylogo.png";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed with email:", email);
      setEmail("");
    }
  };

  const links = {
    support: [
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "FAQ", path: "/faq" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" }
    ],
    account: [
      { name: "Get Started", path: "/selectpath" },
      { name: "Shopping Cart", path: "/cart" },
      { name: "Wishlist", path: "/wishlist" },
      { name: "Products", path: "/random-product" }
    ],
  };

  const socialLinks = [
    { icon: FaFacebookF, url: "#", label: "Facebook" },
    { icon: FaXTwitter, url: "https://x.com/@mbaay_com", label: "Twitter" },
    { icon: FaInstagram, url: "https://www.instagram.com/mbaay_com?igsh=anRpaGpjNjN2aThn", label: "Instagram" },
    { icon: FaLinkedinIn, url: "#", label: "LinkedIn" }
  ];

  const paymentMethods = [
    { src: Paypal, alt: "PayPal" },
    { src: MasterCard, alt: "MasterCard" },
    { src: Visa, alt: "Visa" },
    { src: Stripe, alt: "Stripe" }
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container px-6 mx-auto py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Brand & Social */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <img src={logo} alt="Mbaay" className="h-14 mb-4 brightness-0 invert" />
            </Link>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Your trusted destination for quality products and exceptional service. 
              We're committed to providing the best shopping experience.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {links.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-medium block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Account</h3>
            <ul className="space-y-3">
              {links.account.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-medium block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Subscribe to get 10% off your first order and stay updated with our latest offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-gray-700 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
              <p className="text-gray-400 text-xs">
                By subscribing, you agree to our Privacy Policy
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Mbaay. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Built with ❤️ for amazing shopping experiences
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-gray-400 text-sm font-medium">We accept:</span>
              <div className="flex space-x-3">
                {paymentMethods.map((method, index) => (
                  <img
                    key={index}
                    src={method.src}
                    alt={method.alt}
                    className="h-6 opacity-80 hover:opacity-100 transition-opacity duration-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;