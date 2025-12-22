import { Spinner } from "@/components/ui/spinner";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
const Subscription = lazy(
  () => import("@/components/VendorInfo/Subcription/SubscriptionCallback")
);
const SubscriptionSuccess = lazy(
  () => import("@/components/VendorInfo/Subcription/SubscriptionSuccess")
);
const SubscriptionFailure = lazy(
  () => import("@/components/VendorInfo/Subcription/SubscriptionFailed")
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const subscriptionRoutes: RouteObject[] = [
  { path: "/subscription-callback", element: withSuspense(Subscription) },

  {
    path: "/subscription_success",
    element: withSuspense(SubscriptionSuccess),
  },
  {
    path: "/subscription_failed",
    element: withSuspense(SubscriptionFailure),
  },
];
