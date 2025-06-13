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
const Home = lazy(() => import("@/page/HomeArea"));
const About = lazy(() => import("@/page/AboutUs"));
const Contact = lazy(() => import("@/page/Contact"));
const Cart = lazy(() => import("@/components/Payment/Cart"));
const ProductDetail = lazy(() => import("@/components/ProductDetail"));
const Wishlist = lazy(() => import("@/components/profileMangement/Wishlist"));
const EditProfile = lazy(
  () => import("@/components/profileMangement/EditProfile")
);
const OrderList = lazy(() => import("@/components/profileMangement/Orderlist"));
const Canclellation = lazy(
  () => import("@/components/profileMangement/CancellationForm")
);
const Review = lazy(() => import("@/components/profileMangement/ReviewForm"));
const OrderDetail = lazy(
  () => import("@/components/profileMangement/OrderDetail")
);
const CheckOut = lazy(() => import("@/components/Payment/CheckOut"));
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
const Inbox = lazy(() => import("@/components/VendorInfo/Inbox"));
// const CommunityPage = lazy(() => import("../components/VendorInfo/Community&Res/Community"))
const CommunitySection = lazy(
  () => import("../components/VendorInfo/Community&Res/CommunitySection")
);
const Reviews = lazy(() => import("../components/VendorInfo/Review/Reviews"));

const AllPost = lazy(
  () => import("@/components/VendorInfo/Community&Res/AllPost")
);
const Pricing = lazy(() => import("@/components/VendorInfo/Pricing/Pricing"));
const ProfilePage = lazy(
  () => import("../components/VendorInfo/Community&Res/Proflie")
);

const ProductDetailModal = lazy(
  () => import("@/components/VendorInfo/Products/ProductDetailModal")
);
const AuctionView = lazy(() => import("@/components/AuctionPage/AuctionView"));
// const AuctionDetail = lazy(()=>import("@/components/AuctionPage/AuctionDetail"))
const Error = lazy(() => import("@/components/Error/Error"));
const userIndex = lazy(() => import("@/components/profileMangement/Index"));
const Address = lazy(() => import("@/components/profileMangement/Addresses"));
const ProductInfo = lazy(() => import("@/page/ProductInfo"));
const RandomProductPage = lazy(() => import("@/page/RandomProductPage"));
const AllVendor = lazy(() => import("@/components/Reuseable/AllVendor"))
const VendorProfileProduct = lazy(() => import("@/components/Reuseable/VendorProfileProduct"))
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
const LocalFood = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/LocalFood"));
const LocalFoodsDrinks = lazy(() => import("@/components/AllCategory/LocalFoodandDrinksProducts/LocalFoodsDrinks"));
const PlantSeed = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/PlantSeed")
);
const Spices = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/Spices")
);
const Jewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/Jewelry")
);

const Vintage = lazy(() => import("@/components/AllCategory/VintageStocks/Vintage"));
const VintageJewelry = lazy(() => import("@/components/AllCategory/VintageAntiqueJewelry/VintageAntique"));
const Art = lazy(() => import("@/components/AllCategory/Art&Sculptures/ArtPage"))
const Traditionalitems =lazy(() => import("@/components/AllCategory/TraditionalandReligiousItems/TranditionalReligiousItems"))

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
)



// spices subcategory
const Conditments = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Conditments"));
const CookingIngredients = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/CookingIngredients"))
const CulturalRegional = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/CulturalRegional"));
const EthincallySourced = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/EthincallySourced"));
const HealthWellnessSpices = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/HealthWellnessSpices"));
const Marinades = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Marinades"));
const PopularUses = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/PopularUses"));
const SaltPepper = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/SaltPepper"));
const Seasoning = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Seasoning"));
const SpecialDietary = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/SpecialDietary"));
const SpiceKits = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/SpiceKits"));
const Spicesi = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Spices"));


// Fashion Subcategory
const Accessories = lazy(() => import("@/components/AllCategory/Fashion/subcategory/Accessories"))
const EthnicWear = lazy(() => import("@/components/AllCategory/Fashion/subcategory/EthnicWear"))
const FashionJewelry = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FashionJewelry"))
const FootWear = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FootWear"))
const KidFashion = lazy(() => import("@/components/AllCategory/Fashion/subcategory/KidFashion"))
const MenFashion = lazy(() => import("@/components/AllCategory/Fashion/subcategory/MenFashion"))
const SportWear = lazy(() => import("@/components/AllCategory/Fashion/subcategory/SportWear"))
const WomenFashion = lazy(() => import("@/components/AllCategory/Fashion/subcategory/WomenFashion"))

