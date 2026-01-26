

import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "@/components/Error/ErrorPage";
import { webRoutes } from "./webRoutes";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { vendorRoutes } from "./vendorRoutes";
import { paymentRoutes } from "./paymentRoutes";
import { subscriptionRoutes } from "./subscriptionRoutes";


// Reusable Suspense wrapper (used for standalone lazy pages)

export const indexRoutes = createBrowserRouter([
  // ==================== MAIN PUBLIC SITE (WebLayout) ====================
  ...webRoutes,
  // ==================== AUTHENTICATION ROUTES ====================
  ...authRoutes,

  // ==================== USER DASHBOARD (/dashboard/*) ====================
  ...dashboardRoutes,

  // ==================== VENDOR DASHBOARD (/app/*) ====================
  ...vendorRoutes,

  // ==================== PAYMENT CALLBACKS ====================
  ...paymentRoutes,

  // ==================== SUBSCRIPTION CALLBACKS ====================
  ...subscriptionRoutes,

  // ==================== 404 FALLBACK ====================
  { path: "*", element: <ErrorPage /> },
]);


