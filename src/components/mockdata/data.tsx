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

  export   const profilesData = [
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


  export   const flashSale = [
    {
      id: 1,
      name: "AK-900 Wired Keyboard",
      price: "$960",
      originalPrice: "$1160",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 75,
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: "$99.99",
      originalPrice: "$129.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 5,
      reviews: 120,
    },
    {
      id: 3,
      name: "Smartwatch",
      price: "$199.99",
      originalPrice: "$249.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 90,
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      price: "$49.99",
      originalPrice: "$69.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 3,
      reviews: 50,
    },
    {
      id: 5,
      name: "Gaming Keyboard",
      price: "$79.99",
      originalPrice: "$99.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 80,
    },
    {
      id: 6,
      name: "Gaming Keyboard",
      price: "$79.99",
      originalPrice: "$99.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 80,
    },
    {
      id: 7,
      name: "Gaming Keyboard",
      price: "$79.99",
      originalPrice: "$99.99",
      image:
        "https://i.pinimg.com/736x/74/f1/3b/74f13b8705ddf22f9dee9848004491d4.jpg",
      rating: 4,
      reviews: 80,
    },
    {
      id: 8,
      name: "Gaming Keyboard",
      price: "$79.99",
      originalPrice: "$99.99",
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
