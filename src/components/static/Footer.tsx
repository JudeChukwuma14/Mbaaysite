import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Paypal from "@/assets/image/PayPal.png";
import MasterCard from "@/assets/image/Mastercard.png";
import Stripe from "@/assets/image/Stripe.png";
import Visa from "@/assets/image/Visa.png";
import ApplePay from "@/assets/image/ShopPay.png";
import Google from "@/assets/image/GooglePlay.png";
import AppStore from "@/assets/image/AppStore.png";
import logo from "@/assets/image/mbbaylogo.png";

const Footer:React.FC = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-6">
        <div className="mb-8">
            <img src={logo} alt="/" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:text-left">
          <div>
            <h2 className="text-xl font-semibold mb-4">Subscribe</h2>
            <p className="text-sm mb-4">Get 10% off your first order</p>
            <div className="flex justify-center md:justify-start">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 rounded-l bg-gray-800 text-white w-3/4 md:w-auto"
              />
              <button className="p-2 bg-orange-500 rounded-r">
                &gt;
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Support</h2>
            <p className="text-sm">111 Bijoy Sarani, Dhaka,</p>
            <p className="text-sm">DH 1515, Bangladesh.</p>
            <p className="text-sm mt-4">mbaay.com@gmail.com</p>
            <p className="text-sm">+88015-88888-9999</p>
          </div>


          <div>
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <ul className="text-sm space-y-2">
              <li>My Account</li>
              <li>Login / Register</li>
              <li>Cart</li>
              <li>Wishlist</li>
              <li>Shop</li>
            </ul>
          </div>


          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Link</h2>
            <ul className="text-sm space-y-2">
              <li>Privacy Policy</li>
              <li>Terms Of Use</li>
              <li>FAQ</li>
              <li>Contact</li>
            </ul>
          </div>


          <div>
            <h2 className="text-xl font-semibold mb-4">Download App</h2>
            <p className="text-sm mb-4">Save $3 with App New User Only</p>
            <div className="flex justify-center md:justify-start space-x-2 mb-4">
              <img
                src={Google}
                alt="Google Play"
                className="h-10"
              />
              <img
                src={AppStore}
                alt="App Store"
                className="h-10"
              />
            </div>
            <div className="flex justify-center md:justify-start space-x-4 text-lg">
              <FaFacebookF />
              <FaTwitter />
              <FaInstagram />
              <FaLinkedinIn />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8"></div>   
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0 text-sm px-6">
          <p>© 2024 Mbaay. All Rights Reserved</p>
          <div className="flex space-x-4">
            <img
              src={Paypal}
              alt="PayPal"
              className="h-6"
            />
            <img
              src={MasterCard}
              alt="MasterCard"
              className="h-6"
            />
            <img
              src={Stripe}
              alt="Stripe"
              className="h-6"
            />
            <img
              src={Visa}
              alt="Visa"
              className="h-6"
            />
            <img
              src={ApplePay}
              alt="Apple Pay"
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
