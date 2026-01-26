import ErrorPage from "@/components/Error/ErrorPage";
import Layout from "@/components/profileMangement/Layout";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import RestrictVendorRoute from "./RestrictVendorRoute";
import ChatInterfaceChat from "@/components/profileMangement/chat/ChatInterfaceChat";
import Spinner from "@/components/Common/Spinner";

const EditProfile = lazy(
  () => import("@/components/profileMangement/EditProfile")
);
const OrderList = lazy(
  () => import("@/components/profileMangement/payment/Orderlist")
);
const OrderDetail = lazy(
  () => import("@/components/profileMangement/payment/OrderDetail")
);
const CheckOut = lazy(
  () => import("@/components/profileMangement/payment/CheckOut")
);
const Canclellation = lazy(
  () => import("@/components/profileMangement/payment/CancellationForm")
);
const Wishlist = lazy(() => import("@/components/profileMangement/Wishlist"));
const ReturnForm = lazy(
  () => import("@/components/profileMangement/payment/ReturnForm")
);
const Review = lazy(() => import("@/components/profileMangement/ReviewForm"));
// const ReturnForm = lazy(()=>import("@/components/profileMangement/review/ReviewForm"))
const Address = lazy(() => import("@/components/profileMangement/Addresses"));
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(EditProfile) },
      { path: "orderlist", element: withSuspense(OrderList) },
      { path: "orderdetail", element: withSuspense(OrderDetail) },
      { path: "checkout", element: withSuspense(CheckOut) },
      { path: "canclellation", element: withSuspense(Canclellation) },
       {
        path: "retrunproduct",
        element: withSuspense(ReturnForm),
      },
      { path: "review", element: withSuspense(Review) },
      { path: "wishlist", element: withSuspense(Wishlist) },
      { path: "addresses", element: withSuspense(Address) },
      {
        path: "messages",
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
];
