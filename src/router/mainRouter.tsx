import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import Spinner from "@/components/Common/Spinner";
import WebLayout from "@/components/Layout/WebLayout";
import Layout from "@/components/profileMangement/Layout";
// import AccountManagement from "@/components/profileMangement/AccountManagement";
// import CommunityPage from "@/components/VendorInfo/Community&Res/Community";
import CommunityDetailPage from "@/components/VendorInfo/Community&Res/CommunityDetailPage";
import VendorLayout from "@/components/VendorInfo/VendorLayout";
import ProtectedVendor from "./ProtectedVendor";
import ErrorPage from "@/components/Error/ErrorPage";
import VintageJewelry from "@/components/AllCategory/VintageAntiqueJewelry/VintageAntique";
import Vintage from "@/components/AllCategory/VintageStocks/Vintage";
import FestiveRitualJewelry from "@/components/AllCategory/VintageAntiqueJewelry/subcategory/FestiveRitualJewelry";
import CulturalGemstones from "@/components/AllCategory/VintageAntiqueJewelry/subcategory/CulturalGemstones";
import ReligiousSpiritualJewelry from "@/components/AllCategory/VintageAntiqueJewelry/subcategory/ReligiousSpiritualJewelry";
import ReligiousAS from "@/components/AllCategory/TraditionalandReligiousItems/subcategory/ReligiousAS";
import Tcc from "@/components/AllCategory/TraditionalandReligiousItems/subcategory/Tcc";
import Rja from "@/components/AllCategory/TraditionalandReligiousItems/subcategory/Rja";
import As from "@/components/AllCategory/TraditionalandReligiousItems/subcategory/As";
import Crt from "@/components/AllCategory/TraditionalandReligiousItems/subcategory/Crt";
import Shmi from "@/components/AllCategory/TraditionalandReligiousItems/subcategory/Shmi";
import Cfi from "@/components/AllCategory/TraditionalandReligiousItems/subcategory/Cfi";
import Rt from "@/components/AllCategory/TraditionalandReligiousItems/subcategory/Rt";
import TF from "@/components/AllCategory/Fashion/subcategory/TF/TF";
import MenWear from "@/components/AllCategory/Fashion/subcategory/TF/MenWear";
import WomenWear from "@/components/AllCategory/Fashion/subcategory/TF/WomenWear";
import ChildrenWear from "@/components/AllCategory/Fashion/subcategory/TF/ChildrenWear";
import Unsex from "@/components/AllCategory/Fashion/subcategory/TF/Unsex";
import MT from "@/components/AllCategory/Fashion/subcategory/MT/MT";
import CAF from "@/components/AllCategory/Fashion/subcategory/MT/CAF";
import EUW from "@/components/AllCategory/Fashion/subcategory/MT/EUW";
import FUC from "@/components/AllCategory/Fashion/subcategory/MT/FUC";
import CMF from "@/components/AllCategory/Fashion/subcategory/MT/CMF";
import FW from "@/components/AllCategory/Fashion/subcategory/FW/FW";
import TSS from "@/components/AllCategory/Fashion/subcategory/FW/TSS";
import LHS from "@/components/AllCategory/Fashion/subcategory/FW/LHS";
import MSC from "@/components/AllCategory/Fashion/subcategory/FW/MSC";
import CSS from "@/components/AllCategory/Fashion/subcategory/FW/CSS";
import AC from "@/components/AllCategory/Fashion/subcategory/AC/AC";
import BSS from "@/components/AllCategory/Fashion/subcategory/AC/BSS";
import BP from "@/components/AllCategory/Fashion/subcategory/AC/BP";
import HS from "@/components/AllCategory/Fashion/subcategory/AC/HS";
import JA from "@/components/AllCategory/Fashion/subcategory/AC/JA";
import FB from "@/components/AllCategory/Fashion/subcategory/FB/FB";
import OF from "@/components/AllCategory/Fashion/subcategory/OF/OF";
import FC from "@/components/AllCategory/Fashion/subcategory/FC/FC";
import RF from "@/components/AllCategory/Fashion/subcategory/RF/RF";
import SF from "@/components/AllCategory/Fashion/subcategory/SF/SF";
import EB from "@/components/AllCategory/Fashion/subcategory/EB/EB";
import BS from "@/components/AllCategory/Fashion/subcategory/BS/BS";
import ST from "@/components/AllCategory/Fashion/subcategory/ST/ST";
import HLF from "@/components/AllCategory/Fashion/subcategory/FB/HLF";
import PRF from "@/components/AllCategory/Fashion/subcategory/FB/PRF";
import EHT from "@/components/AllCategory/Fashion/subcategory/FB/EHT";
import NOF from "@/components/AllCategory/Fashion/subcategory/FB/NOF";
import WF from "@/components/AllCategory/Fashion/subcategory/OF/WF";
import FCF from "@/components/AllCategory/Fashion/subcategory/OF/FCF";
import CEF from "@/components/AllCategory/Fashion/subcategory/OF/CEF";
import WA from "@/components/AllCategory/Fashion/subcategory/FC/WA";
import FCO from "@/components/AllCategory/Fashion/subcategory/FC/FCO";
import REC from "@/components/AllCategory/Fashion/subcategory/FC/REC";
// import ChatInterface from "@/components/VendorInfo/chat/Inbox";

