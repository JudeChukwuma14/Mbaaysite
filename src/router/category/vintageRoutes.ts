// src/routes/category/vintageRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

// Main Vintage pages
const Vintage = lazy(() => import("@/components/AllCategory/VintageStocks/Vintage"));
const VintageJewelry = lazy(() => import("@/components/AllCategory/VintageAntiqueJewelry/VintageAntique"));

// Vintage Jewelry Subcategories
const FestiveRitualJewelry = lazy(
  () => import("@/components/AllCategory/VintageAntiqueJewelry/subcategory/FestiveRitualJewelry")
);
const CulturalGemstones = lazy(
  () => import("@/components/AllCategory/VintageAntiqueJewelry/subcategory/CulturalGemstones")
);
const ReligiousSpiritualJewelry = lazy(
  () => import("@/components/AllCategory/VintageAntiqueJewelry/subcategory/ReligiousSpiritualJewelry")
);

// Vintage Stocks Subcategories
const VintageTextiles = lazy(
  () => import("@/components/AllCategory/VintageStocks/subcategory/VintageTextiles")
);
const VintageClothing = lazy(
  () => import("@/components/AllCategory/VintageStocks/subcategory/VintageClothing")
);
const VintageHomeDecor = lazy(
  () => import("@/components/AllCategory/VintageStocks/subcategory/VintageHomeDecor")
);
const VintageInstruments = lazy(
  () => import("@/components/AllCategory/VintageStocks/subcategory/VintageInstruments")
);
const VintageArt = lazy(
  () => import("@/components/AllCategory/VintageStocks/subcategory/VintageArt")
);
const VintageFurniture = lazy(
  () => import("@/components/AllCategory/VintageStocks/subcategory/VintageFurniture")
);
const VintageHandicraft = lazy(
  () => import("@/components/AllCategory/VintageStocks/subcategory/VintageHandicraft")
);
const VintageReligious = lazy(
  () => import("@/components/AllCategory/VintageStocks/subcategory/VintageReligious")
);
const VintageStorage = lazy(
  () => import("@/components/AllCategory/VintageStocks/subcategory/VintageStorage")
);

export const vintageRoutes: RouteObject[] = [
  // Default route: /vintage → main Vintage Stocks page
  { index: true, element: withSuspense(Vintage) },

  // Vintage Jewelry main page
  { path: "vintage-jewelry", element: withSuspense(VintageJewelry) },

  // Vintage Jewelry Subcategories
  { path: "festive-jewelry", element: withSuspense(FestiveRitualJewelry) },
  { path: "cultural-gemstones", element: withSuspense(CulturalGemstones) },
  { path: "religious-jewelry", element: withSuspense(ReligiousSpiritualJewelry) },

  // Vintage Stocks Subcategories
  { path: "vintagetextiles", element: withSuspense(VintageTextiles) },
  { path: "vintage-clothing", element: withSuspense(VintageClothing) },
  { path: "vintage-home", element: withSuspense(VintageHomeDecor) },
  { path: "vintage-instruments", element: withSuspense(VintageInstruments) },
  { path: "vintage-art", element: withSuspense(VintageArt) },
  { path: "vintage-furniture", element: withSuspense(VintageFurniture) },
  { path: "vintage-handicrafts", element: withSuspense(VintageHandicraft) },
  { path: "vintage-religious", element: withSuspense(VintageReligious) },
  { path: "vintage-storage", element: withSuspense(VintageStorage) },
];