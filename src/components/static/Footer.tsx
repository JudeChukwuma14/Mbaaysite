import React, { useState } from "react";
import { FaFacebookF,  FaInstagram, FaLinkedinIn, FaArrowRight } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Paypal from "@/assets/image/PayPal.png";
import MasterCard from "@/assets/image/Mastercard.png";
import Stripe from "@/assets/image/Stripe.png";
import Visa from "@/assets/image/Visa.png";
import logo from "@/assets/image/mbbaylogo.png";

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
    support: ["Privacy Policy", "Terms of Use", "FAQ", "Contact"],
    account: ["My Account", "Login / Register", "Cart", "Wishlist", "Shop"]
  };

  const socialLinks = [
    { icon: FaFacebookF, url: "#", label: "Facebook" },
    { icon: FaXTwitter, url: "https://x.com/@mbaay_com", label: "Twitter" },
    { icon: FaInstagram, url: "https://www.instagram.com/mbaay_com?igsh=anRpaGpjNjN2aThn ", label: "Instagram" },
    { icon: FaLinkedinIn, url: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container px-6 mx-auto py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Social */}
          <div className="lg:col-span-1">
            <img src={logo} alt="Mbaay" className="h-12 mb-4 brightness-0 invert" />
            <p className="text-gray-400 text-sm mb-4">
              Your trusted destination for quality products and exceptional service.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {links.support.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-orange-500 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {links.account.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-orange-500 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-3">Get 10% off your first order</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 text-sm rounded-l focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-r transition-colors"
              >
                <FaArrowRight className="text-sm" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Mbaay. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">We accept:</span>
              <div className="flex space-x-2">
                <img src={Paypal} alt="PayPal" className="h-5" />
                <img src={MasterCard} alt="MasterCard" className="h-5" />
                <img src={Visa} alt="Visa" className="h-5" />
                <img src={Stripe} alt="Stripe" className="h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;