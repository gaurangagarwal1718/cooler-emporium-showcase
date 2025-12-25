import { useState } from "react";
import { Link } from "react-router-dom";
import { Droplet, Wind, Fan, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import MapSection from "@/components/MapSection";
import { useStore, Product } from "@/hooks/useStore";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, categories, getCategoryById } = useStore();
  
  const featuredProducts = products.slice(0, 6);

  const handleViewDetails = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) setSelectedProduct(product);
  };

  // Map categories from store to display cards
  const categoryCards = categories.map((cat) => {
    let icon;
    switch (cat.slug) {
      case "ro-purifier":
        icon = <Droplet className="w-7 h-7 text-primary" />;
        break;
      case "cooler":
        icon = <Wind className="w-7 h-7 text-primary" />;
        break;
      case "fans":
        icon = <Fan className="w-7 h-7 text-primary" />;
        break;
      default:
        icon = <Droplet className="w-7 h-7 text-primary" />;
    }
    return {
      title: cat.name,
      description: cat.description,
      icon,
      link: `/products?category=${cat.slug}`,
      color: cat.slug === "ro-purifier" ? "bg-blue-50" : cat.slug === "cooler" ? "bg-cyan-50" : "bg-indigo-50",
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-secondary/50 to-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm text-accent-foreground mb-6 animate-fade-in">
              <Star className="w-4 h-4 text-primary" />
              <span>Trusted by 10,000+ Happy Customers</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Stay Cool, Stay{" "}
              <span className="text-gradient">Refreshed</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Discover premium RO purifiers, air coolers, and fans. Quality products 
              for a comfortable home, backed by expert service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button size="lg" className="button-shadow" asChild>
                <Link to="/products">
                  Browse Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#contact">Find Our Store</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect cooling solution for your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryCards.map((cat, index) => (
              <div key={cat.title} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CategoryCard {...cat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Our most popular cooling solutions
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => {
              const category = getCategoryById(product.categoryId);
              return (
                <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
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
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose Cooler Emporium?
            </h2>
            <p className="text-muted-foreground mb-8">
              With over 15 years of experience, we're your trusted partner for all cooling needs. 
              We offer genuine products, expert installation, and reliable after-sales service.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Products Sold</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <MapSection />

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

export default Index;
