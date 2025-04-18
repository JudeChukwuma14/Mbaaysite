import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import Spinner from "@/components/Common/Spinner";
import WebLayout from "@/components/Layout/WebLayout";
import Layout from "@/components/profileMangement/Layout";
// import AccountManagement from "@/components/profileMangement/AccountManagement";
// import CommunityPage from "@/components/VendorInfo/Community&Res/Community";
import CommunityDetailPage from "@/components/VendorInfo/Community&Res/CommunityDetailPage";
import VendorLayout from "@/components/VendorInfo/VendorLayout";
const Home = lazy(() => import("@/page/HomeArea"));
const About = lazy(() => import("@/page/AboutUs"));
const Contact = lazy(() => import("@/page/Contact"));
const Cart = lazy(() => import("@/components/Cart"));
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
const CheckOut = lazy(() => import("@/components/profileMangement/CheckOut"));
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
const RandomProductPage = lazy(()=>import("@/page/RandomProductPage"))



// All Category Links
const Fashion = lazy(() => import("@/components/AllCategory/Fashion/Fashion"));
const Furniture = lazy(() => import("@/components/AllCategory/Furniture/Furniture"));
const BeautyWellness = lazy(() => import("@/components/AllCategory/Beauty&Wellness/BeautyWellness"));
const BookPoetry = lazy(() => import("@/components/AllCategory/Books&Poetry/BookPoetry"));
const HomeDecor = lazy(() => import("@/components/AllCategory/HomeDécor&Accessories/HomeDecor"));
const LocalFood = lazy(() => import("@/components/AllCategory/Local&TraditionalFoods/LocalFood"));
const PlantSeed = lazy(() => import("@/components/AllCategory/Plant&Seeds/PlantSeed"));
const Spices = lazy(() => import("@/components/AllCategory/SpicesCondiments&Seasonings/Spices"));
const Jewelry = lazy(() => import("@/components/AllCategory/Jewelry&Gemstones/Jewelry"));
const TranditionalFabrics = lazy(() =>import("@/components/AllCategory/TraditionalClothing&Fabrics/TranditionalFabrics"));
const Vintage = lazy(() => import("@/components/AllCategory/VintageStocks/Vintage"));




// BeautyWellness Subcategory Page
const Skincare = lazy(()=>import("@/components/AllCategory/Beauty&Wellness/subcategory/Skincare"))
const Haircare = lazy(()=>import("@/components/AllCategory/Beauty&Wellness/subcategory/Haircare"))
const Bodycare = lazy(()=>import("@/components/AllCategory/Beauty&Wellness/subcategory/Bodycare"))
const Makeup = lazy(()=>import("@/components/AllCategory/Beauty&Wellness/subcategory/Makeup"))
const Fragrances = lazy(()=>import("@/components/AllCategory/Beauty&Wellness/subcategory/Fragrances"))
const Wellnessproducts = lazy(()=>import("@/components/AllCategory/Beauty&Wellness/subcategory/Wellnessproducts"))
const MenGrooming = lazy(()=>import("@/components/AllCategory/Beauty&Wellness/subcategory/MenGrooming"))
const BadychildCare = lazy(()=>import("@/components/AllCategory/Beauty&Wellness/subcategory/BadychildCare"))
const HealthWellness = lazy(()=>import("@/components/AllCategory/Beauty&Wellness/subcategory/HealthWellness"))
const ImmuityBoost = lazy(()=>import("@/components/AllCategory/Beauty&Wellness/subcategory/ImmuityBoost"))



//Jewelry and Gemstones Subcategory
const HandmadeJewelry = lazy(()=>import("@/components/AllCategory/Jewelry&Gemstones/subcategory/HandmadeJewelry"))
const Gemstones = lazy(()=>import("@/components/AllCategory/Jewelry&Gemstones/subcategory/Gemstones"))
const JewelryMaterials = lazy(()=>import("@/components/AllCategory/Jewelry&Gemstones/subcategory/JewelryMaterials"))
const SustainableJewelry = lazy(()=>import("@/components/AllCategory/Jewelry&Gemstones/subcategory/SustainableJewelry"))
const ChildrenJewelry = lazy(()=>import("@/components/AllCategory/Jewelry&Gemstones/subcategory/ChildrenJewelry"))
const MenJewelry = lazy(()=>import("@/components/AllCategory/Jewelry&Gemstones/subcategory/MenJewelry"))
const OccasionJewelry = lazy(()=>import("@/components/AllCategory/Jewelry&Gemstones/subcategory/OccasionJewelry"))
const TraditionalJewelry = lazy(()=>import("@/components/AllCategory/Jewelry&Gemstones/subcategory/TraditionalJewelry"))
const GemstoneJewelry = lazy(()=>import("@/components/AllCategory/Jewelry&Gemstones/subcategory/GemstoneJewelry"))


