export interface Product {
  id: string;
  name: string;
  description: string;
  category: "ro-purifier" | "cooler" | "fans";
  image: string;
  price?: number;
  inStock: boolean;
  features: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "AquaPure RO+UV Water Purifier",
    description: "Advanced 7-stage purification with UV sterilization. Perfect for homes with hard water, removes up to 99.9% impurities.",
    category: "ro-purifier",
    image: "https://images.unsplash.com/photo-1624958723474-a7eb2a0c2ae0?w=800&auto=format&fit=crop",
    price: 12999,
    inStock: true,
    features: ["7-Stage Purification", "UV+UF Technology", "12L Storage Tank", "Smart TDS Controller"]
  },
  {
    id: "2",
    name: "CrystalClear Compact RO",
    description: "Space-saving design with powerful filtration. Ideal for small kitchens and apartments with built-in mineral enhancer.",
    category: "ro-purifier",
    image: "https://images.unsplash.com/photo-1564419320408-38e24e038739?w=800&auto=format&fit=crop",
    price: 8499,
    inStock: true,
    features: ["5-Stage Filtration", "8L Storage", "Wall Mountable", "Mineral Enhancer"]
  },
  {
    id: "3",
    name: "Arctic Storm Desert Cooler",
    description: "Powerful desert cooler with honeycomb pads for maximum cooling. Covers up to 500 sq.ft with whisper-quiet operation.",
    category: "cooler",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop",
    price: 9999,
    inStock: true,
    features: ["60L Water Tank", "Honeycomb Pads", "4-Way Air Flow", "Auto Water Fill"]
  },
  {
    id: "4",
    name: "BreezeMaster Personal Cooler",
    description: "Compact personal cooler perfect for bedrooms. Energy-efficient with ice chamber for extra cooling power.",
    category: "cooler",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
    price: 4999,
    inStock: true,
    features: ["35L Capacity", "Ice Chamber", "Castor Wheels", "3-Speed Control"]
  },
  {
    id: "5",
    name: "WindFlow Ceiling Fan",
    description: "Premium ceiling fan with aerodynamic blades. Ultra-silent operation with remote control and LED indicator.",
    category: "fans",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    price: 2499,
    inStock: true,
    features: ["1200mm Sweep", "5-Speed Remote", "Energy Star Rated", "Anti-Dust Coating"]
  },
  {
    id: "6",
    name: "TurboMax Pedestal Fan",
    description: "Powerful pedestal fan with adjustable height and oscillation. Perfect for living rooms and offices.",
    category: "fans",
    image: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800&auto=format&fit=crop",
    price: 1999,
    inStock: false,
    features: ["Adjustable Height", "Wide Oscillation", "3-Speed Control", "Tilt Adjustable"]
  },
  {
    id: "7",
    name: "ProPure Commercial RO",
    description: "High-capacity RO system for offices and commercial spaces. 25L/hr purification rate with auto-flush technology.",
    category: "ro-purifier",
    image: "https://images.unsplash.com/photo-1585687433636-c1a5a1e98e9f?w=800&auto=format&fit=crop",
    price: 24999,
    inStock: true,
    features: ["25L/Hr Capacity", "Auto Flush", "TDS Display", "Industrial Grade Filters"]
  },
  {
    id: "8",
    name: "CoolBreeze Tower Cooler",
    description: "Sleek tower design cooler with 360° air distribution. Modern aesthetics with powerful cooling performance.",
    category: "cooler",
    image: "https://images.unsplash.com/photo-1615874694520-474822394e73?w=800&auto=format&fit=crop",
    price: 7499,
    inStock: true,
    features: ["360° Air Flow", "Touch Controls", "Remote Included", "Anti-Bacterial Tank"]
  },
  {
    id: "9",
    name: "WhisperQuiet Table Fan",
    description: "Compact table fan with ultra-quiet operation. Perfect for desks and bedside tables.",
    category: "fans",
    image: "https://images.unsplash.com/photo-1541640196167-da92986db4e8?w=800&auto=format&fit=crop",
    price: 899,
    inStock: true,
    features: ["300mm Blade", "Silent Motor", "Tilt Adjustable", "Compact Design"]
  },
  {
    id: "10",
    name: "Havells Albus UV Plus Water Purifier",
    description: "Transform your drinking water into a source of pure health with advanced 4-stage UV purification and germicidal UV-C protection. Features iProtect monitoring that automatically stops water flow if unsafe, 6L stainless steel storage tank, and sleek black design. Perfect for modern Indian homes with TDS up to 2000 ppm.",
    category: "ro-purifier",
    image: "https://images.unsplash.com/photo-1624958723474-a7eb2a0c2ae0?w=800&auto=format&fit=crop",
    price: 9900,
    inStock: true,
    features: ["4-Stage RO+UV+UF Purification", "iProtect Safety Monitoring", "6L Stainless Steel Tank", "15L/Hour Flow Rate", "Free Installation & 1-Year Warranty"]
  }
];

export const getProductsByCategory = (category: string) => {
  if (category === "all") return products;
  return products.filter(p => p.category === category);
};

export const getProductById = (id: string) => {
  return products.find(p => p.id === id);
};
