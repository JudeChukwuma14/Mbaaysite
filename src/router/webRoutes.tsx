import Spinner from "@/components/Common/Spinner";
import ErrorPage from "@/components/Error/ErrorPage";
import WebLayout from "@/components/Layout/WebLayout";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { categoryRoutes } from "./category/index";
import Category from "./categoryRoutes"
const Home = lazy(() => import("@/page/HomeArea"));
const AboutUs = lazy(() => import("@/page/AboutUs"));
const Contact = lazy(() => import("@/page/Contact"));
const RandomProductPage = lazy(() => import("@/page/RandomProductPage"));
const AllVendor = lazy(() => import("@/components/Reuseable/AllVendor"));
const Cart = lazy(() => import("@/components/Payment/Cart"));
// Lazy-loaded pages that are not inside modular routes
const FlashSale = lazy(() => import("@/components/FlashSales/FlashSalePage"));
const FlashSaleDetailPage = lazy(
  () => import("@/components/FlashSales/FlashSaleDetailPage")
);
const ProductDetail = lazy(() => import("@/components/ProductDetail"));
const ProductInfo = lazy(() => import("@/page/ProductInfo"));
const AuctionView = lazy(() => import("@/components/AuctionPage/AuctionView"));
const AuctionDetail = lazy(
  () => import("@/components/AuctionPage/AuctionDetail")
);
const AuctionList = lazy(() => import("@/components/AuctionPage/AuctionList"));
const ArtProfile = lazy(
  () => import("@/components/AllCategory/Art/ArtProfile")
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const webRoutes: RouteObject[] = [
  {
    path: "/",
    element: <WebLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "/about", element: withSuspense(AboutUs) },
      { path: "/contact", element: withSuspense(Contact) },
      { path: "/random-product", element: withSuspense(RandomProductPage) },
      { path: "/more-vendor", element: withSuspense(AllVendor) },
      { path: "/cart", element: withSuspense(Cart) },
      // These are inside WebLayout (since webRoutes already defines it)
      { path: "flash-sale", element: withSuspense(FlashSale) },
      { path: "flash-sale/:id", element: withSuspense(FlashSaleDetailPage) },
      { path: "product-details/:id", element: withSuspense(ProductDetail) },
      { path: "product/:id", element: withSuspense(ProductInfo) },
      { path: "auctionview", element: withSuspense(AuctionView) },
      { path: "auction/:id", element: withSuspense(AuctionDetail) },
      { path: "auctionlist", element: withSuspense(AuctionList) },
      { path: "art-profile/:id", element: withSuspense(ArtProfile) },
      ...Category,
      ...categoryRoutes,
    ],
  },
];
