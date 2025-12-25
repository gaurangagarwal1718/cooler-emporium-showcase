import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price?: number;
  inStock: boolean;
  features?: string[];
  onViewDetails?: (id: string) => void;
}

const ProductCard = ({ id, name, description, category, image, price, inStock, onViewDetails }: ProductCardProps) => {
  // Format category for display
  const displayCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="group bg-card rounded-xl overflow-hidden card-shadow transition-smooth hover:card-shadow-hover animate-scale-in">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-secondary text-accent-foreground"
        >
          {displayCategory}
        </Badge>
        {!inStock && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="text-background font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          {price && (
            <span className="text-lg font-bold text-primary">₹{price.toLocaleString()}</span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            onClick={() => onViewDetails?.(id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
