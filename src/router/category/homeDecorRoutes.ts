// src/routes/category/homeDecorRoutes.ts
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { withSuspense } from "../withSuspense";

const HomeDecor = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/HomeDecor")
);

const TextileFabrics = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/TextileFabrics")
);
const CeramicsPottery = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/CeramicsPottery")
);
const Woodcraft = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/Woodcraft")
);
const Metalwork = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/Metalwork")
);
const BasketsWeaving = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/BasketsWeaving")
);
const Glasswork = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/Glasswork")
);
const Leather = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/LeatherWoods")
);
const BeadedDecor = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/BeadedDecor")
);
const StoneMarble = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/StoneMarble")
);
const HandcraftedKitchenware = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/HandcraftedKitchenware")
);
const WallArt = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/WallArt")
);
const Mirrors = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/Mirrors")
);
const Handwoven = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/HandwovenMatsCarpets")
);
const HandCraftedLamps = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/HandCraftedLamps")
);
const JewelryTrinket = lazy(
  () => import("@/components/AllCategory/HomeDécor&Accessories/subcategory/JewelryTrinket")
);

export const homeDecorRoutes: RouteObject[] = [
  { index: true, element: withSuspense(HomeDecor) }, // /homedecor → main page

  { path: "textiles", element: withSuspense(TextileFabrics) },
  { path: "ceramics-pottery", element: withSuspense(CeramicsPottery) },
  { path: "woodcraft", element: withSuspense(Woodcraft) },
  { path: "metalwork", element: withSuspense(Metalwork) },
  { path: "baskets-weaving", element: withSuspense(BasketsWeaving) },
  { path: "glasswork", element: withSuspense(Glasswork) },
  { path: "leather-woods", element: withSuspense(Leather) },
  { path: "beaded-decor", element: withSuspense(BeadedDecor) },
  { path: "stone-marble", element: withSuspense(StoneMarble) },
  { path: "handcrafted-kitchenware", element: withSuspense(HandcraftedKitchenware) },
  { path: "wall-art", element: withSuspense(WallArt) },
  { path: "mirrors", element: withSuspense(Mirrors) },
  { path: "handwoven", element: withSuspense(Handwoven) },
  { path: "handcrafted", element: withSuspense(HandCraftedLamps) },
  { path: "jewelry-trinket", element: withSuspense(JewelryTrinket) },
];