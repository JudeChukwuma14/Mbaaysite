import { RouteObject } from "react-router-dom";

// Helper to create subcategory routes dynamically
export const createSubcategoryRoute = (
  path: string,
  importPath: string
): RouteObject => ({
  path,
  lazy: () => import(`@/components/AllCategory/${importPath}`),
});


export const fashionSubcategories: RouteObject[] = [
  createSubcategoryRoute("/traditional-fashion", "Fashion/subcategory/TF/TF"),
  createSubcategoryRoute("/men-tf-wear", "Fashion/subcategory/TF/MenWear"),
  createSubcategoryRoute("/women-tf-wear", "Fashion/subcategory/TF/WomenWear"),
  createSubcategoryRoute("/children-tf-wear", "Fashion/subcategory/TF/ChildrenWear"),
  createSubcategoryRoute("/unisex-tf-wear", "Fashion/subcategory/TF/Unsex"),
  createSubcategoryRoute("/modern-traditional", "Fashion/subcategory/MT/MT"),
  // ... add other fashion subcategories
];