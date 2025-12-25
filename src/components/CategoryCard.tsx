import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
  color: string;
}

const CategoryCard = ({ title, description, icon, link, color }: CategoryCardProps) => {
  return (
    <Link 
      to={link}
      className="group block bg-card rounded-xl p-6 card-shadow transition-smooth hover:card-shadow-hover hover:-translate-y-1"
    >
      <div 
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${color}`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <div className="flex items-center gap-2 text-primary font-medium text-sm">
        <span>Browse Products</span>
        <ArrowRight className="w-4 h-4 transition-smooth group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

export default CategoryCard;
