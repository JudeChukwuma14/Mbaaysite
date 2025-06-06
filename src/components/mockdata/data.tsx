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
      "https://i.pinimg.com/736x/6b/d4/f6/6bd4f67d1b2dd34e4da7f2411d57aa54.jpg",
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
      "https://i.pinimg.com/736x/b1/44/cd/b144cd3279e2d88c3446bf0add4ed990.jpg",
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
      "https://i.pinimg.com/736x/ff/f4/97/fff497da6353023e6a4be0921dee203c.jpg",
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
      "https://i.pinimg.com/736x/70/48/2b/70482b21403dba8b052c57f8558867e5.jpg",
    rating: 4,
    reviews: 80,
  },
  {
    performance: "-49%",
    id: 6,
    title: "Play Station 5",
    price: 79.99,
    originalPrice: 99.99,
    image:
      "https://i.pinimg.com/736x/27/5d/15/275d1500c36432f0c3be886344750d8e.jpg",
    rating: 4,
    reviews: 80,
  },
  {
    performance: "-40%",
    id: 7,
    title: "Glasses",
    price: 79.99,
    originalPrice: 99.99,
    image:
      "https://i.pinimg.com/736x/ca/0e/e7/ca0ee7b2be0cc22c8a6ebc4da40c4d87.jpg",
    rating: 4,
    reviews: 80,
  },
  {
    performance: "-30%",
    id: 8,
    title: "Bedroom article",
    price: 79.99,
    originalPrice: 99.99,
    image:
      "https://i.pinimg.com/736x/4d/bc/43/4dbc4371ec8a174cf8ae9ff7a7119c74.jpg",
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

export const Auction = [
  {
    id:"1",
    image:
      "https://i.pinimg.com/736x/69/53/5d/69535dee69e1ca455e53b3eb8567e259.jpg",
    title: "T-shirt from mbaay",
    currentBid: 2500,
    lotNumber: "23423454",
    seller: "Johnny",
    sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    endTime: "2025-02-20T23:59:59",
    description:"i think this"
  },
  {
    id:"2",
    image:
      "https://i.pinimg.com/736x/14/2c/98/142c983bb5dbbec6c4e4d4fdfcddcea8.jpg",
    title: "T-shirt from mbaay",
    currentBid: 2500,
    lotNumber: "23423454",
    seller: "Johnny",
    sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    endTime: "2025-02-20T23:59:59",
    description:"i think this"
  },
  {
    id:"3",
    image:
      "https://i.pinimg.com/736x/20/88/e8/2088e821dc6a0fba484d5ad205bad21b.jpg",
    title: "T-shirt from mbaay",
    currentBid: 2500,
    lotNumber: "23423454",
    seller: "Johnny",
    sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    endTime: "2025-02-20T23:59:59",
    description:"i think this"
  },
  {
    id:"4",
    image:
      "https://i.pinimg.com/736x/46/79/27/46792783195b9eed0ef3f485b004472a.jpg",
    title: "T-shirt from mbaay",
    currentBid: 2500,
    lotNumber: "23423454",
    seller: "Johnny",
    sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    endTime: "2025-02-20T23:59:59",
    description:"i think this"
  },
  {
    id:"5",
    image:
      "https://i.pinimg.com/736x/0d/33/f0/0d33f0a4f3f66b4974ce9239ddd88ef7.jpg",
    title: "T-shirt from mbaay",
    currentBid: 2500,
    lotNumber: "23423454",
    seller: "Johnny",
    sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    endTime: "2025-02-20T23:59:59",
    description:"i think this"
  },
  {
    id:"6",
    image:
      "https://i.pinimg.com/736x/a0/81/67/a08167ac02bfdc381ab3954aba838796.jpg",
    title: "T-shirt from mbaay",
    currentBid: 2500,
    lotNumber: "23423454",
    seller: "Johnny",
    sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    endTime: "2025-02-20T23:59:59",
    description:"i think this"
  },
  {
    id:"7",
    image:
      "https://i.pinimg.com/736x/6b/37/e2/6b37e21a27863f35ecfd44b5e7930942.jpg",
    title: "T-shirt from mbaay",
    currentBid: 2500,
    lotNumber: "23423454",
    seller: "Johnny",
    sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    endTime: "2025-02-20T23:59:59",
    description:"i think this"
  },
  {
    id:"8",
    image:
      "https://i.pinimg.com/736x/1c/76/cf/1c76cfca7dd1d4553828f7cd68c85307.jpg",
    title: "T-shirt from mbaay",
    currentBid: 2500,
    lotNumber: "23423454",
    seller: "Johnny",
    sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    endTime: "2025-02-20T23:59:59",
    description:"i think this"
  }];

  