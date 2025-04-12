import React from "react";
import image from "@/assets/image/Group 14.png";
import card from "@/assets/image/card1.png";
import ProductCard2 from "../../Cards/ProductCard2";
import { Link } from "react-router-dom";

const BeautyWellness: React.FC = () => {
  const ImagePart = [
    { image: image, link: "/skincare", text: "Skin Care" },
    { image: image, link: "/haircare", text: "Hair Care" },
    { image: image, link: "/bodycare", text: "Body Care" },
    { image: image, link: "/makeup", text: "Makeup" },
    { image: image, link: "/fragrances", text: "Fragrances" },
    { image: image, link: "/wellnessproduct", text: "Wellness Products" },
    { image: image, link: "/men-grooming", text: "Men’s Grooming" },
    { image: image, link: "/badychild-care", text: "Baby and Child Care" },
    { image: image, link: "/health-wellness", text: "Health and Wellness Kits" },
    { image: image, link: "/immuity-boost", text: "Immunity Boost Kits" },
  ];
  const ProductCard = [
    { image: card, name: "Jude", price: "200", rating: 4, label: "sales!" },
    { image: card, name: "Jude", price: "200", rating: 4, label: "sales!" },
    { image: card, name: "Jude", price: "200", rating: 4, label: "sales!" },
    { image: card, name: "Jude", price: "200", rating: 4, label: "sales!" },
    { image: card, name: "Jude", price: "200", rating: 4, label: "sales!" },
    { image: card, name: "Jude", price: "200", rating: 4, label: "sales!" },
    { image: card, name: "Jude", price: "200", rating: 4, label: "sales!" },
    { image: card, name: "Jude", price: "200", rating: 4, label: "sales!" },
    { image: card, name: "Jude", price: "200", rating: 4, label: "sales!" },
    { image: card, name: "Jude", price: "200", rating: 4, label: "sales!" },
  ];
  return (
    <div>
      <div className="py-3 pl-10 mb-10 ">
        <h3 className="text-xl font-semibold ">
          <Link to={"/"}>Home</Link> / Beauty Wellness
        </h3>
      </div>
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:grid-cols-5">
          {ImagePart.map((item, index) => (
            <Link to={item.link}>
              <div
                key={index}
                className="flex flex-col items-center justify-center"
              >
                <img src={item.image} alt="" width={300} height={300} />
                <p className="text-center ">{item.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <div className="grid items-center grid-cols-1 gap-4 px-4 py-8 md:grid-cols-3 lg:grid-cols-5">
          {ProductCard.map((item, index) => (
            <ProductCard2
              key={index}
              image={item.image}
              name={item.name}
              price={item.price}
              rating={item.rating}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeautyWellness;