const Home = lazy(() => import("@/page/HomeArea"));
const About = lazy(() => import("@/page/AboutUs"));
const Contact = lazy(() => import("@/page/Contact"));
const Cart = lazy(() => import("@/components/Payment/Cart"));
const ProductDetail = lazy(() => import("@/components/ProductDetail"));
const Wishlist = lazy(() => import("@/components/profileMangement/Wishlist"));
const EditProfile = lazy(
  () => import("@/components/profileMangement/EditProfile")
);
const OrderList = lazy(
  () => import("@/components/profileMangement/payment/Orderlist")
);
const Canclellation = lazy(
  () => import("@/components/profileMangement/payment/CancellationForm")
);
const Review = lazy(() => import("@/components/profileMangement/ReviewForm"));
const OrderDetail = lazy(
  () => import("@/components/profileMangement/payment/OrderDetail")
);
const CheckOut = lazy(
  () => import("@/components/profileMangement/payment/CheckOut")
);
const Login = lazy(() => import("@/components/userAuth/Signin"));
const Signup = lazy(() => import("@/components/userAuth/Signup"));
const SelectionPath = lazy(() => import("@/components/userAuth/SelectOption"));
const ForgotpasswordMessage = lazy(
  () => import("@/components/userAuth/Forgotpasswordmessage")
);
const ForgotPassword = lazy(
  () => import("@/components/userAuth/Forgotpassword")
);
const ResetPassword = lazy(
  () => import("@/components/userAuth/ChangePassword")
);
const OtpVerify = lazy(() => import("../components/userAuth/OTPVerification"));
const SendLink = lazy(() => import("@/components/userAuth/LinkExpired"));
const Number = lazy(() => import("@/components/userAuth/NumberForgotPassword"));
const Updatepassword = lazy(
  () => import("@/components/userAuth/Updatedpassword")
);
const LoginVendor = lazy(() => import("@/components/auth/LoginVendor"));
const SignupVendor = lazy(() => import("@/components/auth/SignupVendor"));
const WelcomePage = lazy(() => import("@/components/userAuth/WelcomePage"));

const Dashboard = lazy(() => import("@/components/VendorInfo/Dashboard"));
const AllOrder = lazy(() => import("@/components/VendorInfo/Orders/AllOrder"));
const OrderDetails = lazy(
  () => import("@/components/VendorInfo/Orders/OrderDetails")
);
const AllProduct = lazy(
  () => import("@/components/VendorInfo/Products/AllProduct")
);
const NewProduct = lazy(
  () => import("@/components/VendorInfo/Products/NewProduct")
);
const Customer = lazy(
  () => import("@/components/VendorInfo/Customers/Customer")
);
const Payments = lazy(
  () => import("@/components/VendorInfo/Payments/Payments")
);
const PreviewInvoice = lazy(
  () => import("@/components/VendorInfo/Payments/PreviewInvoice")
);
const EditVendorProfile = lazy(
  () => import("@/components/VendorInfo/Setting/EditVendorProfile")
);
const KycVerification = lazy(
  () => import("@/components/VendorInfo/Setting/KycVerification")
);

const MyOrders = lazy(() => import("../components/VendorInfo/Orders/MyOrders"));
const OrderCancellation = lazy(
  () => import("../components/VendorInfo/Orders/OrderCancellation")
);
const ReturnProducts = lazy(
  () => import("../components/VendorInfo/Products/ReturnProducts")
);
const Inbox = lazy(() => import("@/components/VendorInfo/chat/Inbox"));

// const CommunityPage = lazy(() => import("../components/VendorInfo/Community&Res/Community"))
const CommunitySection = lazy(
  () => import("../components/VendorInfo/Community&Res/CommunitySection")
);
const Reviews = lazy(() => import("../components/VendorInfo/Review/Reviews"));

const AllPost = lazy(
  () => import("@/components/VendorInfo/Community&Res/AllPost")
);
const Pricing = lazy(() => import("@/components/VendorInfo/Pricing/Pricing"));
const Upgrade = lazy(() => import("@/components/VendorInfo/Pricing/Upgrade"));
const Subscription = lazy(
  () => import("@/components/VendorInfo/Subcription/SubscriptionCallback")
);
const SubscriptionSuccess = lazy(
  () => import("@/components/VendorInfo/Subcription/SubscriptionSuccess")
);
const SubscriptionFailure = lazy(
  () => import("@/components/VendorInfo/Subcription/SubscriptionFailed")
);
const ProfilePage = lazy(
  () => import("../components/VendorInfo/Community&Res/Proflie")
);

