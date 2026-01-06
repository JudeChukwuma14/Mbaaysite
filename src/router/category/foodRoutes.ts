// src/routes/category/foodRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

// Two main pages you have:
// 1. The newer/more comprehensive one
const LocalFoodsDrinks = lazy(
  () =>
    import(
      "@/components/AllCategory/LocalFoodandDrinksProducts/LocalFoodsDrinks"
    )
);

// 2. The older one (still keep it accessible if needed)
const LocalFood = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/LocalFood")
);

// All 17 subcategories
const CulturallySpecific = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/CulturallySpecific")
);
const EthinicSauces = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/EthinicSauces")
);
const FermentedFood = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/FermentedFood")
);
const FestivalFood = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/FestivalFood")
);
const IndigenousBake = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/IndigenousBake")
);
const LocalBeverages = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/LocalBeverages")
);
const LocalGrains = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/LocalGrains")
);
const MealPlans = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/MealPlans")
);
const PackagedReadyFood = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/PackagedReadyFood")
);
const PickledFood = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/PickledFood")
);
const RegionalEthnicFood = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/RegionalEthnicFood")
);
const SpecialtyGrains = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/SpecialtyGrains")
);
const StapleFoods = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/StapleFoods")
);
const TraditionalOil = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalOil")
);
const TraditionalSnacks = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalSnacks")
);
const TraditionalSoup = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalSoup")
);
const TraditionalSweet = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/subcategory/TraditionalSweet")
);

export const foodRoutes: RouteObject[] = [
  // Main route: /localfooddrinks → newer comprehensive page
  { index: true, element: withSuspense(LocalFoodsDrinks) },

  // Optional: Keep old path accessible (if you still use /localfood somewhere)
  // Remove this if you don't need backward compatibility
  { path: "localfood", element: withSuspense(LocalFood) },

  // All subcategories under /localfooddrinks/...
  { path: "culturallyspecific", element: withSuspense(CulturallySpecific) },
  { path: "EthinicSauces", element: withSuspense(EthinicSauces) },
  { path: "fermentedfood", element: withSuspense(FermentedFood) },
  { path: "festivalfood", element: withSuspense(FestivalFood) },
  { path: "indigenousbake", element: withSuspense(IndigenousBake) },
  { path: "localbeverages", element: withSuspense(LocalBeverages) },
  { path: "localgrains", element: withSuspense(LocalGrains) },
  { path: "mealplans", element: withSuspense(MealPlans) },
  { path: "packagedreadyfood", element: withSuspense(PackagedReadyFood) },
  { path: "pickledfood", element: withSuspense(PickledFood) },
  { path: "regionalethnicfood", element: withSuspense(RegionalEthnicFood) },
  { path: "specialtygrains", element: withSuspense(SpecialtyGrains) },
  { path: "staplefoods", element: withSuspense(StapleFoods) },
  { path: "traditionaloil", element: withSuspense(TraditionalOil) },
  { path: "traditionalsnacks", element: withSuspense(TraditionalSnacks) },
  { path: "traditionalsoup", element: withSuspense(TraditionalSoup) },
  { path: "traditionalsweet", element: withSuspense(TraditionalSweet) },
];