// Furniture
const BedroomFurniture = lazy(() => import("@/components/AllCategory/Furniture/subcategory/BedroomFurniture"))
const ChairsStools = lazy(() => import("@/components/AllCategory/Furniture/subcategory/ChairsStools"))
const Dresser = lazy(() => import("@/components/AllCategory/Furniture/subcategory/Dresser"))
const LivingRoom = lazy(() => import("@/components/AllCategory/Furniture/subcategory/LivingRoom"))
const OfficeFurniture = lazy(() => import("@/components/AllCategory/Furniture/subcategory/OfficeFurniture"))
const OutdoorFurniture = lazy(() => import("@/components/AllCategory/Furniture/subcategory/OutdoorFurniture"))
const SofasCouches = lazy(() => import("@/components/AllCategory/Furniture/subcategory/SofasCouches"))
const TablesDesks = lazy(() => import("@/components/AllCategory/Furniture/subcategory/TablesDesks"))

// Local Food
const CulturallySpecific = lazy(() => import('@/components/AllCategory/Local&TraditionalFoods/subcategory/CulturallySpecific'))
const EthinicSauces = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/EthinicSauces"));
const FermentedFood = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/FermentedFood"))
const FestivalFood = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/FestivalFood"))
const IndigenousBake = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/IndigenousBake"))
const LocalBeverages = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/LocalBeverages"))
const LocalGrains = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/LocalGrains"))
const MealPlans = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/MealPlans"))
const PackagedReadyFood = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/PackagedReadyFood"))
const PickledFood = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/PickledFood"))
const RegionalEthnicFood = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/RegionalEthnicFood"))
const SpecialtyGrains = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/SpecialtyGrains"))
const StapleFoods = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/StapleFoods"))
const TraditionalOil = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalOil"))
const TraditionalSnacks = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalSnacks"))
const TraditionalSoup = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalSoup"))
const TraditionalSweet = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalSweet"))


