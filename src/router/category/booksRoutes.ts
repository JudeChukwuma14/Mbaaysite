// src/routes/category/booksRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

const BookPoetry = lazy(() => import("@/components/AllCategory/Books&Poetry/BookPoetry"));

const CulturalEthnic = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/CulturalEthnic")
);
const TranditionalFolk = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/TranditionalFolk")
);
const Poetry = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/Poetry")
);
const HistoricalNarratives = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/HistoricalNarratives")
);
const SpiritualityReligion = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/SpiritualityReligion")
);
const LanguageLinguistics = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/LanguageLinguistics")
);
const CookbooksCulinaryTradition = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/CookbooksCulinaryTradition")
);
const ArtCraft = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/ArtCraft")
);
const Childrenbook = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/Childrenbook")
);
const TravelExploration = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/TravelExploration")
);
const HealthWellnessBook = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/HealthWellness")
);
const PoliticalSocialIssues = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/PoliticalSocialIssues")
);
const ArtisticCreative = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/ArtisticCreative")
);
const EnvironmentalNature = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/EnvironmentalNature")
);
const InspriationalMotivational = lazy(
  () => import("@/components/AllCategory/Books&Poetry/subcategory/InspriationalMotivational")
);

export const booksRoutes: RouteObject[] = [
  { index: true, element: withSuspense(BookPoetry) }, // /book-poetry → main page

  { path: "cultural-ethnic", element: withSuspense(CulturalEthnic) },
  { path: "traditional-folk", element: withSuspense(TranditionalFolk) },
  { path: "poetry", element: withSuspense(Poetry) },
  { path: "historical-narrative", element: withSuspense(HistoricalNarratives) },
  { path: "spirituality-religion", element: withSuspense(SpiritualityReligion) },
  { path: "language-linguistics", element: withSuspense(LanguageLinguistics) },
  { path: "cookbook", element: withSuspense(CookbooksCulinaryTradition) },
  { path: "art-craft", element: withSuspense(ArtCraft) },
  { path: "children-books", element: withSuspense(Childrenbook) },
  { path: "travel-exploration", element: withSuspense(TravelExploration) },
  { path: "health-wellness-book", element: withSuspense(HealthWellnessBook) },
  { path: "political-social", element: withSuspense(PoliticalSocialIssues) },
  { path: "artistic-writing", element: withSuspense(ArtisticCreative) },
  { path: "environment-nature", element: withSuspense(EnvironmentalNature) },
  { path: "inspirational-book", element: withSuspense(InspriationalMotivational) },
];