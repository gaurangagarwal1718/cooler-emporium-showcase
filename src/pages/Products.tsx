import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useStore, Product } from "@/hooks/useStore";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { categories, products, getCategoryById, getProductById } = useStore();

  // Build category labels dynamically
  const categoryLabels: Record<string, string> = {
    all: "All Products",
    ...Object.fromEntries(categories.map(c => [c.id, c.name]))
  };

  // Sync category from URL
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && (category === "all" || categories.some(c => c.id === category || c.slug === category))) {
      // Find by slug or id
      const found = categories.find(c => c.slug === category || c.id === category);
      setActiveCategory(found ? found.id : "all");
    }
  }, [searchParams, categories]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      const category = getCategoryById(categoryId);
      searchParams.set("category", category?.slug || categoryId);
    }
    setSearchParams(searchParams);
  };

  const handleViewDetails = (id: string) => {
    const product = getProductById(id);
    if (product) setSelectedProduct(product);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.categoryId === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-8 md:pt-28 md:pb-12 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Products
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse our complete collection of RO purifiers, coolers, and fans. 
            Quality products for every home and budget.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border sticky top-16 bg-background/95 backdrop-blur z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange("all")}
                className={activeCategory === "all" ? "button-shadow" : ""}
              >
                All Products
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className={activeCategory === category.id ? "button-shadow" : ""}
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Results count */}
          <div className="mb-6 flex items-center gap-2 text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              {activeCategory !== "all" && ` in ${categoryLabels[activeCategory]}`}
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => {
                const category = getCategoryById(product.categoryId);
                return (
                  <div key={product.id} style={{ animationDelay: `${index * 0.05}s` }}>
                    <ProductCard 
                      id={product.id}
                      name={product.name}
                      description={product.description}
                      category={category?.slug || "uncategorized"}
                      image={product.images[0] || "/placeholder.svg"}
                      price={product.price}
                      inStock={product.inStock}
                      features={product.features}
                      onViewDetails={handleViewDetails} 
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No products found matching your criteria.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                handleCategoryChange("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            description: selectedProduct.description,
            category: getCategoryById(selectedProduct.categoryId)?.slug || "uncategorized",
            image: selectedProduct.images[0] || "/placeholder.svg",
            price: selectedProduct.price,
            inStock: selectedProduct.inStock,
            features: selectedProduct.features
          }}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Products;
