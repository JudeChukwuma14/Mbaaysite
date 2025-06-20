import wellness from "@/assets/image/Wellness.jpg";
import jewelry from "@/assets/image/Jewelry.jpg";
import book from "@/assets/image/book.jpg";
import Homedecor from "@/assets/image/Home Décor.jpg";
import Vintage from "@/assets/image/Vintage Furniture.jpg";
import TC from "@/assets/image/TraditionalClothing.jpg";
import LF from "@/assets/image/LocalTraditional.jpg";
import SP from "@/assets/image/SpicesCondiments.jpg";
import PLS from "@/assets/image/PlantSeeds.jpg";

export const categories = [
  {
    name: "Beauty and Wellness",
    image: wellness,
    link: "/beautywellness",
    subcategories: [
      {
        link: "/skincare",
        title: "Skin Care",
        items: [
          "Natural Soaps",
          "Body Butters",
          "Face Masks",
          "Facial Oils and Serums",
          "Scrubs and Exfoliants",
        ],
      },
      {
        link: "/haircare",
        title: "Hair Care",
        items: [
          "Natural Shampoos and Conditioners",
          "Hair Oils and Treatments",
          "Herbal Hair Masks",
          "Combs and Brushes",
          "Scalp Treatments",
        ],
      },
      {
        link: "/bodycare",
        title: "Body Care",
        items: [
          "Herbal Bath Products",
          "Body Lotions and Creams",
          "Deodorants and Antiperspirants",
          "Sunscreens and Sunblocks",
        ],
      },
      {
        link: "/makeup",
        title: "Makeup",
        items: [
          "Natural Foundations and Powders",
          "Lip Balms and Lipsticks",
          "Eye Makeup",
          "Blushes and Bronzers",
        ],
      },
      {
        link: "/fragrances",
        title: "Fragrances",
        items: [
          "Essential Oils",
          "Natural Perfumes",
          "Incense and Smudge Sticks",
          "Scented Candles",
        ],
      },
      {
        link: "/wellnessproduct",
        title: "Wellness Products",
        items: [
          "Herbal Teas",
          "Tinctures and Tonics",
          "Essential Oil Blends",
          "Herbal Supplements",
          "Massage Oils and Balms",
        ],
      },
      {
        link: "/men-grooming",
        title: "Men’s Grooming",
        items: [
          "Beard Oils and Balms",
          "Shaving Creams and Soaps",
          "Aftershaves and Toners",
          "Hair Pomades and Waxes",
          "Body Washes and Scrubs",
        ],
      },
      {
        link: "/badychild-care",
        title: "Baby and Child Care",
        items: [
          "Natural Baby Lotions",
          "Baby Bath Products",
          "Diaper Balms",
          "Baby Oils",
          "Baby Powders",
        ],
      },
      {
        link: "/health-wellness",
        title: "Health and Wellness Kits",
        items: ["Detox Kits", "Spa Kits", "Sleep and Relaxation Kits"],
      },
      {
        link: "/immuity-boost",
        title: "Immunity Boost Kits",
        items: [
          "Sustainable and Eco-Friendly Products",
          "Reusable Makeup Remover Pads",
          "Natural and Biodegradable Packaging",
          "Zero Waste Beauty Kits",
        ],
      },
    ],
  },
  {
    name: "Jewelry and Gemstones",
    image: jewelry,
    link: "/jewelry",
    subcategories: [
      {
        link: "/handmade-jewelry",
        title: "Handmade Jewelry",
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
      {
        link: "/gemstones",
        title: "Gemstones",
        items: [
          "Precious Gemstones",
          "Semi-precious Gemstones",
          "Raw Gemstones",
          "Cut & Polished Gemstones",
          "Gemstone Beads",
        ],
      },
      {
        link: "/jewelry-materials",
        title: "Jewelry Materials",
        items: [
          "Metal Jewelry",
          "Beadwork Jewelry",
          "Wire Jewelry",
          "Leather Jewelry",
          "Wooden Jewelry",
          "Personalized & Custom Orders",
        ],
      },
      {
        link: "/sustainable-jewelry",
        title: "Ethically Sourced & Sustainable Jewelry",
        items: ["Recycled Materials Jewelry", "Conflict-free Gemstones"],
      },
      {
        link: "/men-jewelry",
        title: "Men’s Jewelry",
        items: [
          "Men’s Rings",
          "Men’s Bracelets",
          "Men’s Necklaces",
          "Men’s Earrings",
        ],
      },
      {
        link: "/children-jewelry",
        title: "Children’s Jewelry",
        items: ["Kids’ Necklaces", "Kids’ Bracelets", "Charm Jewelry for Kids"],
      },
      {
        link: "/occasion-jewelry",
        title: "Bridal & Special Occasion Jewelry",
        items: [
          "Engagement Rings",
          "Wedding Bands",
          "Bridal Sets",
          "Prom Jewelry",
          "Anniversary Jewelry",
        ],
      },
      {
        link: "/traditional-jewelry",
        title: "Cultural & Traditional Jewelry",
        items: [
          "African Jewelry",
          "Asian Jewelry",
          "Native/Indigenous Jewelry",
        ],
      },
      {
        link: "/gemstone-jewelry",
        title: "Gemstone Jewelry by Birthstone",
        items: [
          "January (Garnet)",
          "February (Amethyst)",
          "March (Aquamarine)",
          "April (Diamond)",
          "May (Emerald)",
          "June (Pearl, Moonstone)",
          "July (Ruby)",
          "August (Peridot)",
          "September (Sapphire)",
          "October (Opal, Tourmaline)",
          "November (Topaz, Citrine)",
          "December (Turquoise, Zircon)",
        ],
      },
    ],
  },
  {
    name: "Books and Poetry",
    image: book,
    link: "/book-poetry",
    subcategories: [
      {
        link: "/cultural-ethnic",
        title: "Cultural and Ethnic Studies",
        items: [
          "Books on Indigenous Cultures",
          "Ethnographic Studies",
          "African, Asian, and Native American Heritage",
          "Cultural Identity and Diaspora Experiences",
        ],
      },
      {
        link: "/traditional-folk",
        title: "Traditional and Folk Literature",
        items: [
          "Folktales and Myths from Various Regions",
          "Oral Traditions and Story telling",
          "Epic Poems and Legendary Tales",
          "Traditional Proverbs and Sayings",
        ],
      },
      {
        link: "/poetry",
        title: "Poetry",
        items: [
          "Indigenous and Tribal Poetry",
          "Contemporary Poems by Diaspora Writers",
          "Traditional Poetic Forms (Haiku, Ghazal)",
          "Bilingual Poetry Collections",
          "Poetry about Migration and Identity",
        ],
      },
      {
        link: "/historical-narrative",
        title: "Historical Narratives",
        items: [
          "History of Indigenous Peoples",
          "Biographies of Cultural Leaders",
          "Books on Colonial and Post-Colonial History",
          "Migration and Diaspora Stories",
          "Historical Fiction with Cultural Themes",
        ],
      },
      {
        link: "/spirituality-religion",
        title: "Spirituality and Religion",
        items: [
          "Sacred Texts and Commentaries",
          "Books on Traditional Spiritual Practices",
          "Mysticism and Folk Religions",
          "Books on Religious Rituals and Ceremonies",
          "Poetry with Spiritual Themes",
        ],
      },
      {
        link: "/language-linguistics",
        title: "Language and Linguistics",
        items: [
          "Books on Endangered Languages",
          "Indigenous Language Learning Materials",
          "Bilingual and Multilingual Literature",
          "Studies on Dialects and Regional Languages",
        ],
      },
      {
        link: "/cookbook",
        title: "Cookbooks and Culinary Traditions",
        items: [
          "Traditional Recipes from Various Cultures",
          "Books on Indigenous Ingredients",
          "Culinary Histories and Food Cultures",
          "Cultural Significance of Food in Diaspora Communities",
          "Poetry about Food and Eating",
        ],
      },
      {
        link: "/art-craft",
        title: "Art and Craft",
        items: [
          "Traditional Handicrafts and Techniques",
          "Indigenous Art Forms",
          "Textile and Fabric Art Books",
          "Books on Pottery, Weaving, and Embroidery",
        ],
      },
      {
        link: "/children-books",
        title: "Children’s Books",
        items: [
          "Bilingual Storybooks",
          "Folktales and Legends for Children",
          "Cultural Identity Books for Kids",
          "Illustrated Books on Traditional Stories",
          "Poetry Collections for Children",
        ],
      },
      {
        link: "/travel-exploration",
        title: "Travel and Exploration",
        items: [
          "Travel Guides to Indigenous and Remote Regions",
          "Ethnographic Travel Narratives",
          "Books on Cultural Etiquette and Traditions",
          "Adventure and Exploration Stories from Home Countries",
        ],
      },
      {
        link: "/health-wellness-book",
        title: "Health and Wellness",
        items: [
          "Books on Traditional Healing Practices",
          "Indigenous Herbal Medicine",
          "Yoga and Meditation Guides from Cultural Perspectives",
          "Wellness Poetry and Spiritual Healing",
        ],
      },
      {
        link: "/political-social",
        title: "Political and Social Issues",
        items: [
          "Books on Indigenous Rights and Social Justice",
          "Studies on Migration and Displacement",
          "Books on Identity Politics and Ethnic Studies",
          "Poetry Addressing Social Issues and Activism",
        ],
      },
      {
        link: "/artistic-writing",
        title: "Artistic and Creative Writing",
        items: [
          "Anthologies of Short Stories and Essays",
          "Experimental and Avant-garde Poetry",
          "Books on Creative Writing with Cultural Themes",
          "Books on the Craft of Writing Poetry",
        ],
      },
      {
        link: "/environment-nature",
        title: "Environmental and Nature Studies",
        items: [
          "Indigenous Environmental Practices and Sustainability",
          "Books on Traditional Agriculture",
          "Poetry Celebrating Nature and the Environment",
          "Studies on Sacred Landscapes and Biodiversity",
        ],
      },
      {
        link: "/inspirational-book",
        title: "Inspirational and Motivational Books",
        items: [
          "Stories of Resilience and Overcoming Challenges",
          "Books on Empowerment from Cultural Perspectives",
          "Motivational Poetry and Speeches",
          "Wisdom Literature and Ethical Teachings",
        ],
      },
    ],
  },
  {
    name: "Home Décor and Accessories",
    image: Homedecor,
    link: "/homedecor",
    subcategories: [
      {
        link: "/textiles",
        title: "Textiles and Fabrics",
        items: [
          "Handwoven Rugs (Kilim, Dhurrie)",
          "Embroidered Cushion Covers",
          "Hand-dyed Batik Throws",
          "Traditional Quilts",
          "Handwoven Blankets and Shawls",
        ],
      },
      {
        link: "/ceramics-pottery",
        title: "Ceramics and Pottery",
        items: [
          "Hand-painted Ceramic Bowls",
          "Earthenware Vases",
          "Traditional Clay Cooking Pots",
          "Decorative Terracotta Planters",
          "Handcrafted Ceramic Tableware",
        ],
      },
      {
        link: "/woodcraft",
        title: "Wood Craft",
        items: [
          "Hand-carved Wooden Bowls",
          "Traditional Wooden Masks",
          "Ornate Wooden Wall Art",
          "Handcrafted Wooden Furniture (stools, side tables)",
          "Wooden Picture Frames",
        ],
      },
      {
        link: "/metalwork",
        title: "Metalwork",
        items: [
          "Hand-forged Iron Candle Holders",
          "Copper and Brass Wall Hangings",
          "Metal Trays with Intricate Designs",
          "Handcrafted Lanterns",
          "Sculpted Metal Figurines",
        ],
      },
      {
        link: "/baskets-weaving",
        title: "Baskets and Weaving",
        items: [
          "Handwoven Storage Baskets",
          "Decorative Wicker Baskets",
          "Palm Leaf Trays",
          "Woven Wall Art",
          "Traditional Market Baskets",
        ],
      },
      {
        link: "/glasswork",
        title: "Glasswork",
        items: [
          "Blown Glass Vases",
          "Stained Glass Window Hangings",
          "Glass Bead Curtains",
          "Mosaic Glass Bowls",
          "Handcrafted Glass Candle Holders",
        ],
      },
      {
        link: "/leather-woods",
        title: "Leather Woods",
        items: [
          "Hand-stitched Leather Poufs",
          "Leather Wall Hangings",
          "Decorative Leather Storage Boxes",
          "Handcrafted Leather Coasters",
          "Leather-bound Journals",
        ],
      },
      {
        link: "/beaded-decor",
        title: "Beaded Decor",
        items: [
          "Beaded Wall Hangings",
          "Beaded Coasters",
          "Beaded Table Runners",
          "Decorative Beaded Mirrors",
          "Handcrafted Beaded Lampshades",
        ],
      },
      {
        link: "/stone-marble",
        title: "Stone and Marble Crafts",
        items: [
          "Hand-carved Marble Coasters",
          "Stone Sculptures",
          "Marble Candle Holders",
          "Stone Planters",
          "Decorative Stone Tiles",
        ],
      },
      {
        link: "/handcrafted",
        title: "Handcrafted Lamps and Lighting",
        items: [
          "Bamboo and Rattan Lampshades",
          "Handwoven Lanterns",
          "Beaded Chandeliers",
          "Ceramic Table Lamps",
          "Wooden Floor Lamps",
        ],
      },
      {
        link: "/wall-art",
        title: "Wall Art",
        items: [
          "Tapestries with Traditional Motifs",
          "Hand-painted Murals on Canvas",
          "Tribal Masks and Shields",
          "Wooden Wall Panels",
          "Metal Wall Sculptures",
        ],
      },
      {
        link: "/jewelry-trinket",
        title: "Jewelry and Trinket Boxes",
        items: [
          "Hand-carved Wooden Jewelry Boxes",
          "Decorative Ceramic Trinket Dishes",
          "Beaded Jewelry Organizers",
          "Hand-painted Keepsake Boxes",
          "Embroidered Fabric Jewelry Rolls",
        ],
      },
      {
        link: "/mirrors",
        title: "Mirrors",
        items: [
          "Hand-carved Wooden Mirrors",
          "Decorative Metal Mirrors",
          "Mosaic Mirrors",
          "Beaded Frame Mirrors",
          "Embossed Leather Mirrors",
        ],
      },
      {
        link: "/handwoven",
        title: "Handwoven Mats and Carpets",
        items: [
          "Sisal Mats",
          "Wool Rugs with Ethnic Patterns",
          "Cotton Dhurries",
          "Bamboo Mats",
          "Silk Carpets",
        ],
      },
      {
        link: "/handcrafted-kitchenware",
        title: "Handcrafted Kitchenware",
        items: [
          "Wooden Serving Trays",
          "Hand-thrown Clay Pots",
          "Carved Wooden Utensils",
          "Handwoven Table Mats",
          "Ceramic Mugs and Cups",
        ],
      },
    ],
  },
  {
    name: "Vintage Stocks",
    image: Vintage,
    link: "/vintage",
    subcategories: [
      {
        link: "/vintagetextiles",
        title: "Vintage Textiles and Fabrics",
        items: [
          "Handwoven Kente Cloth",
          "Vintage Ikat Fabrics",
          "Traditional Batik Prints",
          "Hand-embroidered Shawls",
          "Vintage Kilim Rugs",
        ],
      },
      {
        link: "/Vintage-Clothing",
        title: "Vintage Clothing",
        items: [
          "Traditional Kimonos",
          "African Dashikis",
          "Indian Sarees",
          "Middle Eastern Kaftans",
          "Vintage Ponchos",
        ],
      },
      {
        link: "/Vintage-Home",
        title: "Vintage Home Decor",
        items: [
          "Hand-carved Wooden Masks",
          "Antique Ceramics and Pottery",
          "Vintage Woven Baskets",
          "Ethnic Wall Hangings",
          "Vintage Brass Candle Holders",
        ],
      },
      {
        link: "/Vintage-Instruments",
        title: "Vintage Instruments",
        items: [
          "African Djembe Drums",
          "Indian Sitars",
          "Middle Eastern Ouds",
          "Asian Bamboo Flutes",
          "Native American Flutes",
        ],
      },
      {
        link: "/Vintage-Art",
        title: "Vintage Art",
        items: [
          "Hand-painted Miniatures",
          "Traditional Tapestries",
          "Vintage Tribal Artworks",
          "Ethnic Paintings",
          "Indigenous Sculptures",
        ],
      },
      {
        link: "/Vintage-Furniture",
        title: "Vintage Furniture",
        items: [
          "Handcrafted Wooden Chests",
          "Vintage Wicker Chairs",
          "Antique Wooden Benches",
          "Traditional Stools",
          "Hand-carved Coffee Tables",
        ],
      },
      {
        link: "/Vintage-Handicrafts",
        title: "Vintage Handicrafts",
        items: [
          "Woven Dreamcatchers",
          "Hand-carved Totem Poles",
          "Traditional Puppets",
          "Vintage Clay Figurines",
          "Hand-painted Gourds",
        ],
      },
      {
        link: "/Vintage-Religious",
        title: "Vintage Religious and Spiritual Items",
        items: [
          "Antique Prayer Beads",
          "Vintage Incense Burners",
          "Old Religious Icons",
          "Vintage Crosses and Crucifixes",
          "Sacred Text Reproductions",
        ],
      },
      {
        link: "/Vintage-Storage",
        title: "Vintage Storage",
        items: [
          "Handcrafted Wooden Trunks",
          "Vintage Leather Bags",
          "Antique Jewelry Boxes",
          "Handwoven Baskets",
          "Vintage Ceramic Jars",
        ],
      },
    ],
  },
  {
    name: "Plant and Seeds",
    image: PLS,
    link: "/plantseed",
    subcategories: [
      {
        link: "/plant",
        title: "Plants",
        items: [
          "Indoor Plants",
          "Succulents",
          "Air Plants",
          "Potted Herbs",
          "Tropical Houseplants",
          "Outdoor Plants",
          "Perennials",
          "Shrubs and Bushes",
          "Climbing Plants",
          "Garden Flowers",
        ],
      },
      {
        link: "/FruitPlants",
        title: "Fruit Plants",
        items: [
          "Citrus Trees",
          "Berry Bushes",
          "Exotic Fruits",
          "Grafted Fruit Plants",
        ],
      },
      {
        link: "/Vegetableplants",
        title: "Vegetable Plants",
        items: [
          "Tomato Plants",
          "Pepper Plants",
          "Leafy Greens",
          "Root Vegetables",
        ],
      },
      {
        link: "/MedicinalPlants",
        title: "Medicinal Plants",
        items: ["Aloe Vera", "Neem", "Holy Basil (Tulsi)", "Echinacea"],
      },
      {
        link: "/seed",
        title: "Seeds",
        items: [
          "Vegetable Seeds",
          "Leafy Greens",
          "Root Vegetables",
          "Heirloom Varieties",
          "Rare and Exotic Vegetables",
          "Fruit Seeds",
          "Melons and Gourds",
          "Berries",
          "Exotic Fruits",
          "Citrus Seeds",
        ],
      },
      {
        link: "/HerbSeeds",
        title: "Herb Seeds",
        items: [
          "Culinary Herbs (Basil, Thyme)",
          "Medicinal Herbs (Moringa, Ashwagandha)",
          "Aromatic Herbs (Lemongrass, Mint)",
        ],
      },
      {
        link: "/FlowerSeeds",
        title: "Flower Seeds",
        items: [
          "Annual Flowers",
          "Perennial Flowers",
          "Edible Flowers",
          "Wildflowers",
        ],
      },
      {
        link: "/CulturalTraditionalSeed",
        title: "Cultural and Traditional Seeds",
        items: [
          "Indigenous Crop Seeds (Millet, Sorghum)",
          "Heritage Seeds",
          "Ceremonial and Ritual Seeds",
        ],
      },
      {
        link: "/SeedingSapling",
        title: "Seedlings and Saplings",
        items: [
          "Tree Saplings",
          "Native Trees",
          "Fruit Tree Saplings",
          "Shade Trees",
          "Herb Seedlings",
          "Culinary Herb Seedlings",
          "Medicinal Herb Seedlings",
          "Vegetable Seedlings",
          "Starter Plants",
          "Grafted Vegetables",
          "Flower Seedlings",
          "Wildflower Seedlings",
          "Ornamental Flower Seedlings",
        ],
      },
      {
        link: "/PlantingKit",
        title: "Planting Kits and Tools",
        items: [
          "Seed Starter Kits",
          "Herb Growing Kits",
          "Vegetable Garden Kits",
          "Indoor Garden Kits",
          "Planting Tools",
          "Hand Tools",
          "Planters and Pots",
          "Soil and Fertilizers",
        ],
      },
      {
        link: "/PlantCareProduct",
        title: "Plant Care Products",
        items: [
          "Soil Mixes",
          "Organic Soil Mixes",
          "Specialized Soil (Cactus Soil)",
          "Fertilizers and Nutrients",
          "Organic Fertilizers",
          "Specialty Plant Nutrients",
          "Pest Control",
          "Natural Pest Control Products",
          "Companion Plants for Pest Control",
        ],
      },
    ],
  },
  {
    name: "Spices, Condiments, and Seasonings",
    image: SP,
    link: "/spices",
    subcategories: [
      {
        link: "/Spices-i",
        title: "Spices",
        items: [
          "Whole Spices (Ungrounded Spice)",
          "Ground Spices (Powdery Form)",
          "Spice Blends & Mixes (Curry Powder, Garam Masala, Chili Powder)",
          "Specialty & Exotic Spices (Saffron, Sumac, Za’atar, Star Anise)",
          "Organic Spices (Certified Organic Options)",
          "Dried Herbs (Oregano, Thyme, Basil, Rosemary)",
        ],
      },
      {
        link: "/Conditments",
        title: "Condiments",
        items: [
          "Sauces (Hot Sauces, Soy Sauce, Barbecue Sauce)",
          "Vinegars & Cooking Wines (Apple Cider Vinegar, Balsamic Vinegar, Rice Wine Vinegar)",
          "Mustards & Ketchups (Dijon Mustard, Whole Grain Mustard, Organic Ketchup)",
          "Relishes & Pickles (Mango Pickle, Dill Pickles, Sweet Relish)",
          "Chutneys & Preserves (Mango Chutney, Tamarind Chutney)",
          "Honey & Syrups (Local Honey, Maple Syrup, Agave Syrup)",
        ],
      },
      {
        link: "/CulturalRegional",
        title: "Cultural & Regional Spices",
        items: [
          "African Spices (Berbere, Ras el Hanout, Suya Spice)",
          "Asian Spices (Chinese Five Spice, Indian Masalas, Japanese Shichimi)",
          "Middle Eastern Spices (Baharat, Dukkah, Za’atar)",
          "Latin American Spices (Achiote, Ancho Chili Powder, Adobo Seasoning)",
          "European Spices (Italian Herbs, Herbes de Provence, Smoked Paprika)",
        ],
      },
      {
        link: "/SaltPepper",
        title: "Salt & Pepper Varieties",
        items: [
          "Artisan Salts (Himalayan Pink Salt, Black Lava Salt, Fleur de Sel)",
          "Pepper Varieties (Black Pepper, White Pepper, Sichuan Peppercorns)",
          "Smoked Salts & Peppers (Smoked Sea Salt, Smoked Paprika)",
        ],
      },
      {
        link: "/Marinades",
        title: "Marinades & Rubs",
        items: [
          "Meat Rubs (Barbecue Rubs, Cajun Rubs, Jerk Seasoning)",
          "Fish & Seafood Marinades (Lemon & Herb Marinades, Creole Seasoning)",
          "Vegetable & Vegan Marinades (Tandoori Marinades, Harissa Paste)",
        ],
      },
      {
        link: "/HealthWellnessSpices",
        title: "Health & Wellness Spices",
        items: [
          "Ayurvedic Spices (Turmeric, Ashwagandha, Ginger)",
          "Herbal Supplements (Moringa, Holy Basil)",
          "Medicinal Blends (Golden Milk Blends, Herbal Teas)",
        ],
      },
      {
        link: "/SpiceKits",
        title: "Spice Kits & Gift Sets",
        items: [
          "Regional Spice Kits (Indian Cooking Spice Kits, Mediterranean Spice Kits)",
          "Gift Sets (Gourmet Spice Gift Sets, Hot Sauce Gift Packs)",
        ],
      },
      {
        link: "/CookingIngredients",
        title: "Cooking Ingredients",
        items: [
          "Flavor Extracts (Vanilla Extract, Almond Extract)",
          "Oils & Fats (Olive Oil, Coconut Oil, Ghee)",
          "Baking Ingredients (Baking Soda, Baking Powder, Yeast)",
        ],
      },
      {
        link: "/EthincallySourced",
        title: "Ethically Sourced & Organic Products",
        items: [
          "Fair Trade Spices",
          "Organic Condiments",
          "Locally Sourced Spices & Herbs",
        ],
      },
      {
        link: "/Seasoning",
        title: "Seasoning for Specific Cuisines",
        items: [
          "Indian Seasoning",
          "Mediterranean Seasoning",
          "Mexican Seasoning",
          "Asian Seasoning",
        ],
      },
      {
        link: "/SpecialDietary",
        title: "Special Dietary",
        items: [
          "Gluten-free Spices",
          "Vegan Condiments",
          "Sugar-free Sauces",
          "Low-Sodium Spices",
        ],
      },
      {
        link: "/PopularUses",
        title: "Popular Uses",
        items: [
          "For Grilling & Barbecue",
          "For Baking & Desserts",
          "For Soups & Stews",
          "Salad Dressings & Dips",
        ],
      },
    ],
  },
  {
    name: "Local & Traditional Foods",
    image: LF,
    link: "/localfood",
    subcategories: [
      {
        link: "/StapleFoods",
        title: "Staple Foods",
        items: ["Rice", "Yam", "Cassava", "Plantain", "Millet", "Maize"],
      },
      {
        link: "/SpecialtyGrains",
        title: "Specialty Grains & Legumes",
        items: ["Fonio", "Sorghum", "Teff", "Bambara Beans", "Cowpeas"],
      },
      {
        link: "/TraditionalSnacks",
        title: "Traditional Snacks & Street Foods",
        items: ["Puff-puff", "Samosas", "Empanadas", "Mandazi"],
      },
      {
        link: "/IndigenousBake",
        title: "Indigenous Baked Goods",
        items: ["Flatbreads", "Cornbread", "Meat Pies", "Johnny Cakes"],
      },
      {
        link: "/TraditionalSoup",
        title: "Traditional Soups & Stews",
        items: ["Groundnut Soup", "Egusi Soup", "Gumbo", "Bouillabaisse"],
      },
      {
        link: "/FermentedFood",
        title: "Fermented & Preserved Foods",
        items: ["Sauerkraut", "Kimchi", "Fermented Fish", "Pickled Vegetables"],
      },
      {
        link: "/LocalBeverages",
        title: "Local Beverages",
        items: [
          "Non-Alcoholic Drinks (Hibiscus Tea (Zobo, Bissap), Tamarind Juice, Ginger Beer, Palm Wine)",
          "Alcoholic Beverages (Local Spirits, Mead, Tequila, Aguardiente, Sake)",
          "Herbal & Medicinal Teas (Moringa Tea, Rooibos, Bitter Leaf Tea)",
          "Coffee & Cocoa Products (Ethiopian Coffee, Ghanaian Cocoa, Jamaican Blue Mountain Coffee)",
          "Specialty Milk & Dairy Products (Local Goat Milk, Camel Milk, Yogurt Drinks)",
        ],
      },
      {
        link: "/RegionalEthnicFood",
        title: "Regional & Ethnic Foods",
        items: [
          "African Cuisine (Jollof Rice, Injera, Ugali, Bobotie)",
          "Caribbean Cuisine (Ackee & Saltfish, Jerk Chicken, Doubles)",
          "Latin American Cuisine (Arepas, Tacos, Pupusas, Tamales)",
          "Middle Eastern Cuisine (Hummus, Falafel, Manakeesh, Koshari)",
          "Asian Cuisine (Kimchi, Nasi Goreng, Laksa, Adobo)",
          "European Cuisine (Pierogi, Moussaka, Paella, Black Pudding)",
        ],
      },
      {
        link: "/EthinicSauces",
        title: "Ethnic Sauces, Spices & Seasonings",
        items: [
          "Local Hot Sauces (Scotch Bonnet Sauce, Harissa, Piri-Piri)",
          "Traditional Seasoning Mixes (Suya Spice, Curry Powder, Adobo Seasoning)",
          "Indigenous Spice Blends (Berbere, Cajun Seasoning, Ras el Hanout)",
          "Ethnic Condiments (Chutney, Fish Sauce, Ghee, Sour Cream)",
        ],
      },
      {
        link: "/CulturallySpecific",
        title: "Culturally Specific Food Categories",
        items: [
          "Kosher Foods",
          "Halal Foods",
          "Vegan & Vegetarian Options",
          "Gluten-Free Traditional Foods",
          "Organic & Ethically Sourced Products (Fair Trade Cocoa, Locally Harvested Grains)",
        ],
      },
      {
        link: "/TraditionalSweet",
        title: "Traditional Sweets & Desserts",
        items: [
          "Ethnic Desserts (Turkish Delight, Baklava, Kulfi, Cassava Cake)",
          "Indigenous Candies & Treats (Coconut Sweets, Tamarind Candy, Plantain Chips)",
          "Specialty Chocolate & Cocoa Products (Dark Chocolate Bars, Cocoa Nibs, Artisanal Chocolates)",
        ],
      },
      {
        link: "/PackagedReadyFood",
        title: "Packaged & Ready-to-Eat Foods",
        items: [
          "Ready-to-Eat Traditional Meals (Canned Jollof Rice, Packaged Tacos, Frozen Samosas)",
          "Pre-Packaged Snacks (Roasted Peanuts, Cassava Chips, Dried Mango)",
          "Meal Kits for Traditional Dishes (Jerk Chicken Kit, Fufu & Soup Kit, Tandoori Chicken Kit)",
        ],
      },
      {
        link: "/TraditionalOil",
        title: "Traditional Oils & Fats",
        items: [
          "Coconut Oil",
          "Palm Oil",
          "Groundnut Oil",
          "Ghee & Clarified Butter",
          "Olive Oil & Specialty Oils",
        ],
      },
      {
        link: "/LocalGrains",
        title: "Local Grains & Flours",
        items: [
          "Cassava Flour",
          "Yam Flour",
          "Plantain Flour",
          "Cornmeal & Maize Flour",
          "Millet Flour & Other Traditional Grains",
        ],
      },
      {
        link: "/PickledFood",
        title: "Fermented & Pickled Foods",
        items: [
          "Pickled Vegetables & Fruits (Pickled Mango, Pickled Peppers)",
          "Fermented Fish & Seafood (Salt Fish, Fermented Shrimp)",
          "Sauerkraut & Kimchi (Local variations of fermented dishes)",
        ],
      },
      {
        link: "/FestivalFood",
        title: "Cultural Holiday & Festival Foods",
        items: [
          "Special Holiday Meals (Thanksgiving Turkey, Eid Lamb, Christmas Ham)",
          "Festival Foods (Diwali Sweets, Ramadan Desserts, Lunar New Year Rice Cakes)",
          "Religious & Cultural Feasts (Passover Foods, Christmas Pudding, Carnival Treats)",
        ],
      },
      {
        link: "/MealPlans",
        title: "Meal Plans & Subscription Boxes",
        items: [
          "Diaspora Food Subscription Boxes (African Food Box, Caribbean Meal Box, Asian Cuisine Box)",
          "Monthly Traditional Snack Subscription (Global Snack Box, Heritage Treats Box)",
        ],
      },
    ],
  },
  {
    name: "Fashion Clothing & Fabrics",
    image: TC,
    link: "/traditional-fashion",
    subcategories: [
      {
        link: "/traditional-clothing",
        title: "Traditional Clothing",
        items: [
          { title: "Men’s Traditional Wear", items: ["Dashikis", "Agbada, Buba & Sokoto", "Boubous", "Kente Cloth Attire", "Sherwanis", "Kimono"] },
          { title: "Women’s Traditional Wear", items: ["Kaftans", "Kanga", "Sari", "Abaya", "Gele", "Kimono"] },
          { title: "Children’s Traditional Wear", items: ["Cultural Dresses", "Mini Dashikis", "Cheongsam", "Traditional Girls' and Boys’ Wear"] },
          { title: "Unisex Traditional Wear", items: ["Sarongs", "Robes", "Ponchos", "Caftans"] },
        ],
      },
      {
        link: "/modern-traditional",
        title: "Modern Clothing with Traditional Influence",
        items: [
          { title: "Contemporary African Fashion", items: ["Ankara Dresses", "Kente-Inspired Styles", "Batik Print Designs"] },
          { title: "Ethnic-Inspired Urban Wear", items: ["Modern Kimonos", "Fusion Kurtas", "Maasai Beadwork-Inspired Outfits"] },
          { title: "Fusion Clothing", items: ["Indo-Western Outfits", "Afro-Western Styles"] },
          { title: "Custom-Made Ethnic Fashion", items: ["Tailored Kitenge", "Custom Embroidered Kaftans"] },
        ],
      },
      {
        link: "/footwear",
        title: "Footwear & Shoes",
        items: [
          { title: "Traditional Shoes & Sandals", items: ["Maasai Sandals", "Babouches", "Mojaris", "Espadrilles"] },
          { title: "Leather & Handmade Shoes", items: ["Handcrafted Leather Shoes", "Moccasins", "Traditional Slippers"] },
          { title: "Modern Shoes with Cultural Designs", items: ["African Print Sneakers", "Embroidered Flats"] },
          { title: "Custom Shoes & Sandals", items: ["Ethnic-Inspired Footwear", "Made-to-Order Traditional Sandals"] },
        ],
      },
      {
        link: "/accessories",
        title: "Cultural Accessories & Adornments",
        items: [
          { title: "Headwear & Scarves", items: ["Turbans", "Head Wraps", "Geles", "Kufi Caps", "Hijabs"] },
          { title: "Belts & Sashes", items: ["Kente Sashes", "Obi Belts", "Traditional Leather Belts"] },
          { title: "Jewelry & Adornments", items: ["Beaded Necklaces", "Waist Beads", "Tribal Earrings"] },
          { title: "Bags & Pouches", items: ["Handmade Leather Bags", "Beaded Clutches", "Cultural Tote Bags"] },
        ],
      },
      {
        link: "/fabrics",
        title: "Fabrics & Textiles",
        items: [
          { title: "Handwoven & Local Fabrics", items: ["Kente Cloth", "Batik", "Adire", "Shweshwe"] },
          { title: "Printed Fabrics", items: ["Ankara", "Wax Prints", "African Prints", "Ikat"] },
          { title: "Embroidered & Handmade Textiles", items: ["Aso-Oke", "Kantha Stitch", "Brocade"] },
          { title: "Natural & Organic Fabrics", items: ["Cotton", "Silk", "Wool", "Linen"] },
        ],
      },
      {
        link: "/occasion-footwear",
        title: "Cultural Footwear for Specific Occasions",
        items: [
          { title: "Wedding Footwear", items: ["Bridal Slippers", "Beaded Sandals", "Embroidered Wedding Shoes"] },
          { title: "Festival & Ceremony Footwear", items: ["Festival Sandals", "Special Occasion Moccasins"] },
          { title: "Casual Ethnic Footwear", items: ["Beaded Flip-Flops", "Everyday Traditional Sandals"] },
        ],
      },
      {
        link: "/festival-clothing",
        title: "Cultural & Festival Clothing",
        items: [
          { title: "Wedding Attire", items: ["Traditional Wedding Dresses", "Groom’s Outfits", "Wedding Kente Styles"] },
          { title: "Festival & Ceremony Outfits", items: ["Eid Outfits", "Diwali Sarees", "Traditional New Year Costumes"] },
          { title: "Religious Clothing", items: ["Traditional Muslim Attire", "Hindu Wedding Saris", "Christian Choir Robes"] },
        ],
      },
      {
        link: "/bespoke",
        title: "Bespoke & Tailored Clothing",
        items: [
          "Custom Tailored Traditional Wear",
          "Tailor-made Sherwanis",
          "Made-to-Measure Dashikis",
          "Custom Gele",
          "Handcrafted Cultural Shoes",
        ],
      },
      {
        link: "/sustainable",
        title: "Sustainable & Ethical Fashion",
        items: [
          "Eco-friendly Clothing",
          "Organic Cotton Outfits",
          "Recycled Fabrics",
          "Fair Trade Shoes & Apparel",
          "Handwoven Sustainable Fabrics",
        ],
      },
      {
        link: "/embroidery",
        title: "Traditional Embroidery & Design Work",
        items: [
          "Hand-Embroidered Clothing (Zardozi, Chikankari, Maasai Beadwork)",
          "Block Printing & Hand-Painted Designs (Batik, Tie-Dye, Kalamkari)",
          "Beadwork & Embellishments (Beaded Necklines, Footwear Embellishments)",
        ],
      },
      {
        link: "/regional-fashion",
        title: "Fashion by Culture & Region",
        items: [
          { title: "African Fashion", items: ["South African Shweshwe", "Nigerian Aso-Oke", "Moroccan Caftans"] },
          { title: "Asian Fashion", items: ["Indian Lehenga", "Japanese Yukata", "Chinese Qipao"] },
          { title: "Middle Eastern Fashion", items: ["Kaftans", "Abayas", "Thobes"] },
          { title: "Latin American Fashion", items: ["Peruvian Ponchos", "Mexican Huipils", "Guatemalan Weavings"] },
          { title: "Caribbean Fashion", items: ["Carnival Costumes", "Rastafarian Clothing", "Dominican Linen Outfits"] },
        ],
      },
      {
        link: "/seasonal-fashion",
        title: "Seasonal & Special Occasion Fashion",
        items: [
          { title: "Summer Ethnic Wear", items: ["Lightweight Caftans", "Cotton Sarongs"] },
          { title: "Winter Ethnic Wear", items: ["Woolen Ponchos", "Knitted Shawls", "Traditional Wool Slippers"] },
        ],
      },
    ],
  }
];
