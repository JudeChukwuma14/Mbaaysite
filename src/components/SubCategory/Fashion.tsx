import React from "react";
import image from "@/assets/image/Group 14.png";
import card from "@/assets/image/card1.png";
import ProductCard2 from "../Cards/ProductCard2";

const Fashion: React.FC = () => {
  const ImagePart = [
    { image: image, text: "Women's Fashion" },
    { image: image, text: "Men Fashion" },
    { image: image, text: "Kid’s Fashion" },
    { image: image, text: "Accessories (Hats, Belts)" },
    { image: image, text: "Fashion Jewelry" },
    { image: image, text: "Sports wear" },
    { image: image, text: "Ethnic Wear" },
    { image: image, text: "Footwear" },
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
        <h3 className=" font-semibold text-xl">Fashion</h3>
      </div>
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
          {ImagePart.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <img src={item.image} alt="" width={300} height={300} />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <section className=" py-10">
        <div>
          <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-8 py-8 items-center">
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
      </section>
    </div>
  );
};

export default Fashion;
