// src/routes/category/traditionalReligiousRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense"; // Adjust path if needed

// All Traditional & Religious Subcategories
const ReligiousAS = lazy(
  () => import("@/components/AllCategory/TraditionalandReligiousItems/subcategory/ReligiousAS")
);
const Tcc = lazy(
  () => import("@/components/AllCategory/TraditionalandReligiousItems/subcategory/Tcc")
);
const Rja = lazy(
  () => import("@/components/AllCategory/TraditionalandReligiousItems/subcategory/Rja")
);
const As = lazy(
  () => import("@/components/AllCategory/TraditionalandReligiousItems/subcategory/As")
);
const Crt = lazy(
  () => import("@/components/AllCategory/TraditionalandReligiousItems/subcategory/Crt")
);
const Shmi = lazy(
  () => import("@/components/AllCategory/TraditionalandReligiousItems/subcategory/Shmi")
);
const Cfi = lazy(
  () => import("@/components/AllCategory/TraditionalandReligiousItems/subcategory/Cfi")
);
const Rt = lazy(
  () => import("@/components/AllCategory/TraditionalandReligiousItems/subcategory/Rt")
);

export const traditionalReligiousRoutes: RouteObject[] = [
  // Default landing page for /traditional-items
  // Using Religious Artifacts & Symbols as the main entry (most logical)
  { index: true, element: withSuspense(ReligiousAS) },

  { path: "religious-artifacts", element: withSuspense(ReligiousAS) },
  { path: "ceremonial-clothing", element: withSuspense(Tcc) },
  { path: "religious-jewelry", element: withSuspense(Rja) },
  { path: "altars-shrines", element: withSuspense(As) },
  { path: "ceremonial-ritual-tools", element: withSuspense(Crt) },
  { path: "spiritual-healing-meditation-items", element: withSuspense(Shmi) },
  { path: "cultural-festive", element: withSuspense(Cfi) },
  { path: "ritual-tools", element: withSuspense(Rt) },
];