const ProductDetailModal = lazy(
  () => import("@/components/VendorInfo/Products/ProductDetailModal")
);
const AuctionView = lazy(() => import("@/components/AuctionPage/AuctionView"));
const AuctionDetail = lazy(
  () => import("@/components/AuctionPage/AuctionDetail")
);
const Error = lazy(() => import("@/components/Error/Error"));
// const userIndex = lazy(() => import("@/components/profileMangement/chat/ChatInterface"));
import ChatInterfaceChat from "@/components/profileMangement/chat/ChatInterfaceChat";
const Address = lazy(() => import("@/components/profileMangement/Addresses"));
const ProductInfo = lazy(() => import("@/page/ProductInfo"));
const RandomProductPage = lazy(() => import("@/page/RandomProductPage"));
const AllVendor = lazy(() => import("@/components/Reuseable/AllVendor"));
const VendorProfileProduct = lazy(
  () => import("@/components/Reuseable/VendorProfileProduct")
);
// All Category Links
const Fashion = lazy(() => import("@/components/AllCategory/Fashion/Fashion"));
const Furniture = lazy(
  () => import("@/components/AllCategory/Furniture/Furniture")
);
const BeautyWellness = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/BeautyWellness")
);
const BookPoetry = lazy(
  () => import("@/components/AllCategory/Books&Poetry/BookPoetry")
);
const HomeDecor = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/HomeDecor")
);
const LocalFood = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/LocalFood")
);
const LocalFoodsDrinks = lazy(
  () =>
    import(
      "@/components/AllCategory/LocalFoodandDrinksProducts/LocalFoodsDrinks"
    )
);
const PlantSeed = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/PlantSeed")
);
const Spices = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/Spices")
);
const Jewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/Jewelry")
);

const Art = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/ArtPage")
);
// Art Subcategory Page
const Paintings = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/subcategory/Paintings")
);
const WallArts = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/subcategory/WallArts")
);
const Sculptures = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/subcategory/Sculptures")
);
const TraditionalCraft = lazy(
  () =>
    import(
      "@/components/AllCategory/Art&Sculptures/subcategory/TraditionalCraft"
    )
);
const ReligiousCulturalArt = lazy(
  () =>
    import(
      "@/components/AllCategory/Art&Sculptures/subcategory/ReligiousCulturalArt"
    )
);

// BeautyWellness Subcategory Page
const Skincare = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/Skincare")
);
const Haircare = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/Haircare")
);
const Bodycare = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/Bodycare")
);
const Makeup = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/Makeup")
);
const Fragrances = lazy(
  () =>
    import("@/components/AllCategory/Beauty&Wellness/subcategory/Fragrances")
);
const Wellnessproducts = lazy(
  () =>
    import(
      "@/components/AllCategory/Beauty&Wellness/subcategory/Wellnessproducts"
    )
);
const MenGrooming = lazy(
  () =>
    import("@/components/AllCategory/Beauty&Wellness/subcategory/MenGrooming")
);
const BadychildCare = lazy(
  () =>
    import("@/components/AllCategory/Beauty&Wellness/subcategory/BadychildCare")
);
const HealthWellness = lazy(
  () =>
    import(
      "@/components/AllCategory/Beauty&Wellness/subcategory/HealthWellness"
    )
);
const ImmuityBoost = lazy(
  () =>
    import("@/components/AllCategory/Beauty&Wellness/subcategory/ImmuityBoost")
);

//Jewelry and Gemstones Subcategory
const HandmadeJewelry = lazy(
  () =>
    import(
      "@/components/AllCategory/Jewelry&Gemstones/subcategory/HandmadeJewelry"
    )
);
const Gemstones = lazy(
  () =>
    import("@/components/AllCategory/Jewelry&Gemstones/subcategory/Gemstones")
);
const JewelryMaterials = lazy(
  () =>
    import(
      "@/components/AllCategory/Jewelry&Gemstones/subcategory/JewelryMaterials"
    )
);
const SustainableJewelry = lazy(
  () =>
    import(
      "@/components/AllCategory/Jewelry&Gemstones/subcategory/SustainableJewelry"
    )
);
const ChildrenJewelry = lazy(
  () =>
    import(
      "@/components/AllCategory/Jewelry&Gemstones/subcategory/ChildrenJewelry"
    )
);
const MenJewelry = lazy(
  () =>
    import("@/components/AllCategory/Jewelry&Gemstones/subcategory/MenJewelry")
);
const OccasionJewelry = lazy(
  () =>
    import(
      "@/components/AllCategory/Jewelry&Gemstones/subcategory/OccasionJewelry"
    )
);
const TraditionalJewelry = lazy(
  () =>
    import(
      "@/components/AllCategory/Jewelry&Gemstones/subcategory/TraditionalJewelry"
    )
);
const GemstoneJewelry = lazy(
  () =>
    import(
      "@/components/AllCategory/Jewelry&Gemstones/subcategory/GemstoneJewelry"
    )
);

// Books and poetry subcategory
const CulturalEthnic = lazy(
  () =>
    import("@/components/AllCategory/Books&Poetry/subcategory/CulturalEthnic")
);
const TranditionalFolk = lazy(
  () =>
    import("@/components/AllCategory/Books&Poetry/subcategory/TranditionalFolk")
);
const Poetry = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/Poetry")
);
const HistoricalNarratives = lazy(
  () =>
    import(
      "@/components/AllCategory/Books&Poetry/subcategory/HistoricalNarratives"
    )
);
const SpiritualityReligion = lazy(
  () =>
    import(
      "@/components/AllCategory/Books&Poetry/subcategory/SpiritualityReligion"
    )
);
const LanguageLinguistics = lazy(
  () =>
    import(
      "@/components/AllCategory/Books&Poetry/subcategory/LanguageLinguistics"
    )
);
const CookbooksCulinaryTradition = lazy(
  () =>
    import(
      "@/components/AllCategory/Books&Poetry/subcategory/CookbooksCulinaryTradition"
    )
);
const ArtCraft = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/ArtCraft")
);
const Childrenbook = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/Childrenbook")
);
const TravelExploration = lazy(
  () =>
    import(
      "@/components/AllCategory/Books&Poetry/subcategory/TravelExploration"
    )
);
const HealthWellnessBook = lazy(
  () =>
    import("@/components/AllCategory/Books&Poetry/subcategory/HealthWellness")
);
const PoliticalSocialIssues = lazy(
  () =>
    import(
      "@/components/AllCategory/Books&Poetry/subcategory/PoliticalSocialIssues"
    )
);
const ArtisticCreative = lazy(
  () =>
    import("@/components/AllCategory/Books&Poetry/subcategory/ArtisticCreative")
);
const EnvironmentalNature = lazy(
  () =>
    import(
      "@/components/AllCategory/Books&Poetry/subcategory/EnvironmentalNature"
    )
);
const InspriationalMotivational = lazy(
  () =>
    import(
      "@/components/AllCategory/Books&Poetry/subcategory/InspriationalMotivational"
    )
);

