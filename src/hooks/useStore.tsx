import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ProductFeature } from "@/components/admin/FeatureListBuilder";
import { ProductSpecification } from "@/components/admin/SpecificationsBuilder";
import { ProductBenefit } from "@/components/admin/BenefitsBuilder";
import { ProductImage } from "@/components/admin/ImageManager";

// Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  headline?: string;
  description: string;
  categoryId: string;
  images: string[];
  productImages?: ProductImage[];
  price?: number;
  mrp?: number;
  discountedPrice?: number;
  discountPercentage?: number;
  inStock: boolean;
  isFeatured?: boolean;
  features: string[];
  productFeatures?: ProductFeature[];
  specifications?: ProductSpecification[];
  benefits?: ProductBenefit[];
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

interface StoreContextType {
  categories: Category[];
  products: Product[];
  addCategory: (category: Omit<Category, "id" | "createdAt">) => void;
  updateCategory: (id: string, category: Partial<Omit<Category, "id" | "createdAt">>) => void;
  deleteCategory: (id: string) => void;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Partial<Omit<Product, "id" | "createdAt">>) => void;
  deleteProduct: (id: string) => void;
  getProductsByCategory: (categoryId: string) => Product[];
  getCategoryById: (id: string) => Category | undefined;
  getProductById: (id: string) => Product | undefined;
  getCategoryProductCount: (categoryId: string) => number;
}

const STORAGE_KEYS = {
  categories: "cooler_emporium_categories",
  products: "cooler_emporium_products",
};

// Initial seed data
const initialCategories: Category[] = [
  {
    id: "cat_1",
    name: "RO Purifier",
    slug: "ro-purifier",
    description: "Reverse Osmosis water purification systems for clean, safe drinking water",
    icon: "💧",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat_2",
    name: "Cooler",
    slug: "cooler",
    description: "Air cooling solutions for hot climates",
    icon: "❄️",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cat_3",
    name: "Fans",
    slug: "fans",
    description: "Ceiling, table, and pedestal fans",
    icon: "🌀",
    createdAt: new Date().toISOString(),
  },
];

