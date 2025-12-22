import Spinner from "@/components/Common/Spinner";
import ErrorPage from "@/components/Error/ErrorPage";
import NumberForgotPassword from "@/components/userAuth/NumberForgotPassword";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const Signin = lazy(() => import("@/components/userAuth/Signin"));
const Signup = lazy(() => import("@/components/userAuth/Signup"));
const WelcomePage = lazy(() => import("@/components/userAuth/WelcomePage"));
const SelectionPath = lazy(() => import("@/components/userAuth/SelectOption"));
const ForgotpasswordMessage = lazy(
  () => import("@/components/userAuth/Forgotpasswordmessage")
);
const ForgotPassword = lazy(
  () => import("@/components/userAuth/Forgotpassword")
);
const ChangePassword = lazy(
  () => import("@/components/userAuth/ChangePassword")
);
const OtpVerify = lazy(() => import("@/components/userAuth/OTPVerification"));
const SendLink = lazy(() => import("@/components/userAuth/LinkExpired"));
const Updatepassword = lazy(
  () => import("@/components/userAuth/Updatedpassword")
);
const LoginVendor = lazy(() => import("@/components/auth/LoginVendor"));
const SignupVendor = lazy(() => import("@/components/auth/SignupVendor"));
const CompleteSignup = lazy(() => import("@/components/auth/CompleteSignup"));
const PendingApproval = lazy(() => import("@/components/auth/PendingApproval"));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const authRoutes: RouteObject[] = [
  { path: "signin", element: withSuspense(Signin) },
  { path: "signup", element: withSuspense(Signup) },
  { path: "welcomepage", element: withSuspense(WelcomePage) },
  { path: "selectpath", element: withSuspense(SelectionPath) },
  {
    path: "forgotpasswordmessage",
    element: withSuspense(ForgotpasswordMessage),
  },
  { path: "forgot-password", element: withSuspense(ForgotPassword) },
  { path: "restpassword", element: withSuspense(ChangePassword) },
  { path: "sendlink", element: withSuspense(SendLink) },
  { path: "numberforgotpass", element: withSuspense(NumberForgotPassword) },
  { path: "updatepassword", element: withSuspense(Updatepassword) },

  { path: "login-vendor", element: withSuspense(LoginVendor) },
  { path: "signup-vendor", element: withSuspense(SignupVendor) },
  { path: "complete-signup", element: withSuspense(CompleteSignup) },
  { path: "pending-approval", element: withSuspense(PendingApproval) },
  {
    path: "/verify-otp/:userId",
    element: withSuspense(OtpVerify),
    errorElement: <ErrorPage />,
  },
];