// Homedocor Subcategory
const TextileFabrics = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/TextileFabrics"
    )
);
const CeramicsPottery = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/CeramicsPottery"
    )
);
const Woodcraft = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/Woodcraft"
    )
);
const Metalwork = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/Metalwork"
    )
);
const BasketsWeaving = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/BasketsWeaving"
    )
);
const Glasswork = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/Glasswork"
    )
);
const Leather = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/LeatherWoods"
    )
);
const BeadedDecor = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/BeadedDecor"
    )
);
const StoneMarble = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/StoneMarble"
    )
);
const HandcraftedKitchenware = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/HandcraftedKitchenware"
    )
);
const WallArt = lazy(
  () =>
    import("@/components/AllCategory/HomeDécor&Accessories/subcategory/WallArt")
);
const Mirrors = lazy(
  () =>
    import("@/components/AllCategory/HomeDécor&Accessories/subcategory/Mirrors")
);
const Handwoven = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/HandwovenMatsCarpets"
    )
);
const HandCraftedLamps = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/HandCraftedLamps"
    )
);
const JewelryTrinket = lazy(
  () =>
    import(
      "@/components/AllCategory/HomeDécor&Accessories/subcategory/JewelryTrinket"
    )
);

// Vintage Stock Subcategory
const VintageTextiles = lazy(
  () =>
    import("@/components/AllCategory/VintageStocks/subcategory/VintageTextiles")
);
const VintageClothing = lazy(
  () =>
    import("@/components/AllCategory/VintageStocks/subcategory/VintageClothing")
);
const VintageHomeDecor = lazy(
  () =>
    import(
      "@/components/AllCategory/VintageStocks/subcategory/VintageHomeDecor"
    )
);
const VintageInstruments = lazy(
  () =>
    import(
      "@/components/AllCategory/VintageStocks/subcategory/VintageInstruments"
    )
);
const VintageArt = lazy(
  () => import("@/components/AllCategory/VintageStocks/subcategory/VintageArt")
);
const VintageFurniture = lazy(
  () =>
    import(
      "@/components/AllCategory/VintageStocks/subcategory/VintageFurniture"
    )
);
const VintageHandicraft = lazy(
  () =>
    import(
      "@/components/AllCategory/VintageStocks/subcategory/VintageHandicraft"
    )
);
const VintageReligious = lazy(
  () =>
    import(
      "@/components/AllCategory/VintageStocks/subcategory/VintageReligious"
    )
);
const VintageStorage = lazy(
  () =>
    import("@/components/AllCategory/VintageStocks/subcategory/VintageStorage")
);

// Plant Seeds subcategory
const Plant = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/Plants")
);
const FruitPlants = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/FruitPlants")
);
const Vegetableplants = lazy(
  () =>
    import("@/components/AllCategory/Plant&Seeds/subcategory/Vegetableplants")
);
const MedicinalPlants = lazy(
  () =>
    import("@/components/AllCategory/Plant&Seeds/subcategory/MedicinalPlants")
);
const Seed = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/Seed")
);
const HerbSeeds = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/HerbSeeds")
);
const FlowerSeeds = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/FlowerSeeds")
);
const CulturalTraditionalSeed = lazy(
  () =>
    import(
      "@/components/AllCategory/Plant&Seeds/subcategory/CulturalTraditionalSeed"
    )
);
const PlantingKit = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/PlantingKit")
);
const PlantCareProduct = lazy(
  () =>
    import("@/components/AllCategory/Plant&Seeds/subcategory/PlantCareProduct")
);
const SeedingSapling = lazy(
  () =>
    import("@/components/AllCategory/Plant&Seeds/subcategory/SeedingSapling")
);

// spices subcategory
const Conditments = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Conditments"
    )
);
const CookingIngredients = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/CookingIngredients"
    )
);
const CulturalRegional = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/CulturalRegional"
    )
);
const EthincallySourced = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/EthincallySourced"
    )
);
const HealthWellnessSpices = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/HealthWellnessSpices"
    )
);
const Marinades = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Marinades"
    )
);
const PopularUses = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/PopularUses"
    )
);
const SaltPepper = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/SaltPepper"
    )
);
const Seasoning = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Seasoning"
    )
);
const SpecialDietary = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/SpecialDietary"
    )
);
const SpiceKits = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/SpiceKits"
    )
);
const Spicesi = lazy(
  () =>
    import(
      "@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Spices"
    )
);

