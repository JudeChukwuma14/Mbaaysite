import Spinner from "@/components/Common/Spinner";
import ErrorPage from "@/components/Error/ErrorPage";
import WebLayout from "@/components/Layout/WebLayout";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const Home = lazy(() => import("@/page/HomeArea"));
const AboutUs = lazy(() => import("@/page/AboutUs"));
const Contact = lazy(() => import("@/page/Contact"));
const RandomProductPage = lazy(() => import("@/page/RandomProductPage"));
const AllVendor = lazy(() => import("@/components/Reuseable/AllVendor"));
const Cart = lazy(() => import("@/components/Payment/Cart"));



const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const webRoutes:RouteObject[] =[
    {
        path: "/",
        element: <WebLayout/>,
        errorElement:<ErrorPage/>,
        children:[
            {index:true, element:withSuspense(Home)},
            {path: "/about", element:withSuspense(AboutUs)},
            {path: "/contact", element:withSuspense(Contact)},
            {path: "/random-product", element:withSuspense(RandomProductPage)},
            {path: "/more-vendor", element:withSuspense(AllVendor)},
            {path: "/cart", element:withSuspense(Cart)},

        ]


    }
]