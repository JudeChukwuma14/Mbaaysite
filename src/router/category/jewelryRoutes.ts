// src/routes/category/jewelryRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

const Jewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/Jewelry")
);

// Jewelry & Gemstones Subcategories
const HandmadeJewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/subcategory/HandmadeJewelry")
);
const Gemstones = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/subcategory/Gemstones")
);
const JewelryMaterials = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/subcategory/JewelryMaterials")
);
const SustainableJewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/subcategory/SustainableJewelry")
);
const ChildrenJewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/subcategory/ChildrenJewelry")
);
const MenJewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/subcategory/MenJewelry")
);
const OccasionJewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/subcategory/OccasionJewelry")
);
const TraditionalJewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/subcategory/TraditionalJewelry")
);
const GemstoneJewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/subcategory/GemstoneJewelry")
);

export const jewelryRoutes: RouteObject[] = [
  { index: true, element: withSuspense(Jewelry) }, // /jewelry → main page

  { path: "handmade-jewelry", element: withSuspense(HandmadeJewelry) },
  { path: "gemstones", element: withSuspense(Gemstones) },
  { path: "jewelry-materials", element: withSuspense(JewelryMaterials) },
  { path: "sustainable-jewelry", element: withSuspense(SustainableJewelry) },
  { path: "children-jewelry", element: withSuspense(ChildrenJewelry) },
  { path: "men-jewelry", element: withSuspense(MenJewelry) },
  { path: "occasion-jewelry", element: withSuspense(OccasionJewelry) },
  { path: "traditional-jewelry", element: withSuspense(TraditionalJewelry) },
  { path: "gemstone-jewelry", element: withSuspense(GemstoneJewelry) },
];