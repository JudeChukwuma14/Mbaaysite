import React from "react";
import image from "../../assets/image/Group 14.png";
import card from "../../assets/image/card1.png";
import ProductCard2 from "../Cards/ProductCard2";
import Footer from "../static/Footer";

export const Layouts: React.FC = () => {
  const ImagePart = [
    { image: image, text: "Woman's Fashion" },
    { image: image, text: "Woman's Fashion" },
    { image: image, text: "Woman's Fashion" },
    { image: image, text: "Woman's Fashion" },
    { image: image, text: "Woman's Fashion" },
    { image: image, text: "Woman's Fashion" },
    { image: image, text: "Woman's Fashion" },
    { image: image, text: "Woman's Fashion" },
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
      <div className=" pl-4 py-3 mb-6 shadow-md">
        <h3 className=" font-semibold text-xl">Fashion</h3>
      </div>
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
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
      <div>
        <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 items-center">
          {
            ProductCard.map((item, index) => (
              <ProductCard2
                key={index}
                image={item.image}
                name={item.name}
                price={item.price}
                rating={item.rating}
                label={item.label}
              />
            ))
          }
        </div>
      </div>
      <Footer />
    </div>
  );
};
