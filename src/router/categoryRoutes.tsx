import Spinner from "@/components/Common/Spinner";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
const Fashion = lazy(() => import("@/components/AllCategory/Fashion/Fashion"));
const Furniture = lazy(
  () => import("@/components/AllCategory/Furniture/Furniture")
);
const BookPoetry = lazy(
  () => import("@/components/AllCategory/Books&Poetry/BookPoetry")
);
const HomeDecor = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/HomeDecor")
);
const LocalFood = lazy(
  () => import("@/components/AllCategory/Local&TraditionalFoods/LocalFood")
);
const LocalFoodsDrinks = lazy(
  () =>
    import(
      "@/components/AllCategory/LocalFoodandDrinksProducts/LocalFoodsDrinks"
    )
);
const PlantSeed = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/PlantSeed")
);
const Spices = lazy(
  () => import("@/components/AllCategory/SpicesCondiments&Seasonings/Spices")
);
const Jewelry = lazy(
  () => import("@/components/AllCategory/Jewelry&Gemstones/Jewelry")
);
const Vintage = lazy(
  () => import("@/components/AllCategory/VintageStocks/Vintage")
);
const VintageAntique = lazy(
  () => import("@/components/AllCategory/VintageAntiqueJewelry/VintageAntique")
);
const BeautyWellness = lazy(
  () => import("@/components/AllCategory/Beauty&Wellness/BeautyWellness")
);
const Art = lazy(
  () => import("@/components/AllCategory/Art&Sculptures/ArtPage")
);
const TraditionalOil = lazy(
  () =>
    import(
      "@/components/AllCategory/TraditionalandReligiousItems/TranditionalReligiousItems"
    )
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

// This file loads only when user accesses /categories/*
const CategoryRoutes: RouteObject[] = [
  {
    path: "/fashion",
    element: withSuspense(Fashion),
  },
  {
    path: "/furniture",
    element: withSuspense(Furniture),
  },
  {
    path: "/book-poetry",
    element: withSuspense(BookPoetry),
  },
  {
    path: "/homedecor",
    element: withSuspense(HomeDecor),
  },
  {
    path: "/localfood",
    element: withSuspense(LocalFood),
  },
  {
    path: "/localfooddrinks",
    element: withSuspense(LocalFoodsDrinks),
  },
  {
    path: "/plantseed",
    element: withSuspense(PlantSeed),
  },
  {
    path: "/spices",
    element: withSuspense(Spices),
  },
  {
    path: "/jewelry",
    element: withSuspense(Jewelry),
  },
  {
    path: "/vintage",
    element: withSuspense(Vintage),
  },
  {
    path: "/vintage-jewelry",
    element: withSuspense(VintageAntique),
  },
  {
    path: "/beautywellness",
    element: withSuspense(BeautyWellness),
  },
  {
    path: "/art",
    element: withSuspense(Art),
  },
  {
    path: "/traditional-items",
    element: withSuspense(TraditionalOil),
  },
];

export default CategoryRoutes;
