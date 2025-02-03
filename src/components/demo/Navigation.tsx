import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import beautyImage from "../../assets/image/Services.png";
import skincareImage from "../../assets/image/abt1.png";
import haircareImage from "../../assets/image/card1.png";
import jewelryImage from "../../assets/image/cat1.png";
import handmadeJewelryImage from "../../assets/image/cat2.png";
import gemstonesImage from "../../assets/image/cat3.png";
import booksImage from "../../assets/image/AppStore.png";
import culturalStudiesImage from "../../assets/image/vendor.png";
import folkLiteratureImage from "../../assets/image/img2.jpg";
import vintageImage from "../../assets/image/img1.jpg";
import antiqueJewelryImage from "../../assets/image/img3.jpg";
import stocksImage from "../../assets/image/abt2.png";
import plantsImage from "../../assets/image/about1.png";
import foodsImage from "../../assets/image/AppStore.png";
import clothingImage from "../../assets/image/Mastercard.png";

export function NavigationMenuDemo() {
  const categories = {
    "Beauty and Wellness": {
      image: beautyImage,
      subcategories: {
        Skincare: {
          image: skincareImage,
          items: [
            "Natural Soaps",
            "Body Butters",
            "Face Masks",
            "Facial Oils and Serums",
            "Scrubs and Exfoliants",
          ],
        },
        Haircare: {
          image: haircareImage,
          items: [
            "Natural Shampoos and Conditioners",
            "Hair Oils and Treatments",
            "Herbal Hair Masks",
            "Combs and Brushes",
            "Scalp Treatments",
          ],
        },
      },
    },
    "Jewelry and Gemstones": {
      image: jewelryImage,
      subcategories: {
        "Handmade Jewelry": {
          image: handmadeJewelryImage,
          items: [
            "Necklaces",
            "Bracelets",
            "Rings",
            "Earrings",
            "Anklets",
            "Brooches & Pins",
            "Custom Jewelry",
          ],
        },
        Gemstones: {
          image: gemstonesImage,
          items: [
            "Precious Gemstones",
            "Semi-precious Gemstones",
            "Raw Gemstones",
            "Cut & Polished Gemstones",
            "Gemstone Beads",
          ],
        },
      },
    },
    "Books and Poetry": {
      image: booksImage,
      subcategories: {
        "Cultural and Ethnic Studies": {
          image: culturalStudiesImage,
          items: [
            "Books on Indigenous Cultures",
            "Ethnographic Studies",
            "African, Asian, and Native American Heritage",
          ],
        },
        "Traditional and Folk Literature": {
          image: folkLiteratureImage,
          items: [
            "Folktales and Myths",
            "Oral Traditions and Storytelling",
            "Epic Poems and Legendary Tales",
          ],
        },
      },
    },
    Vintage: {
      image: vintageImage,
      subcategories: {
        "Antique Jewelry": {
          image: antiqueJewelryImage,
          items: [
            "Vintage Necklaces",
            "Antique Rings",
            "Vintage Brooches",
            "Tribal Earrings",
          ],
        },
      },
    },
    Stocks: {
      image: stocksImage,
      subcategories: {
        "Vintage Stocks": {
          image: stocksImage,
          items: [
            "Vintage Textiles",
            "Vintage Clothing",
            "Vintage Home Decor",
            "Vintage Instruments",
          ],
        },
      },
    },
    "Plants and Seeds": {
      image: plantsImage,
      subcategories: {
        "Indoor Plants": {
          image: plantsImage,
          items: [
            "Succulents",
            "Air Plants",
            "Potted Herbs",
            "Tropical Houseplants",
          ],
        },
      },
    },
    "Local & Traditional Foods": {
      image: foodsImage,
      subcategories: {
        "Staple Foods": {
          image: foodsImage,
          items: ["Rice", "Yam", "Cassava", "Plantain", "Millet", "Maize"],
        },
      },
    },
    "Traditional Clothing and Fabrics": {
      image: clothingImage,
      subcategories: {
        "Men’s Traditional Wear": {
          image: clothingImage,
          items: ["Dashikis", "Boubous", "Kente Cloth", "Sherwanis", "Kimono"],
        },
      },
    },
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {Object.entries(categories).map(([categoryTitle, category]) => (
          <NavigationMenuItem key={categoryTitle}>
            <NavigationMenuTrigger>{categoryTitle}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <img
                        src={category.image}
                        alt={categoryTitle}
                        className="w-full h-24 object-cover rounded-md mb-2"
                      />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {categoryTitle}
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Explore our collection of {categoryTitle.toLowerCase()}.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                {Object.entries(category.subcategories).map(
                  ([subcategoryTitle, subcategory]) => (
                    <ListItem
                      key={subcategoryTitle}
                      href={`/category/${categoryTitle}/${subcategoryTitle}`}
                      title={subcategoryTitle}
                    >
                      {subcategory.items.join(", ")}
                    </ListItem>
                  )
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
