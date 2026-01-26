// src/routes/category/plantsRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

const PlantSeed = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/PlantSeed")
);

// All Plant & Seeds Subcategories
const Plant = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/Plants")
);
const FruitPlants = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/FruitPlants")
);
const Vegetableplants = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/Vegetableplants")
);
const MedicinalPlants = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/MedicinalPlants")
);
const Seed = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/Seed")
);
const HerbSeeds = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/HerbSeeds")
);
const FlowerSeeds = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/FlowerSeeds")
);
const CulturalTraditionalSeed = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/CulturalTraditionalSeed")
);
const PlantingKit = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/PlantingKit")
);
const PlantCareProduct = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/PlantCareProduct")
);
const SeedingSapling = lazy(
  () => import("@/components/AllCategory/Plant&Seeds/subcategory/SeedingSapling")
);

export const plantsRoutes: RouteObject[] = [
  { index: true, element: withSuspense(PlantSeed) }, // /plantseed → main page

  { path: "plant", element: withSuspense(Plant) },
  { path: "fruitplants", element: withSuspense(FruitPlants) },
  { path: "vegetableplants", element: withSuspense(Vegetableplants) },
  { path: "medicinalplants", element: withSuspense(MedicinalPlants) },
  { path: "seed", element: withSuspense(Seed) },
  { path: "herbseeds", element: withSuspense(HerbSeeds) },
  { path: "flowerseeds", element: withSuspense(FlowerSeeds) },
  { path: "culturaltraditionalseed", element: withSuspense(CulturalTraditionalSeed) },
  { path: "plantingkit", element: withSuspense(PlantingKit) },
  { path: "plantcareproduct", element: withSuspense(PlantCareProduct) },
  { path: "seedingsapling", element: withSuspense(SeedingSapling) },
];