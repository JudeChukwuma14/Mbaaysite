// src/routes/category/index.ts
import { RouteObject } from "react-router-dom";

// Direct imports — these files are tiny config, no need for lazy
import { fashionRoutes } from "./fashionRoutes";
import { artRoutes } from "./artRoutes";
import { jewelryRoutes } from "./jewelryRoutes";
import { vintageRoutes } from "./vintageRoutes";
import { beautyRoutes } from "./beautyRoutes";
import { booksRoutes } from "./booksRoutes";
import { homeDecorRoutes } from "./homeDecorRoutes";
import { furnitureRoutes } from "./furnitureRoutes";
import { foodRoutes } from "./foodRoutes";
import { plantsRoutes } from "./plantsRoutes";
import { spicesRoutes } from "./spicesRoutes";
import { traditionalReligiousRoutes } from "./traditionalReligiousRoutes";

export const categoryRoutes: RouteObject[] = [
  { path: "/*", children: fashionRoutes },
  { path: "/*", children: artRoutes },
  { path: "/*", children: jewelryRoutes },
  { path: "/*", children: vintageRoutes },
  { path: "/*", children: beautyRoutes },
  { path: "/*", children: booksRoutes },
  { path: "/*", children: homeDecorRoutes },
  { path: "/*", children: furnitureRoutes },
  { path: "/*", children: foodRoutes },
  { path: "/*", children: plantsRoutes },
  { path: "/*", children: spicesRoutes },
  { path: "/*", children: traditionalReligiousRoutes },
];
