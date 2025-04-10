import React from "react";
import image from "@/assets/image/Group 14.png";
import card from "@/assets/image/card1.png";
import ProductCard2 from "@/components/Cards/ProductCard2";

const Jewelry: React.FC = () => {
  const ImagePart = [
    { image: image, text: "Handmade Jewelry" },
    { image: image, text: "Gemstones" },
    { image: image, text: "Jewelry Materials" },
    { image: image, text: "Men’s Jewelry" },
    { image: image, text: "Children’s Jewelry" },
    { image: image, text: "Bridal & Special Occasion Jewelry" },
    { image: image, text: "Cultural & Traditional Jewelry" },
    { image: image, text: "Gemstone Jewelry by Birthstone" },
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
      <div className="py-3 pl-10 mb-6 ">
        <h3 className="text-xl font-semibold ">Jewelry</h3>
      </div>
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:grid-cols-5">
          {ImagePart.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <img src={item.image} alt="" width={300} height={300} />
              <p className="text-center ">{item.text}</p>
            </div>
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

export default Jewelry;
