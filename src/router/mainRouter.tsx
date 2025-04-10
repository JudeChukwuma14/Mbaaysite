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
const AuctionView = lazy(() => import("@/components/AuctionPage/AuctionView"));
// const AuctionDetail = lazy(()=>import("@/components/AuctionPage/AuctionDetail"))
const Error = lazy(() => import("@/components/Error/Error"));
const userIndex = lazy(() => import("@/components/profileMangement/Index"));
const Address = lazy(() => import("@/components/profileMangement/Addresses"));
const ProductInfo = lazy(() => import("@/page/ProductInfo"));




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
      // {path:"/auctiondetail/:id",element:withSuspense(AuctionDetail)}
      
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
