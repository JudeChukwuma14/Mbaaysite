import React from "react";
import { FiPhone, FiMail } from "react-icons/fi";

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-4 lg:px-10 py-8">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 ">
        {/* Left Section */}
        <div className="bg-white py-6 rounded-lg lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">
            <FiPhone className="inline-block mr-2 text-orange-500" />
            Call To Us
          </h2>
          <p className="mb-2">We are available 24/7, 7 days a week.</p>
          <p className="font-semibold">Phone: +88016111112222</p>
          <h2 className="text-xl font-semibold mt-6 mb-4">
            <FiMail className="inline-block mr-2 text-orange-500" />
            Write To Us
          </h2>
          <p>Fill out our form and we will contact you within 24 hours.</p>
          <p className="font-semibold">Emails:</p>
          <p>customer@mbaay.com</p>
          <p>support@mbaay.com</p>
        </div>
        {/* Right Section */}
        <div className="bg-white py-6 rounded-lg col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Message</h2>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your Name *"
                className="border border-gray-300 rounded-md p-2"
                required
              />
              <input
                type="email"
                placeholder="Your Email *"
                className="border border-gray-300 rounded-md p-2"
                required
              />
              <input
                type="tel"
                placeholder="Your Phone *"
                className="border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <textarea
              placeholder="Your Message"
              className="border border-gray-300 rounded-md p-2 w-full h-32 resize-none" // Added resize-none to prevent resizing
            ></textarea>
            <button
              type="submit"
              className="mt-4 bg-orange-500 text-white rounded-md py-2 px-4 hover:bg-orange-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;