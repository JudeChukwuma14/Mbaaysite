// src/routes/category/furnitureRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

const Furniture = lazy(
  () => import("@/components/AllCategory/Furniture/Furniture")
);

// Furniture Subcategories
const Seating = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/Seating")
);
const Table = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/Table")
);
const Storage = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/Storage")
);
const BedroomItem = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/BedroomItem")
);
const DecorUtility = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/DecorUtility")
);
const OutdoorPatio = lazy(
  () => import("@/components/AllCategory/Furniture/subcategory/OutdoorPatio")
);

export const furnitureRoutes: RouteObject[] = [
  { index: true, element: withSuspense(Furniture) }, // /furniture → main page

  { path: "seating", element: withSuspense(Seating) },
  { path: "tables", element: withSuspense(Table) },
  { path: "storage", element: withSuspense(Storage) },
  { path: "bedroom-items", element: withSuspense(BedroomItem) },
  { path: "decor-utility", element: withSuspense(DecorUtility) },
  { path: "outdoor-patio", element: withSuspense(OutdoorPatio) },
];