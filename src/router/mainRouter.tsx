import Spinner from "@/components/Common/Spinner";
import WebLayout from "@/components/Layout/WebLayout";
import AccountManagement from "@/components/profileMangement/AccountManagement";
import VendorLayout from "@/components/VendorInfo/VendorLayout";
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

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
const Fashion = lazy(() => import("@/components/SubCategory/Fashion"));
const Furniture = lazy(() => import("@/components/SubCategory/Furniture"));
const BeautyWellness = lazy(
  () => import("@/components/SubCategory/BeautyWellness")
);
const BookPoetry = lazy(() => import("@/components/SubCategory/BookPoetry"));
const HomeDecor = lazy(() => import("@/components/SubCategory/HomeDecor"));
const LocalFood = lazy(() => import("@/components/SubCategory/LocalFood"));
const PlantSeed = lazy(() => import("@/components/SubCategory/PlantSeed"));
const Spices = lazy(() => import("@/components/SubCategory/Spices"));
const Jewelry = lazy(() => import("@/components/SubCategory/Jewelry"));
const TranditionalFabrics = lazy(
  () => import("@/components/SubCategory/TranditionalFabrics")
);
const Vintage = lazy(() => import("@/components/SubCategory/Vintage"));
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

const AllPost = lazy(() => import("@/components/VendorInfo/Community&Res/AllPost"))
const AuctionView = lazy(()=>import("@/components/AuctionPage/AuctionView"))
const AuctionDetail = lazy(()=>import("@/components/AuctionPage/AuctionDetail"))
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
      { path: "/fashion", element: withSuspense(Fashion) },
      { path: "/furniture", element: withSuspense(Furniture) },
      { path: "/beautywellness", element: withSuspense(BeautyWellness) },
      { path: "/bookpoetry", element: withSuspense(BookPoetry) },
      { path: "/homedecor", element: withSuspense(HomeDecor) },
      { path: "/localfood", element: withSuspense(LocalFood) },
      { path: "/plantseed", element: withSuspense(PlantSeed) },
      { path: "/spices", element: withSuspense(Spices) },
      { path: "/jewelry", element: withSuspense(Jewelry) },
      {
        path: "/tranditionalFabrics",
        element: withSuspense(TranditionalFabrics),
      },
      { path: "/vintage", element: withSuspense(Vintage) },
      { path: "/product-details/:id", element: withSuspense(ProductDetail) },
      {path:"/auctionview",element:withSuspense(AuctionView)},
      {path:"/auctiondetail/:id",element:withSuspense(AuctionDetail)}
    ],
  },
  {
    path: "/dashboard",
    element: <AccountManagement />,
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
];
export const mainRouter = createBrowserRouter(routesConfig);