// Books and poetry subcategory
const CulturalEthnic = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/CulturalEthnic"))
const TranditionalFolk = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/TranditionalFolk"))
const Poetry = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/Poetry"))
const HistoricalNarratives = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/HistoricalNarratives"))
const SpiritualityReligion = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/SpiritualityReligion"))
const LanguageLinguistics = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/LanguageLinguistics"))
const CookbooksCulinaryTradition = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/CookbooksCulinaryTradition"))
const ArtCraft = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/ArtCraft"))
const Childrenbook = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/Childrenbook"))
const TravelExploration = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/TravelExploration"))
const HealthWellnessBook = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/HealthWellness"))
const PoliticalSocialIssues = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/PoliticalSocialIssues")) 
const ArtisticCreative = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/ArtisticCreative")) 
const EnvironmentalNature = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/EnvironmentalNature")) 
const InspriationalMotivational = lazy(()=>import("@/components/AllCategory/Books&Poetry/subcategory/InspriationalMotivational")) 




// Homedocor Subcategory
const TextileFabrics = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/TextileFabrics"))
const CeramicsPottery = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/CeramicsPottery"))
const Woodcraft = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/Woodcraft"))
const Metalwork = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/Metalwork"))
const BasketsWeaving = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/BasketsWeaving"))
const Glasswork = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/Glasswork"))
const Leather = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/LeatherWoods"))
const BeadedDecor = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/BeadedDecor"))
const StoneMarble = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/StoneMarble"))
const HandcraftedKitchenware = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/HandcraftedKitchenware"))
const WallArt = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/WallArt"))
const Mirrors = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/Mirrors"))
const Handwoven = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/HandwovenMatsCarpets"))
const HandCraftedLamps = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/HandCraftedLamps"))
const JewelryTrinket = lazy(()=>import("@/components/AllCategory/HomeDécor&Accessories/subcategory/JewelryTrinket"))



// Vintage Stock Subcategory
const VintageTextiles = lazy(()=>import("@/components/AllCategory/VintageStocks/subcategory/VintageTextiles"))
const VintageClothing = lazy(()=>import("@/components/AllCategory/VintageStocks/subcategory/VintageClothing"))
const VintageHomeDecor = lazy(()=>import("@/components/AllCategory/VintageStocks/subcategory/VintageHomeDecor"))
const VintageInstruments = lazy(()=>import("@/components/AllCategory/VintageStocks/subcategory/VintageInstruments"))
const VintageArt = lazy(()=>import("@/components/AllCategory/VintageStocks/subcategory/VintageArt"))
const VintageFurniture = lazy(()=>import("@/components/AllCategory/VintageStocks/subcategory/VintageFurniture"))
const VintageHandicraft = lazy(()=>import("@/components/AllCategory/VintageStocks/subcategory/VintageHandicraft"))
const VintageReligious = lazy(()=>import("@/components/AllCategory/VintageStocks/subcategory/VintageReligious"))
const VintageStorage = lazy(()=>import("@/components/AllCategory/VintageStocks/subcategory/VintageStorage"))


// Plant Seeds subcategory
const Plant = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/Plants"))
const FruitPlants = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/FruitPlants"))
const Vegetableplants = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/Vegetableplants"))
const MedicinalPlants = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/MedicinalPlants"))
const Seed = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/Seed"))
const HerbSeeds = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/HerbSeeds"))
const FlowerSeeds = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/FlowerSeeds"))
const CulturalTraditionalSeed = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/CulturalTraditionalSeed"))
const PlantingKit = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/PlantingKit"))
const PlantCareProduct = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/PlantCareProduct"))
const SeedingSapling = lazy(()=>import("@/components/AllCategory/Plant&Seeds/subcategory/SeedingSapling"))








