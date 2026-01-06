// src/routes/category/fashionRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

const Fashion = lazy(() => import("@/components/AllCategory/Fashion/Fashion"));
const TF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/TF/TF"));
const MenWear = lazy(() => import("@/components/AllCategory/Fashion/subcategory/TF/MenWear"));
const WomenWear = lazy(() => import("@/components/AllCategory/Fashion/subcategory/TF/WomenWear"));
const ChildrenWear = lazy(() => import("@/components/AllCategory/Fashion/subcategory/TF/ChildrenWear"));
const Unsex = lazy(() => import("@/components/AllCategory/Fashion/subcategory/TF/Unsex"));
const MT = lazy(() => import("@/components/AllCategory/Fashion/subcategory/MT/MT"));
const CAF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/MT/CAF"));
const EUW = lazy(() => import("@/components/AllCategory/Fashion/subcategory/MT/EUW"));
const FUC = lazy(() => import("@/components/AllCategory/Fashion/subcategory/MT/FUC"));
const CMF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/MT/CMF"));
const FW = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FW/FW"));
const TSS = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FW/TSS"));
const LHS = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FW/LHS"));
const MSC = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FW/MSC"));
const CSS = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FW/CSS"));
const AC = lazy(() => import("@/components/AllCategory/Fashion/subcategory/AC/AC"));
const BSS = lazy(() => import("@/components/AllCategory/Fashion/subcategory/AC/BSS"));
const BP = lazy(() => import("@/components/AllCategory/Fashion/subcategory/AC/BP"));
const HS = lazy(() => import("@/components/AllCategory/Fashion/subcategory/AC/HS"));
const JA = lazy(() => import("@/components/AllCategory/Fashion/subcategory/AC/JA"));
const FB = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FB/FB"));
const HLF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FB/HLF"));
const PRF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FB/PRF"));
const EHT = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FB/EHT"));
const NOF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FB/NOF"));
const OF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/OF/OF"));
const WF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/OF/WF"));
const FCF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/OF/FCF"));
const CEF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/OF/CEF"));
const FC = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FC/FC"));
const WA = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FC/WA"));
const FCO = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FC/FCO"));
const REC = lazy(() => import("@/components/AllCategory/Fashion/subcategory/FC/REC"));
const RF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/RF/RF"));
const SF = lazy(() => import("@/components/AllCategory/Fashion/subcategory/SF/SF"));
const EB = lazy(() => import("@/components/AllCategory/Fashion/subcategory/EB/EB"));
const BS = lazy(() => import("@/components/AllCategory/Fashion/subcategory/BS/BS"));
const ST = lazy(() => import("@/components/AllCategory/Fashion/subcategory/ST/ST"));

export const fashionRoutes: RouteObject[] = [
  { index: true, element: withSuspense(Fashion) }, // /fashion → main Fashion page

  // Traditional Fashion (TF)
  { path: "traditional-fashion", element: withSuspense(TF) },
  { path: "men-tf-wear", element: withSuspense(MenWear) },
  { path: "women-tf-wear", element: withSuspense(WomenWear) },
  { path: "children-tf-wear", element: withSuspense(ChildrenWear) },
  { path: "unisex-tf-wear", element: withSuspense(Unsex) },

  // Modern Traditional (MT)
  { path: "modern-traditional", element: withSuspense(MT) },
  { path: "contemporary-african-fashion", element: withSuspense(CAF) },
  { path: "ethnic-inspired-urban-wear", element: withSuspense(EUW) },
  { path: "fusion-clothing", element: withSuspense(FUC) },
  { path: "custom-made-ethnic-fashion", element: withSuspense(CMF) },

  // Footwear (FW)
  { path: "footwear", element: withSuspense(FW) },
  { path: "traditional-shoes", element: withSuspense(TSS) },
  { path: "leather-handmade", element: withSuspense(LHS) },
  { path: "modern-shoes", element: withSuspense(MSC) },
  { path: "custom-shoes-sandals", element: withSuspense(CSS) },

  // Accessories (AC)
  { path: "accessories", element: withSuspense(AC) },
  { path: "belts-sashes", element: withSuspense(BSS) },
  { path: "bags-pouches", element: withSuspense(BP) },
  { path: "headwear-scarves", element: withSuspense(HS) },
  { path: "jewelry-adornments", element: withSuspense(JA) },

  // Fabrics (FB)
  { path: "fabrics", element: withSuspense(FB) },
  { path: "handwoven-fabrics", element: withSuspense(HLF) },
  { path: "printed-fabrics", element: withSuspense(PRF) },
  { path: "embroidered-handmade", element: withSuspense(EHT) },
  { path: "natural-organic", element: withSuspense(NOF) },

  // Occasion Footwear (OF)
  { path: "occasion-footwear", element: withSuspense(OF) },
  { path: "wedding-footwear", element: withSuspense(WF) },
  { path: "festival-ceremony", element: withSuspense(FCF) },
  { path: "casual-ethnic", element: withSuspense(CEF) },

  // Festival Clothing (FC)
  { path: "festival-clothing", element: withSuspense(FC) },
  { path: "wedding-attire", element: withSuspense(WA) },
  { path: "festival-ceremony-clothing", element: withSuspense(FCO) },
  { path: "religious-clothing", element: withSuspense(REC) },

  // Regional & Seasonal (RF, SF)
  { path: "regional-fashion", element: withSuspense(RF) },
  { path: "seasonal-fashion", element: withSuspense(SF) },

  // Embroidery, Bespoke, Sustainable
  { path: "embroidery", element: withSuspense(EB) },
  { path: "bespoke", element: withSuspense(BS) },
  { path: "sustainable", element: withSuspense(ST) },
];