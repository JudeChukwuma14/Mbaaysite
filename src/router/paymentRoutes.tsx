import { Spinner } from "@/components/ui/spinner";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
const Success = lazy(() => import("@/components/Payment/PaymentSuccess"));
const Failed = lazy(() => import("@/components/Payment/PaymentFailed"));
const PaymentCallBack = lazy(
  () => import("@/components/Payment/PaymentCallback")
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const paymentRoutes: RouteObject[] = [
  {
    path: "/:sessionId/success",
    element: withSuspense(Success),
  },
  {
    path: "/failed",
    element: withSuspense(Failed),
  },
  {
    path: "/payment_callback",
    element: withSuspense(PaymentCallBack),
  }
];
