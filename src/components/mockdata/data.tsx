import pro1 from "@/assets/image/pro1.jpg";
import pro2 from "@/assets/image/pro2.jpg";
import pro3 from "@/assets/image/pro3.jpg";
import pro4 from "@/assets/image/pro4.jpg";
import vendorbg from "@/assets/image/vendorbg.png";
import vendorpr from "@/assets/image/vendorpr.png";
import Gear from "@/assets/image/Gear.jpg";

interface Product {
  id: string;
  title: string;
  currentPrice: string;
  originalPrice: string;
  image: string;
  rating: number;
  reviews: number;
}
export const ProductData: Product[] = [
  {
    id: "1",
    image: pro1,
    currentPrice: "250",
    originalPrice: "400",
    rating: 4,
    reviews: 3,
    title: "Fashion",
  },
  {
    id: "2",
    image: pro2,
    currentPrice: "250",
    originalPrice: "400",
    rating: 4,
    reviews: 3,
    title: "Jewelry",
  },
  {
    id: "3",
    image: pro3,
    currentPrice: "250",
    originalPrice: "400",
    rating: 4,
    reviews: 3,
    title: "Art",
  },
  {
    id: "4",
    image: pro4,
    currentPrice: "250",
    originalPrice: "400",
    rating: 4,
    reviews: 3,
    title: "Fragrances",
  },
  {
    id: "5",
    image: pro1,
    currentPrice: "250",
    originalPrice: "400",
    rating: 4,
    reviews: 3,
    title: "Wellness products",
  },
];

export const profilesData = [
  {
    backgroundImage: vendorbg,
    avatar: vendorpr,
    name: "Johnathan Grandy",
    profession: "Photographer",
    location: "Lagos, Nigeria",
  },
  {
    backgroundImage: vendorbg,
    avatar: vendorpr,
    name: "Johnathan Grandy",
    profession: "Photographer",
    location: "Lagos, Nigeria",
  },
  {
    backgroundImage: vendorbg,
    avatar: vendorpr,
    name: "Johnathan Grandy",
    profession: "Photographer",
    location: "Lagos, Nigeria",
  },
  {
    backgroundImage: vendorbg,
    avatar: vendorpr,
    name: "Johnathan Grandy",
    profession: "Photographer",
    location: "Lagos, Nigeria",
  },
  {
    backgroundImage: vendorbg,
    avatar: vendorpr,
    name: "Johnathan Grandy",
    profession: "Photographer",
    location: "Lagos, Nigeria",
  },

  {
    backgroundImage: vendorbg,
    avatar: vendorpr,
    name: "Johnathan Grandy",
    profession: "Photographer",
    location: "Lagos, Nigeria",
  },
  {
    backgroundImage: vendorbg,
    avatar: vendorpr,
    name: "Johnathan Grandy",
    profession: "Photographer",
    location: "Lagos, Nigeria",
  },
  {
    backgroundImage: vendorbg,
    avatar: vendorpr,
    name: "Johnathan Grandy",
    profession: "Photographer",
    location: "Lagos, Nigeria",
  },
];

export const flashSale = [
  {
    performance: "-47%",
    id: 1,
    title: "AK-900 Wired Keyboard",
    price: 960,
    originalPrice: 1160,
    image:
      "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
    rating: 4,
    reviews: 75,
  },
  {
    performance: "-99%",
    id: 2,
    title: "Wireless Headphones",
    price: 99.99,
    originalPrice: 129.99,
    image:
      "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
    rating: 5,
    reviews: 120,
  },
  {
    performance: "-49%",
    id: 3,
    title: "Smartwatch",
    price: 199.99,
    originalPrice: 249.99,
    image:
      "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
    rating: 4,
    reviews: 90,
  },
  {
    performance: "-29%",
    id: 4,
    title: "Bluetooth Speaker",
    price: 49.99,
    originalPrice: 69.99,
    image:
      "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
    rating: 3,
    reviews: 50,
  },
  {
    performance: "-50%",
    id: 5,
    title: "Gaming Keyboard",
    price: 79.99,
    originalPrice: 99.99,
    image:
      "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
    rating: 4,
    reviews: 80,
  },
  {
    performance: "-49%",
    id: 6,
    title: "Gaming Keyboard",
    price: 79.99,
    originalPrice: 99.99,
    image:
      "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
    rating: 4,
    reviews: 80,
  },
  {
    performance: "-40%",
    id: 7,
    title: "Gaming Keyboard",
    price: 79.99,
    originalPrice: 99.99,
    image:
      "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
    rating: 4,
    reviews: 80,
  },
  {
    performance: "-30%",
    id: 8,
    title: "Gaming Keyboard",
    price: 79.99,
    originalPrice: 99.99,
    image:
      "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
    rating: 4,
    reviews: 80,
  },
];

export const categories = [
  {
    title: "Professional Camera Zoom",
    image: Gear, // Replace with actual image
    bgColor: "bg-purple-300",
    link: "#",
    para: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Gear 360°",
    image: Gear,
    bgColor: "bg-gray-200",
    link: "#",
    para: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Black Friday Deals",
    image: Gear,
    bgColor: "bg-black text-white",
    link: "#",
    para: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Apple Macbook Air 15.6”",
    image: Gear,
    bgColor: "bg-white",
    link: "#",
    para: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];

export const ExploreData = [
  {
    image:
      "https://i.pinimg.com/736x/69/53/5d/69535dee69e1ca455e53b3eb8567e259.jpg",
    title: "Canon EOS DSLR Camera",
    price: 360,
    rating: 4,
    reviews: 95,
  },
  {
    image:
      "https://i.pinimg.com/736x/69/53/5d/69535dee69e1ca455e53b3eb8567e259.jpg",
    title: "Sony Mirrorless Camera",
    price: 500,
    rating: 2,
    reviews: 120,
  },
  {
    image:
      "https://i.pinimg.com/736x/69/53/5d/69535dee69e1ca455e53b3eb8567e259.jpg",
    title: "Breed Dry Dog Food",
    price: 500,
    rating: 2,
    reviews: 120,
  },
  {
    image:
      "https://i.pinimg.com/736x/69/53/5d/69535dee69e1ca455e53b3eb8567e259.jpg",
    title: "ASUS FHD Gaming Laptop",
    price: 500,
    rating: 2,
    reviews: 120,
  },
  {
    image:
      "https://i.pinimg.com/736x/69/53/5d/69535dee69e1ca455e53b3eb8567e259.jpg",
    title: "Curology Product Set",
    price: 500,
    rating: 2,
    reviews: 120,
  },
  {
    image:
      "https://i.pinimg.com/736x/69/53/5d/69535dee69e1ca455e53b3eb8567e259.jpg",
    title: "Kids Electric Car",
    price: 500,
    rating: 2,
    reviews: 120,
  },
  {
    image:
      "https://i.pinimg.com/736x/69/53/5d/69535dee69e1ca455e53b3eb8567e259.jpg",
    title: "Sony Mirrorless Camera",
    price: 500,
    rating: 2,
    reviews: 120,
  },
  {
    image:
      "https://i.pinimg.com/736x/69/53/5d/69535dee69e1ca455e53b3eb8567e259.jpg",
    title: "GP11 Shooter USB Gamepad",
    price: 500,
    rating: 2,
    reviews: 120,
  },
];