// Furniture
const Seating = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/Seating")
);
const Table = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/Table")
);
const Storage = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/Storage")
);
const BedroomItem = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/BedroomItem")
);
const DecorUtility = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/DecorUtility")
);
const OutdoorPatio = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/OutdoorPatio")
);

// Local Food
const CulturallySpecific = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/CulturallySpecific"
    )
);
const EthinicSauces = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/EthinicSauces"
    )
);
const FermentedFood = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/FermentedFood"
    )
);
const FestivalFood = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/FestivalFood"
    )
);
const IndigenousBake = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/IndigenousBake"
    )
);
const LocalBeverages = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/LocalBeverages"
    )
);
const LocalGrains = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/LocalGrains"
    )
);
const MealPlans = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/MealPlans"
    )
);
const PackagedReadyFood = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/PackagedReadyFood"
    )
);
const PickledFood = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/PickledFood"
    )
);
const RegionalEthnicFood = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/RegionalEthnicFood"
    )
);
const SpecialtyGrains = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/SpecialtyGrains"
    )
);
const StapleFoods = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/StapleFoods"
    )
);
const TraditionalOil = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalOil"
    )
);
const TraditionalSnacks = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalSnacks"
    )
);
const TraditionalSoup = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalSoup"
    )
);
const TraditionalSweet = lazy(
  () =>
    import(
      "@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalSweet"
    )
);

// PAYMENT
const SuccessPayment = lazy(
  () => import("@/components/Payment/PaymentSuccess")
);
const FaliedPayment = lazy(() => import("@/components/Payment/PaymentFailed"));
const PaymentCallback = lazy(
  () => import("@/components/Payment/PaymentCallback")
);
import RestrictVendorRoute from "./RestrictVendorRoute";
import CompleteSignup from "@/components/auth/CompleteSignup";
import PendingApproval from "@/components/auth/PendingApproval";

