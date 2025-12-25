import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductModalProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price?: number;
  inStock: boolean;
  features: string[];
}

interface ProductModalProps {
  product: ProductModalProduct;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  if (!isOpen) return null;

  // Format category for display
  const displayCategory = product.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto card-shadow animate-scale-in">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-smooth"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="aspect-video bg-muted overflow-hidden rounded-t-2xl">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-secondary text-accent-foreground">
              {displayCategory}
            </Badge>
            {product.inStock ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">In Stock</Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {product.name}
          </h2>

          <p className="text-muted-foreground mb-6">
            {product.description}
          </p>

          {product.price && (
            <div className="text-3xl font-bold text-primary mb-6">
              ₹{product.price.toLocaleString()}
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button size="lg" className="w-full button-shadow">
            Visit Store for Purchase
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
