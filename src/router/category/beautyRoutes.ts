// src/routes/category/beautyRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

const BeautyWellness = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/BeautyWellness")
);

const Skincare = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/Skincare")
);
const Haircare = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/Haircare")
);
const Bodycare = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/Bodycare")
);
const Makeup = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/Makeup")
);
const Fragrances = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/Fragrances")
);
const Wellnessproducts = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/Wellnessproducts")
);
const MenGrooming = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/MenGrooming")
);
const BadychildCare = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/BadychildCare")
);
const HealthWellness = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/HealthWellness")
);
const ImmuityBoost = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/subcategory/ImmuityBoost")
);

export const beautyRoutes: RouteObject[] = [
  { index: true, element: withSuspense(BeautyWellness) }, // /beautywellness → main page

  { path: "skincare", element: withSuspense(Skincare) },
  { path: "haircare", element: withSuspense(Haircare) },
  { path: "bodycare", element: withSuspense(Bodycare) },
  { path: "makeup", element: withSuspense(Makeup) },
  { path: "fragrances", element: withSuspense(Fragrances) },
  { path: "wellnessproduct", element: withSuspense(Wellnessproducts) },
  { path: "men-grooming", element: withSuspense(MenGrooming) },
  { path: "badychild-care", element: withSuspense(BadychildCare) },
  { path: "health-wellness", element: withSuspense(HealthWellness) },
  { path: "immuity-boost", element: withSuspense(ImmuityBoost) },
];