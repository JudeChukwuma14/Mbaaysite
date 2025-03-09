import React from "react";
import image from "@/assets/image/Group 14.png";
import card from "@/assets/image/card1.png";
import ProductCard2 from "../Cards/ProductCard2";

const LocalFood: React.FC = () => {
  const ImagePart = [
    { image: image, text: "Staple Foods" },
    { image: image, text: "Specialty Grains & Legumes" },
    { image: image, text: "Traditional Snacks & Street Foods" },
    { image: image, text: "Indigenous Baked Goods" },
    { image: image, text: "Traditional Soups & Stews" },
    { image: image, text: "Fermented & Preserved Foods" },
    { image: image, text: "Local Beverages" },
    { image: image, text: "Regional & Ethnic Foods" },
    { image: image, text: "Ethnic Sauces, Spices & Seasonings" },
    { image: image, text: "Culturally Specific Food Categories" },
    { image: image, text: "Traditional Sweets & Desserts" },
    { image: image, text: "Packaged & Ready-to-Eat Foods" },
    { image: image, text: "Traditional Oils & Fats" },
    { image: image, text: "Local Grains & Flours" },
    { image: image, text: "Fermented & Pickled Foods" },
    { image: image, text: "Cultural Holiday & Festival Foods" },
    { image: image, text: "Meal Plans & Subscription Boxes" },
    { image: image, text: "Cultural Holiday & Festival Foods" },
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
      <div className=" pl-10 py-3 mb-6">
        <h3 className=" font-semibold text-xl">Jewelry</h3>
      </div>
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
          {ImagePart.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <img src={item.image} alt="" width={300} height={300} />
              <p className=" text-center">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 py-8 items-center">
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

export default LocalFood;
