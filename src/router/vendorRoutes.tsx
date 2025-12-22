import Spinner from "@/components/Common/Spinner";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedVendor from "./ProtectedVendor";
import ErrorPage from "@/components/Error/ErrorPage";
import VendorLayout from "@/components/VendorInfo/VendorLayout";
import ProductDetailModal from "@/components/VendorInfo/Products/ProductDetailModal";

const Dashboard = lazy(()=>import("@/components/VendorInfo/Dashboard"))
const AllOrder = lazy(()=>import("@/components/VendorInfo/Orders/AllOrder"))
const OrderDetails = lazy(()=>import("@/components/VendorInfo/Orders/OrderDetails"))
const NewProduct = lazy(()=>import("@/components/VendorInfo/Products/NewProduct"))
const AllProduct = lazy(()=>import("@/components/VendorInfo/Products/AllProduct"))
const Customer = lazy(()=>import("@/components/VendorInfo/Customers/Customer"))
const Payments = lazy(()=>import("@/components/VendorInfo/Payments/Payments"))
const PreviewInvoice = lazy(()=>import("@/components/VendorInfo/Payments/PreviewInvoice"))
const EditVendorProfile = lazy(()=>import("@/components/VendorInfo/Setting/EditVendorProfile"))
const VendorProfileCommunity = lazy(()=>import("@/components/VendorInfo/Community&Res/VendorProfileCommunity"))
const KycVerification = lazy(()=>import("@/components/VendorInfo/Setting/KycVerification"))
const MyOrders = lazy(()=>import("@/components/VendorInfo/Orders/MyOrders"))
const ReturnProducts = lazy(()=>import("@/components/VendorInfo/Products/ReturnProducts"))
const OrderCancellation = lazy(()=>import("@/components/VendorInfo/Orders/OrderCancellation"))
const Inbox = lazy(()=>import("@/components/VendorInfo/chat/Inbox"))
const AllPost = lazy(()=>import("@/components/VendorInfo/Community&Res/AllPost"))
const ProfilePage = lazy(()=>import("@/components/VendorInfo/Community&Res/Proflie"))
const CommunitySection = lazy(()=>import("@/components/VendorInfo/Community&Res/CommunitySection"))
const CommunityDetailPage = lazy(()=>import("@/components/VendorInfo/Community&Res/CommunityDetailPage"))
const Reviews = lazy(()=>import("@/components/VendorInfo/Review/Reviews"))
const Pricing = lazy(()=>import("@/components/VendorInfo/Pricing/Pricing"))
const Upgrade = lazy(()=>import("@/components/VendorInfo/Pricing/Upgrade"))


const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const vendorRoutes: RouteObject[]=[
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
          {
            path: "vendor-details/:id",
            element: withSuspense(VendorProfileCommunity),
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
]