const initialProducts: Product[] = [
  {
    id: "prod_10",
    name: "Havells Albus UV Plus Water Purifier",
    headline: "Pure Water, Healthy Living",
    description: "Transform your drinking water into a source of pure health with advanced 4-stage UV purification and germicidal UV-C protection. Features iProtect monitoring that automatically stops water flow if unsafe, 6L stainless steel tank, and sleek black design. Perfect for modern Indian homes with TDS up to 2000 ppm.",
    categoryId: "cat_1",
    images: ["https://images.unsplash.com/photo-1624958723474-a7eb2a0c2ae0?w=800&auto=format&fit=crop"],
    mrp: 15000,
    discountedPrice: 9900,
    discountPercentage: 34,
    price: 9900,
    inStock: true,
    isFeatured: true,
    features: ["4-Stage RO+UV+UF Purification", "iProtect Safety Monitoring", "6L Stainless Steel Tank", "15L/Hour Flow Rate", "Free Installation & 1-Year Warranty"],
    tags: ["Best Seller", "Limited Offer"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_1",
    name: "AquaPure RO+UV Water Purifier",
    description: "Advanced 7-stage purification with UV sterilization. Perfect for homes with hard water, removes up to 99.9% impurities.",
    categoryId: "cat_1",
    images: ["https://images.unsplash.com/photo-1624958723474-a7eb2a0c2ae0?w=800&auto=format&fit=crop"],
    price: 12999,
    inStock: true,
    features: ["7-Stage Purification", "UV+UF Technology", "12L Storage Tank", "Smart TDS Controller"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_2",
    name: "CrystalClear Compact RO",
    description: "Space-saving design with powerful filtration. Ideal for small kitchens and apartments with built-in mineral enhancer.",
    categoryId: "cat_1",
    images: ["https://images.unsplash.com/photo-1564419320408-38e24e038739?w=800&auto=format&fit=crop"],
    price: 8499,
    inStock: true,
    features: ["5-Stage Filtration", "8L Storage", "Wall Mountable", "Mineral Enhancer"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_3",
    name: "ProPure Commercial RO",
    description: "High-capacity RO system for offices and commercial spaces. 25L/hr purification rate with auto-flush technology.",
    categoryId: "cat_1",
    images: ["https://images.unsplash.com/photo-1585687433636-c1a5a1e98e9f?w=800&auto=format&fit=crop"],
    price: 24999,
    inStock: true,
    features: ["25L/Hr Capacity", "Auto Flush", "TDS Display", "Industrial Grade Filters"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_4",
    name: "Arctic Storm Desert Cooler",
    description: "Powerful desert cooler with honeycomb pads for maximum cooling. Covers up to 500 sq.ft with whisper-quiet operation.",
    categoryId: "cat_2",
    images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop"],
    price: 9999,
    inStock: true,
    features: ["60L Water Tank", "Honeycomb Pads", "4-Way Air Flow", "Auto Water Fill"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_5",
    name: "BreezeMaster Personal Cooler",
    description: "Compact personal cooler perfect for bedrooms. Energy-efficient with ice chamber for extra cooling power.",
    categoryId: "cat_2",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop"],
    price: 4999,
    inStock: true,
    features: ["35L Capacity", "Ice Chamber", "Castor Wheels", "3-Speed Control"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_6",
    name: "CoolBreeze Tower Cooler",
    description: "Sleek tower design cooler with 360° air distribution. Modern aesthetics with powerful cooling performance.",
    categoryId: "cat_2",
    images: ["https://images.unsplash.com/photo-1615874694520-474822394e73?w=800&auto=format&fit=crop"],
    price: 7499,
    inStock: true,
    features: ["360° Air Flow", "Touch Controls", "Remote Included", "Anti-Bacterial Tank"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_7",
    name: "WindFlow Ceiling Fan",
    description: "Premium ceiling fan with aerodynamic blades. Ultra-silent operation with remote control and LED indicator.",
    categoryId: "cat_3",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop"],
    price: 2499,
    inStock: true,
    features: ["1200mm Sweep", "5-Speed Remote", "Energy Star Rated", "Anti-Dust Coating"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_8",
    name: "TurboMax Pedestal Fan",
    description: "Powerful pedestal fan with adjustable height and oscillation. Perfect for living rooms and offices.",
    categoryId: "cat_3",
    images: ["https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800&auto=format&fit=crop"],
    price: 1999,
    inStock: false,
    features: ["Adjustable Height", "Wide Oscillation", "3-Speed Control", "Tilt Adjustable"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_9",
    name: "WhisperQuiet Table Fan",
    description: "Compact table fan with ultra-quiet operation. Perfect for desks and bedside tables.",
    categoryId: "cat_3",
    images: ["https://images.unsplash.com/photo-1541640196167-da92986db4e8?w=800&auto=format&fit=crop"],
    price: 899,
    inStock: true,
    features: ["300mm Blade", "Silent Motor", "Tilt Adjustable", "Compact Design"],
    createdAt: new Date().toISOString(),
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function StoreProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.categories);
    return stored ? JSON.parse(stored) : initialCategories;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.products);
    return stored ? JSON.parse(stored) : initialProducts;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  }, [products]);

  const addCategory = (category: Omit<Category, "id" | "createdAt">) => {
    const newCategory: Category = {
      ...category,
      id: generateId("cat"),
      slug: generateSlug(category.name),
      createdAt: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Omit<Category, "id" | "createdAt">>) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? { ...cat, ...updates, slug: updates.name ? generateSlug(updates.name) : cat.slug }
          : cat
      )
    );
  };

  const deleteCategory = (id: string) => {
    // Move products to uncategorized or delete
    setProducts((prev) =>
      prev.map((prod) => (prod.categoryId === id ? { ...prod, categoryId: "" } : prod))
    );
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: generateId("prod"),
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, "id" | "createdAt">>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates, updatedAt: new Date().toISOString() } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const getProductsByCategory = (categoryId: string) => {
    if (categoryId === "all") return products;
    return products.filter((prod) => prod.categoryId === categoryId);
  };

  const getCategoryById = (id: string) => categories.find((cat) => cat.id === id);

  const getProductById = (id: string) => products.find((prod) => prod.id === id);

  const getCategoryProductCount = (categoryId: string) =>
    products.filter((prod) => prod.categoryId === categoryId).length;

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByCategory,
        getCategoryById,
        getProductById,
        getCategoryProductCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