// PAYMENT
const SuccessPayment = lazy(() => import("@/components/Payment/PaymentSuccess"))
const FaliedPayment = lazy(() => import("@/components/Payment/PaymentFailed"))

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
      { path: "/product-details/:id", element: withSuspense(ProductDetail), errorElement: <ErrorPage /> },
      { path: "/product/:id", element: withSuspense(ProductInfo), errorElement: <ErrorPage /> },
      { path: "/auctionview", element: withSuspense(AuctionView) },
      { path: "/random-product", element: withSuspense(RandomProductPage) },
      { path: "/more-vendor", element: withSuspense(AllVendor) },
      { path: "/veiws-profile/:id", element: withSuspense(VendorProfileProduct), errorElement: <ErrorPage /> },
      { path: "/checkout", element: withSuspense(CheckOut) },

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
      { path: "/traditional-items", element: withSuspense(Traditionalitems) },
      { path: "/art", element: withSuspense(Art) },
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
      { path: "/CookingIngredients", element: withSuspense(CookingIngredients) },
      { path: "/CulturalRegional", element: withSuspense(CulturalRegional) },
      { path: "/EthincallySourced", element: withSuspense(EthincallySourced) },
      { path: "/HealthWellnessSpices", element: withSuspense(HealthWellnessSpices) },
      { path: "/Marinades", element: withSuspense(Marinades) },
      { path: "/PopularUses", element: withSuspense(PopularUses) },
      { path: "/SaltPepper", element: withSuspense(SaltPepper) },
      { path: "/Seasoning", element: withSuspense(Seasoning) },
      { path: "/SpecialDietary", element: withSuspense(SpecialDietary) },
      { path: "/SpiceKits", element: withSuspense(SpiceKits) },
      { path: "/Spices-i", element: withSuspense(Spicesi) },



      // Local & Traditional Foods Subcategory
      { path: "/CulturallySpecific", element: withSuspense(CulturallySpecific) },
      { path: "/EthinicSauces", element: withSuspense(EthinicSauces) },
      { path: "/FermentedFood", element: withSuspense(FermentedFood) },
      { path: "/FestivalFood", element: withSuspense(FestivalFood) },
      { path: "/IndigenousBake", element: withSuspense(IndigenousBake) },
      { path: "/LocalBeverages", element: withSuspense(LocalBeverages) },
      { path: "/LocalGrains", element: withSuspense(LocalGrains) },
      { path: "/MealPlans", element: withSuspense(MealPlans) },
      { path: "/PackagedReadyFood", element: withSuspense(PackagedReadyFood) },
      { path: "/PickledFood", element: withSuspense(PickledFood) },
      { path: "/RegionalEthnicFood", element: withSuspense(RegionalEthnicFood) },
      { path: "/SpecialtyGrains", element: withSuspense(SpecialtyGrains) },
      { path: "/StapleFoods", element: withSuspense(StapleFoods) },
      { path: "/TraditionalOil", element: withSuspense(TraditionalOil) },
      { path: "/TraditionalSnacks", element: withSuspense(TraditionalSnacks) },
      { path: "/TraditionalSoup", element: withSuspense(TraditionalSoup) },
      { path: "/TraditionalSweet", element: withSuspense(TraditionalSweet) },

      // Furniture Subcategory
      { path: "/BedroomFurniture", element: withSuspense(BedroomFurniture) },
      { path: "/ChairsStools", element: withSuspense(ChairsStools) },
      { path: "/Dresser", element: withSuspense(Dresser) },
      { path: "/LivingRoom", element: withSuspense(LivingRoom) },
      { path: "/OfficeFurniture", element: withSuspense(OfficeFurniture) },
      { path: "/OutdoorFurniture", element: withSuspense(OutdoorFurniture) },
      { path: "/SofasCouches", element: withSuspense(SofasCouches) },
      { path: "/TablesDesks", element: withSuspense(TablesDesks) },

      // Fashion Subcategory
      { path: "/Accessories", element: withSuspense(Accessories) },
      { path: "/EthnicWear", element: withSuspense(EthnicWear) },
      { path: "/FashionJewelry", element: withSuspense(FashionJewelry) },
      { path: "/FootWear", element: withSuspense(FootWear) },
      { path: "/KidFashion", element: withSuspense(KidFashion) },
      { path: "/MenFashion", element: withSuspense(MenFashion) },
      { path: "/SportWear", element: withSuspense(SportWear) },
      { path: "/WomenFashion", element: withSuspense(WomenFashion) },



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
      {
        path: "/dashboard/canclellation",
        element: withSuspense(Canclellation),
      },
      { path: "/dashboard/review", element: withSuspense(Review) },
      { path: "/dashboard/wishlist", element: withSuspense(Wishlist) },
      { path: "/dashboard/addresses", element: withSuspense(Address) },
      { path: "/dashboard/user-index", element: withSuspense(userIndex) },
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
          { path: "order-details", element: withSuspense(OrderDetails) },
          { path: "all-products", element: withSuspense(AllProduct) },
          { path: "new-product", element: withSuspense(NewProduct) },
          { path: "customers", element: withSuspense(Customer) },
          { path: "Payments", element: withSuspense(Payments) },
          { path: "preview-invoice", element: withSuspense(PreviewInvoice) },
          { path: "edit-vendor-profile", element: withSuspense(EditVendorProfile) },
          { path: "kyc-verification", element: withSuspense(KycVerification) },
          { path: "inbox", element: withSuspense(Inbox) },
          { path: "all-post", element: withSuspense(AllPost) },
          { path: "profile", element: withSuspense(ProfilePage) },
          { path: "my-community", element: withSuspense(CommunitySection) },
          { path: "reviews", element: withSuspense(Reviews) },
          { path: "pricing", element: withSuspense(Pricing) },
          {
            path: "comunity-detail/:communityid",
            element: withSuspense(CommunityDetailPage), errorElement: <ErrorPage />
          },
          {
            path: "products-detail/:productid",
            element: withSuspense(() => (
              <ProductDetailModal
                product={null}
                isOpen={false}
                onClose={() => { }}
                productId={""}
              />
            )),
            errorElement: <ErrorPage />
          },
        ],
      }
    ]
  },
  { path: "signin", element: withSuspense(Login) },
  { path: "signup", element: withSuspense(Signup) },
  { path: "welcomepage", element: withSuspense(WelcomePage) },
  { path: "selectpath", element: withSuspense(SelectionPath) },
  {
    path: "forgotpasswordmessage",
    element: withSuspense(ForgotpasswordMessage),
  },
  { path: "forgotpassword", element: withSuspense(ForgotPassword) },
  { path: "restpassword", element: withSuspense(ResetPassword) },
  { path: "/verify-otp/:userId", element: withSuspense(OtpVerify), errorElement: <ErrorPage /> },
  { path: "sendlink", element: withSuspense(SendLink) },
  { path: "numberforgotpass", element: withSuspense(Number) },
  { path: "updatepassword", element: withSuspense(Updatepassword) },

  { path: "login-vendor", element: withSuspense(LoginVendor) },
  { path: "signup-vendor", element: withSuspense(SignupVendor) },

  // Payment 
  { path: "/success", element: withSuspense(SuccessPayment) },
  { path: "/falied", element: withSuspense(FaliedPayment) },


  { path: "*", element: withSuspense(Error), errorElement: <ErrorPage /> }, // 404 page not found
];
export const mainRouter = createBrowserRouter(routesConfig);
