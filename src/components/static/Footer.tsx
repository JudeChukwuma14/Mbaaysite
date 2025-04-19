import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Paypal from "@/assets/image/PayPal.png";
import MasterCard from "@/assets/image/Mastercard.png";
import Stripe from "@/assets/image/Stripe.png";
import Visa from "@/assets/image/Visa.png";
// import ApplePay from "@/assets/image/random-productPay.png";
import Google from "@/assets/image/GooglePlay.png";
import AppStore from "@/assets/image/AppStore.png";
import logo from "@/assets/image/mbbaylogo.png";

const Footer:React.FC = () => {
  return (
    <footer className="py-10 text-white bg-black">
      <div className="container px-6 mx-auto">
        <div className="mb-8">
            <img src={logo} alt="/" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:text-left">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Subscribe</h2>
            <p className="mb-4 text-sm">Get 10% off your first order</p>
            <div className="flex justify-center md:justify-start">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-3/4 p-2 text-white bg-gray-800 rounded-l md:w-auto"
              />
              <button className="p-2 bg-orange-500 rounded-r">
                &gt;
              </button>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Support</h2>
            <p className="text-sm">111 Bijoy Sarani, Dhaka,</p>
            <p className="text-sm">DH 1515, Bangladesh.</p>
            <p className="mt-4 text-sm">mbaay.com@gmail.com</p>
            <p className="text-sm">+88015-88888-9999</p>
          </div>


          <div>
            <h2 className="mb-4 text-xl font-semibold">Account</h2>
            <ul className="space-y-2 text-sm">
              <li>My Account</li>
              <li>Login / Register</li>
              <li>Cart</li>
              <li>Wishlist</li>
              <li>Shop</li>
            </ul>
          </div>


          <div>
            <h2 className="mb-4 text-xl font-semibold">Quick Link</h2>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Terms Of Use</li>
              <li>FAQ</li>
              <li>Contact</li>
            </ul>
          </div>


          <div>
            <h2 className="mb-4 text-xl font-semibold">Download App</h2>
            <p className="mb-4 text-sm">Save $3 with App New User Only</p>
            <div className="flex justify-center mb-4 space-x-2 md:justify-start">
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
            <div className="flex justify-center space-x-4 text-lg md:justify-start">
              <FaFacebookF />
              <FaTwitter />
              <FaInstagram />
              <FaLinkedinIn />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700"></div>   
        <div className="flex flex-col items-center justify-between px-6 mt-6 space-y-4 text-sm md:flex-row md:space-y-0">
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
            {/* <img
              src={ApplePay}
              alt="Apple Pay"
              className="h-6"
            /> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