const AuctionList = lazy(() => import("@/components/AuctionPage/AuctionList"));
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: <WebLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "/about", element: withSuspense(About) },
      { path: "/contact", element: withSuspense(Contact) },
      { path: "/cart", element: withSuspense(Cart) },
      {
        path: "/product-details/:id",
        element: withSuspense(ProductDetail),
        errorElement: <ErrorPage />,
      },
      {
        path: "/product/:id",
        element: withSuspense(ProductInfo),
        errorElement: <ErrorPage />,
      },
      { path: "/auctionview", element: withSuspense(AuctionView) },
      { path: "/auction/:id", element: withSuspense(AuctionDetail) },
      { path: "/auctionlist", element: withSuspense(AuctionList) },
      { path: "/random-product", element: withSuspense(RandomProductPage) },
      { path: "/more-vendor", element: withSuspense(AllVendor) },
      {
        path: "/veiws-profile/:id",
        element: withSuspense(VendorProfileProduct),
        errorElement: <ErrorPage />,
      },

      // All Category Links
      { path: "/fashion", element: withSuspense(Fashion) },
      { path: "/furniture", element: withSuspense(Furniture) },
      { path: "/book-poetry", element: withSuspense(BookPoetry) },
      { path: "/homedecor", element: withSuspense(HomeDecor) },
      { path: "/localfood", element: withSuspense(LocalFood) },
      { path: "/localfooddrinks", element: withSuspense(LocalFoodsDrinks) },
      { path: "/plantseed", element: withSuspense(PlantSeed) },
      { path: "/spices", element: withSuspense(Spices) },
      { path: "/jewelry", element: withSuspense(Jewelry) },
      { path: "/vintage", element: withSuspense(Vintage) },
      { path: "/vintage-jewelry", element: withSuspense(VintageJewelry) },
      { path: "/beautywellness", element: withSuspense(BeautyWellness) },
      { path: "/art", element: withSuspense(Art) },
      { path: "/traditional-items", element: withSuspense(TraditionalOil) },

      // Art Subcategory Page
      { path: "/paintings", element: withSuspense(Paintings) },
      { path: "/wall-art", element: withSuspense(WallArts) },
      { path: "/sculptures", element: withSuspense(Sculptures) },
      { path: "/traditional-craft", element: withSuspense(TraditionalCraft) },
      {
        path: "/traditional-artifacts",
        element: withSuspense(ReligiousCulturalArt),
      },

      // BeautyWellness Subcategory Page
      { path: "/skincare", element: withSuspense(Skincare) },
      { path: "/haircare", element: withSuspense(Haircare) },
      { path: "/bodycare", element: withSuspense(Bodycare) },
      { path: "/makeup", element: withSuspense(Makeup) },
      { path: "/fragrances", element: withSuspense(Fragrances) },
      { path: "/wellnessproduct", element: withSuspense(Wellnessproducts) },
      { path: "/men-grooming", element: withSuspense(MenGrooming) },
      { path: "/badychild-care", element: withSuspense(BadychildCare) },
      { path: "/health-wellness", element: withSuspense(HealthWellness) },
      { path: "/immuity-boost", element: withSuspense(ImmuityBoost) },

      //Jewelry and Gemstones Subcategory
      { path: "/handmade-jewelry", element: withSuspense(HandmadeJewelry) },
      { path: "/gemstones", element: withSuspense(Gemstones) },
      { path: "/jewelry-materials", element: withSuspense(JewelryMaterials) },
      {
        path: "/sustainable-jewelry",
        element: withSuspense(SustainableJewelry),
      },
      { path: "/children-jewelry", element: withSuspense(ChildrenJewelry) },
      { path: "/men-jewelry", element: withSuspense(MenJewelry) },
      { path: "/occasion-jewelry", element: withSuspense(OccasionJewelry) },
      {
        path: "/traditional-jewelry",
        element: withSuspense(TraditionalJewelry),
      },
      { path: "/gemstone-jewelry", element: withSuspense(GemstoneJewelry) },

      // Books Subcategory
      { path: "/cultural-ethnic", element: withSuspense(CulturalEthnic) },
      { path: "/traditional-folk", element: withSuspense(TranditionalFolk) },
      { path: "/poetry", element: withSuspense(Poetry) },
      {
        path: "/historical-narrative",
        element: withSuspense(HistoricalNarratives),
      },
      {
        path: "/spirituality-religion",
        element: withSuspense(SpiritualityReligion),
      },
      {
        path: "/language-linguistics",
        element: withSuspense(LanguageLinguistics),
      },
      { path: "cookbook", element: withSuspense(CookbooksCulinaryTradition) },
      { path: "/art-craft", element: withSuspense(ArtCraft) },
      { path: "children-books", element: withSuspense(Childrenbook) },
      { path: "travel-exploration", element: withSuspense(TravelExploration) },
      {
        path: "/health-wellness-book",
        element: withSuspense(HealthWellnessBook),
      },
      {
        path: "political-social",
        element: withSuspense(PoliticalSocialIssues),
      },
      { path: "/artistic-writing", element: withSuspense(ArtisticCreative) },
      {
        path: "/environment-nature",
        element: withSuspense(EnvironmentalNature),
      },
      {
        path: "/inspirational-book",
        element: withSuspense(InspriationalMotivational),
      },

      // Home Decor
      { path: "/textiles", element: withSuspense(TextileFabrics) },
      { path: "/ceramics-pottery", element: withSuspense(CeramicsPottery) },
      { path: "/woodcraft", element: withSuspense(Woodcraft) },
      { path: "/metalwork", element: withSuspense(Metalwork) },
      { path: "/baskets-weaving", element: withSuspense(BasketsWeaving) },
      { path: "/glasswork", element: withSuspense(Glasswork) },
      { path: "/leather-woods", element: withSuspense(Leather) },
      { path: "/beaded-decor", element: withSuspense(BeadedDecor) },
      { path: "/stone-marble", element: withSuspense(StoneMarble) },
      {
        path: "/handcrafted-kitchenware",
        element: withSuspense(HandcraftedKitchenware),
      },
      { path: "/wall-art", element: withSuspense(WallArt) },
      { path: "/mirrors", element: withSuspense(Mirrors) },
      { path: "/handwoven", element: withSuspense(Handwoven) },
      { path: "/handcrafted", element: withSuspense(HandCraftedLamps) },
      { path: "/jewelry-trinket", element: withSuspense(JewelryTrinket) },

      // Vintage stock
      { path: "/vintagetextiles", element: withSuspense(VintageTextiles) },
      { path: "/Vintage-Clothing", element: withSuspense(VintageClothing) },
      { path: "/Vintage-Home", element: withSuspense(VintageHomeDecor) },
      {
        path: "/Vintage-Instruments",
        element: withSuspense(VintageInstruments),
      },
      { path: "/Vintage-Art", element: withSuspense(VintageArt) },
      { path: "/Vintage-Furniture", element: withSuspense(VintageFurniture) },
      {
        path: "/Vintage-Handicrafts",
        element: withSuspense(VintageHandicraft),
      },
      { path: "/Vintage-Religious", element: withSuspense(VintageReligious) },
      { path: "/Vintage-Storage", element: withSuspense(VintageStorage) },

      // Vintage Jewelry

      { path: "/festive-jewelry", element: withSuspense(FestiveRitualJewelry) },
      { path: "/Vintage-jewelrys", element: withSuspense(VintageJewelry) },
      { path: "/cultural-gemstones", element: withSuspense(CulturalGemstones) },
      {
        path: "/religious-jewelry",
        element: withSuspense(ReligiousSpiritualJewelry),
      },
      // Plant Seed

      { path: "/plant", element: withSuspense(Plant) },
      { path: "/FruitPlants", element: withSuspense(FruitPlants) },
      { path: "/Vegetableplants", element: withSuspense(Vegetableplants) },
      { path: "/MedicinalPlants", element: withSuspense(MedicinalPlants) },
      { path: "/seed", element: withSuspense(Seed) },
      { path: "/HerbSeeds", element: withSuspense(HerbSeeds) },
      { path: "/FlowerSeeds", element: withSuspense(FlowerSeeds) },
      {
        path: "/CulturalTraditionalSeed",
        element: withSuspense(CulturalTraditionalSeed),
      },
      { path: "/PlantingKit", element: withSuspense(PlantingKit) },
      { path: "/PlantCareProduct", element: withSuspense(PlantCareProduct) },
      { path: "/SeedingSapling", element: withSuspense(SeedingSapling) },

      // spices subcategory
      { path: "/Conditments", element: withSuspense(Conditments) },
      {
        path: "/CookingIngredients",
        element: withSuspense(CookingIngredients),
      },
      { path: "/CulturalRegional", element: withSuspense(CulturalRegional) },
      { path: "/EthincallySourced", element: withSuspense(EthincallySourced) },
      {
        path: "/HealthWellnessSpices",
        element: withSuspense(HealthWellnessSpices),
      },

      { path: "/Marinades", element: withSuspense(Marinades) },
      { path: "/PopularUses", element: withSuspense(PopularUses) },
      { path: "/SaltPepper", element: withSuspense(SaltPepper) },
      { path: "/Seasoning", element: withSuspense(Seasoning) },
      { path: "/SpecialDietary", element: withSuspense(SpecialDietary) },
      { path: "/SpiceKits", element: withSuspense(SpiceKits) },
      { path: "/Spices-i", element: withSuspense(Spicesi) },

      // Local & Traditional Foods Subcategory
      {
        path: "/CulturallySpecific",
        element: withSuspense(CulturallySpecific),
      },
      { path: "/EthinicSauces", element: withSuspense(EthinicSauces) },
      { path: "/FermentedFood", element: withSuspense(FermentedFood) },
      { path: "/FestivalFood", element: withSuspense(FestivalFood) },
      { path: "/IndigenousBake", element: withSuspense(IndigenousBake) },
      { path: "/LocalBeverages", element: withSuspense(LocalBeverages) },
      { path: "/LocalGrains", element: withSuspense(LocalGrains) },
      { path: "/MealPlans", element: withSuspense(MealPlans) },
      { path: "/PackagedReadyFood", element: withSuspense(PackagedReadyFood) },
      { path: "/PickledFood", element: withSuspense(PickledFood) },
      {
        path: "/RegionalEthnicFood",
        element: withSuspense(RegionalEthnicFood),
      },
      { path: "/SpecialtyGrains", element: withSuspense(SpecialtyGrains) },
      { path: "/StapleFoods", element: withSuspense(StapleFoods) },
      { path: "/TraditionalOil", element: withSuspense(TraditionalOil) },
      { path: "/TraditionalSnacks", element: withSuspense(TraditionalSnacks) },
      { path: "/TraditionalSoup", element: withSuspense(TraditionalSoup) },
      { path: "/TraditionalSweet", element: withSuspense(TraditionalSweet) },

      // Furniture Subcategory
      { path: "/seating", element: withSuspense(Seating) },
      { path: "/tables", element: withSuspense(Table) },
      { path: "/storage", element: withSuspense(Storage) },
      { path: "/bedroom-items", element: withSuspense(BedroomItem) },
      { path: "/decor-utility", element: withSuspense(DecorUtility) },
      { path: "/outdoor-patio", element: withSuspense(OutdoorPatio) },

      // TRI
      { path: "/religious-artifacts", element: withSuspense(ReligiousAS) },
      { path: "/ceremonial-clothing", element: withSuspense(Tcc) },
      { path: "/religious-jewelry", element: withSuspense(Rja) },
      { path: "/altars-shrines", element: withSuspense(As) },
      { path: "/ceremonial-ritual-tools", element: withSuspense(Crt) },
      {
        path: "/Spiritual Healing & Meditation Items",
        element: withSuspense(Shmi),
      },
      { path: "/cultural-festive", element: withSuspense(Cfi) },
      { path: "/ritual-tools", element: withSuspense(Rt) },

      // Fashion Subcategory
      { path: "/traditional-fashion", element: withSuspense(TF) },
      { path: "/men-tf-wear", element: withSuspense(MenWear) },
      { path: "/women-tf-wear", element: withSuspense(WomenWear) },
      { path: "/children-tf-wear", element: withSuspense(ChildrenWear) },
      { path: "/unisex-tf-wear", element: withSuspense(Unsex) },

      { path: "/modern-traditional", element: withSuspense(MT) },
      { path: "/contemporary-african-fashion", element: withSuspense(CAF) },
      { path: "/ethnic-inspired-urban-wear", element: withSuspense(EUW) },
      { path: "/fusion-clothing", element: withSuspense(FUC) },
      { path: "/custom-made-ethnic-fashion", element: withSuspense(CMF) },

      { path: "/footwear", element: withSuspense(FW) },
      { path: "/traditional-shoes", element: withSuspense(TSS) },
      { path: "/leather-handmade", element: withSuspense(LHS) },
      { path: "/modern-shoes", element: withSuspense(MSC) },
      { path: "/custom-shoes-sandals", element: withSuspense(CSS) },

      { path: "/accessories", element: withSuspense(AC) },
      { path: "/belts-sashes", element: withSuspense(BSS) },
      { path: "/bags-pouches", element: withSuspense(BP) },
      { path: "/headwear-scarves", element: withSuspense(HS) },
      { path: "/jewelry-adornments", element: withSuspense(JA) },

      { path: "/fabrics", element: withSuspense(FB) },
      { path: "/natural-organic", element: withSuspense(NOF) },
      { path: "/handwoven-fabrics", element: withSuspense(HLF) },
      { path: "/printed-fabrics", element: withSuspense(PRF) },
      { path: "/embroidered-handmade", element: withSuspense(EHT) },

      { path: "/occasion-footwear", element: withSuspense(OF) },
      { path: "/wedding-footwear", element: withSuspense(WF) },
      { path: "/festival-ceremony", element: withSuspense(FCF) },
      { path: "/casual-ethnic", element: withSuspense(CEF) },

      { path: "/festival-clothing", element: withSuspense(FC) },
      { path: "/wedding-attire", element: withSuspense(WA) },
      { path: "/festival-ceremony", element: withSuspense(FCO) },
      { path: "/religious-clothing", element: withSuspense(REC) },

      { path: "/regional-fashion", element: withSuspense(RF) },
      { path: "/seasonal-fashion", element: withSuspense(SF) },
      { path: "/embroidery", element: withSuspense(EB) },
      { path: "/bespoke", element: withSuspense(BS) },
      { path: "/sustainable", element: withSuspense(ST) },
    ],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(EditProfile) },
      { path: "/dashboard/orderlist", element: withSuspense(OrderList) },
      { path: "/dashboard/orderdetail", element: withSuspense(OrderDetail) },
      { path: "/dashboard/checkout", element: withSuspense(CheckOut) },
      {
        path: "/dashboard/canclellation",
        element: withSuspense(Canclellation),
      },
      { path: "/dashboard/review", element: withSuspense(Review) },
      { path: "/dashboard/wishlist", element: withSuspense(Wishlist) },
      { path: "/dashboard/addresses", element: withSuspense(Address) },
      {
        path: "/dashboard/messages",
        element: (
          <RestrictVendorRoute>
            {withSuspense(() => (
              <ChatInterfaceChat />
            ))}
          </RestrictVendorRoute>
        ),
      },
    ],
  },

  {
    path: "/app",
    element: <ProtectedVendor />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <VendorLayout />,
        children: [
          { index: true, element: withSuspense(Dashboard) },
          { path: "orders", element: withSuspense(AllOrder) },

          {
            path: "order-details/:orderId",
            element: withSuspense(OrderDetails),
          },
          { path: "all-products", element: withSuspense(AllProduct) },
          { path: "new-product", element: withSuspense(NewProduct) },
          { path: "customers", element: withSuspense(Customer) },
          { path: "Payments", element: withSuspense(Payments) },
          { path: "preview-invoice", element: withSuspense(PreviewInvoice) },
          {
            path: "edit-vendor-profile",
            element: withSuspense(EditVendorProfile),
          },

          { path: "kyc-verification", element: withSuspense(KycVerification) },

          { path: "myorders", element: withSuspense(MyOrders) },
          { path: "return-product", element: withSuspense(ReturnProducts) },
          {
            path: "cancellation",
            element: withSuspense(OrderCancellation),
          },
          { path: "inbox", element: withSuspense(Inbox) },

          { path: "all-post", element: withSuspense(AllPost) },
          { path: "profile", element: withSuspense(ProfilePage) },
          { path: "my-community", element: withSuspense(CommunitySection) },
          { path: "reviews", element: withSuspense(Reviews) },
          { path: "pricing", element: withSuspense(Pricing) },
          { path: "upgrade", element: withSuspense(Upgrade) },
          {
            path: "comunity-detail/:communityid",
            element: withSuspense(CommunityDetailPage),
          },
          {
            path: "products-detail/:productid",
            element: withSuspense(() => (
              <ProductDetailModal
                product={null}
                isOpen={false}
                onClose={() => {}}
                productId={""}
              />
            )),
          },
        ],
      },
    ],
  },
  { path: "signin", element: withSuspense(Login) },
  { path: "signup", element: withSuspense(Signup) },
  { path: "welcomepage", element: withSuspense(WelcomePage) },
  { path: "selectpath", element: withSuspense(SelectionPath) },
  {
    path: "forgotpasswordmessage",
    element: withSuspense(ForgotpasswordMessage),
  },
  { path: "forgot-password", element: withSuspense(ForgotPassword) },
  { path: "restpassword", element: withSuspense(ResetPassword) },
  {
    path: "/verify-otp/:userId",
    element: withSuspense(OtpVerify),
    errorElement: <ErrorPage />,
  },
  { path: "sendlink", element: withSuspense(SendLink) },
  { path: "numberforgotpass", element: withSuspense(Number) },
  { path: "updatepassword", element: withSuspense(Updatepassword) },

  { path: "login-vendor", element: withSuspense(LoginVendor) },
  { path: "signup-vendor", element: withSuspense(SignupVendor) },
  { path: "complete-signup", element: withSuspense(CompleteSignup) },
  { path: "pending-approval", element: withSuspense(PendingApproval) },

  // Payment
  { path: "/:sessionId/success", element: withSuspense(SuccessPayment) },
  { path: "/failed", element: withSuspense(FaliedPayment) },
  { path: "/payment_callback", element: withSuspense(PaymentCallback) },

  // Subcription
  { path: "/subscription-callback", element: withSuspense(Subscription) },

  {
    path: "/subscription_success",
    element: withSuspense(SubscriptionSuccess),
  },
  {
    path: "/subscription_failed",
    element: withSuspense(SubscriptionFailure),
  },

  { path: "*", element: withSuspense(Error), errorElement: <ErrorPage /> }, // 404 page not found
];
export const mainRouter = createBrowserRouter(routesConfig);
