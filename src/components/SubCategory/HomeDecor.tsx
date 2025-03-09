import React from "react";
import image from "@/assets/image/Group 14.png";
import card from "@/assets/image/card1.png";
import ProductCard2 from "../Cards/ProductCard2";

const HomeDecor: React.FC = () => {
  const ImagePart = [
    { image: image, text: "Textiles and Fabrics" },
    { image: image, text: "Ceramics and Pottery" },
    { image: image, text: "Woodcraft" },
    { image: image, text: "Metalwork" },
    { image: image, text: "Baskets and Weaving" },
    { image: image, text: "Glasswork" },
    { image: image, text: "Leather Goods" },
    { image: image, text: "Beaded Decor" },
    { image: image, text: "Stone and Marble Crafts" },
    { image: image, text: "Handcrafted Lamps and Lighting" },
    { image: image, text: "Wall Art" },
    { image: image, text: "Jewelry and Trinket Boxes" },
    { image: image, text: "Mirrors" },
    { image: image, text: "Handwoven Mats and Carpets" },
    { image: image, text: "Handcrafted Kitchenware" },
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

export default HomeDecor;
