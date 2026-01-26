// src/routes/category/spicesRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

const Spices = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/Spices")
);

// All subcategories
const Conditments = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Conditments")
);
const CookingIngredients = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/CookingIngredients")
);
const CulturalRegional = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/CulturalRegional")
);
const EthincallySourced = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/EthincallySourced")
);
const HealthWellnessSpices = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/HealthWellnessSpices")
);
const Marinades = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Marinades")
);
const PopularUses = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/PopularUses")
);
const SaltPepper = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/SaltPepper")
);
const Seasoning = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Seasoning")
);
const SpecialDietary = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/SpecialDietary")
);
const SpiceKits = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/SpiceKits")
);
const Spicesi = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/subcategory/Spices")
);

export const spicesRoutes: RouteObject[] = [
  { index: true, element: withSuspense(Spices) }, // /spices → main page

  { path: "conditments", element: withSuspense(Conditments) },
  { path: "CookingIngredients", element: withSuspense(CookingIngredients) },
  { path: "CulturalRegional", element: withSuspense(CulturalRegional) },
  { path: "EthincallySourced", element: withSuspense(EthincallySourced) },
  { path: "HealthWellnessSpices", element: withSuspense(HealthWellnessSpices) },
  { path: "marinades", element: withSuspense(Marinades) },
  { path: "popularuses", element: withSuspense(PopularUses) },
  { path: "SaltPepper", element: withSuspense(SaltPepper) },
  { path: "seasoning", element: withSuspense(Seasoning) },
  { path: "SpecialDietary", element: withSuspense(SpecialDietary) },
  { path: "SpiceKits", element: withSuspense(SpiceKits) },
  { path: "spices-i", element: withSuspense(Spicesi) },
];