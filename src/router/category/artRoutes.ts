// src/routes/category/artRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

const Art = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/ArtPage")
);

// Art Subcategories
const Paintings = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/subcategory/Paintings")
);
const WallArts = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/subcategory/WallArts")
);
const Sculptures = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/subcategory/Sculptures")
);
const TraditionalCraft = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/subcategory/TraditionalCraft")
);
const ReligiousCulturalArt = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/subcategory/ReligiousCulturalArt")
);

// Special route for individual art profile (dynamic :id)
const ArtProfile = lazy(() => import("@/components/AllCategory/Art/ArtProfile"));

export const artRoutes: RouteObject[] = [
  { index: true, element: withSuspense(Art) }, // /art → main Art & Sculptures page

  { path: "paintings", element: withSuspense(Paintings) },
  { path: "wall-art", element: withSuspense(WallArts) },
  { path: "sculptures", element: withSuspense(Sculptures) },
  { path: "traditional-craft", element: withSuspense(TraditionalCraft) },
  { path: "traditional-artifacts", element: withSuspense(ReligiousCulturalArt) },

  // Dynamic route for individual art profile
  // Example: /art/art-profile/123
  { path: "art-profile/:id", element: withSuspense(ArtProfile) },
];