const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: <WebLayout />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "/about", element: withSuspense(About) },
      { path: "/contact", element: withSuspense(Contact) },
      { path: "/cart", element: withSuspense(Cart) },
      { path: "/product-details/:id", element: withSuspense(ProductDetail) },
      { path: "/product/:id", element: withSuspense(ProductInfo) }, 
      { path: "/auctionview", element: withSuspense(AuctionView) },
      {path:"/random-product",element:withSuspense(RandomProductPage)},
      
      // All Category Links
      { path: "/fashion", element: withSuspense(Fashion) },
      { path: "/furniture", element: withSuspense(Furniture) },
      { path: "/bookpoetry", element: withSuspense(BookPoetry)},
      { path: "/homedecor", element: withSuspense(HomeDecor) },
      { path: "/localfood", element: withSuspense(LocalFood) },
      { path: "/plantseed", element: withSuspense(PlantSeed) },
      { path: "/spices", element: withSuspense(Spices) },
      { path: "/jewelry", element: withSuspense(Jewelry) },
      { path: "/vintage", element: withSuspense(Vintage) },
      { path: "/beautywellness", element: withSuspense(BeautyWellness) },
      {path: "/tranditionalFabrics", element: withSuspense(TranditionalFabrics)},
            
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
      { path: "/sustainable-jewelry", element: withSuspense(SustainableJewelry) },
      { path: "/children-jewelry", element: withSuspense(ChildrenJewelry) },
      { path: "/men-jewelry", element: withSuspense(MenJewelry) },
      { path: "/occasion-jewelry", element: withSuspense(OccasionJewelry) },
      { path: "/traditional-jewelry", element: withSuspense(TraditionalJewelry) },
      { path: "/gemstone-jewelry", element: withSuspense(GemstoneJewelry) },

      // Books Subcategory
      { path: "/cultural-ethnic", element: withSuspense(CulturalEthnic) },
      { path: "/traditional-folk", element: withSuspense(TranditionalFolk) },
      { path: "/poetry", element: withSuspense(Poetry) },
      { path: "/historical-narrative", element: withSuspense(HistoricalNarratives) },
      { path: "/spirituality-religion", element: withSuspense(SpiritualityReligion) },
      { path: "/language-linguistics", element: withSuspense(LanguageLinguistics) },
      { path: "cookbook", element: withSuspense(CookbooksCulinaryTradition) },
      { path: "/art-craft", element: withSuspense(ArtCraft) },
      { path: "children-book", element: withSuspense(Childrenbook) },
      { path: "travel-exploration", element: withSuspense(TravelExploration) },
      { path: "health-wellness", element: withSuspense(HealthWellnessBook) },
      { path: "political-social", element: withSuspense(PoliticalSocialIssues) },
      { path: "/artistic-writing", element: withSuspense(ArtisticCreative) },
      { path: "/environment-nature", element: withSuspense(EnvironmentalNature) },
      { path: "/inspirational-book", element: withSuspense(InspriationalMotivational) },

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
      { path: "/handcrafted-kitchenware", element: withSuspense(HandcraftedKitchenware) },
      { path: "/wall-art", element: withSuspense(WallArt) },
      { path: "/mirrors", element: withSuspense(Mirrors) },
      { path: "/artistic-writing", element: withSuspense(Handwoven) },
      { path: "/handcrafted", element: withSuspense(HandCraftedLamps) },
      { path: "/jewelry-trinket", element: withSuspense(JewelryTrinket) },

      // Vintage stock
      { path: "/vintagetextiles", element: withSuspense(VintageTextiles) },
      { path: "/Vintage-Clothing", element: withSuspense(VintageClothing) },
      { path: "/Vintage-Home", element: withSuspense(VintageHomeDecor) },
      { path: "/Vintage-Instruments", element: withSuspense(VintageInstruments) },
      { path: "/Vintage-Art", element: withSuspense(VintageArt) },
      { path: "/Vintage-Furniture", element: withSuspense(VintageFurniture) },
      { path: "/Vintage-Handicrafts", element: withSuspense(VintageHandicraft) },
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
      { path: "/CulturalTraditionalSeed", element: withSuspense(CulturalTraditionalSeed) },
      { path: "/PlantingKit", element: withSuspense(PlantingKit) },
      { path: "/PlantCareProduct", element: withSuspense(PlantCareProduct) },
      { path: "/SeedingSapling", element: withSuspense(SeedingSapling) },
    ],
  },
  {
    path: "/dashboard",
    element: <Layout />,
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
      { path: "/dashboard/checkout", element: withSuspense(CheckOut) },
      { path: "/dashboard/addresses", element: withSuspense(Address) },
      { path: "/dashboard/user-index", element: withSuspense(userIndex) },
    ],
  },
  {
    path: "/app",
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
  { path: "/verify-otp/:userId", element: withSuspense(OtpVerify) },
  { path: "sendlink", element: withSuspense(SendLink) },
  { path: "numberforgotpass", element: withSuspense(Number) },
  { path: "updatepassword", element: withSuspense(Updatepassword) },

  { path: "login-vendor", element: withSuspense(LoginVendor) },
  { path: "signup-vendor", element: withSuspense(SignupVendor) },

  { path: "*", element: withSuspense(Error) }, // 404 page not found
];
export const mainRouter = createBrowserRouter(routesConfig);
