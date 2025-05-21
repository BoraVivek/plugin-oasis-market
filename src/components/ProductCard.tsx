
import { Heart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

export interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  platform: 'WordPress' | 'XenForo';
  category: string;
  author: string;
  sales?: number;
}

const ProductCard = ({
  id,
  title,
  image,
  price,
  rating,
  platform,
  category,
  author,
  sales = 0
}: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-border card-hover">
      <Link to={`/product/${id}`}>
        <div className="aspect-[4/3] relative overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-white/80 text-secondary hover:bg-white/70">
              {platform}
            </Badge>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <Link to={`/product/${id}`} className="hover:underline">
            <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">by {author}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            {sales > 0 && (
              <span className="text-xs text-muted-foreground">({sales} sales)</span>
            )}
          </div>
          
          <div className="text-success font-semibold">
            {price > 0 ? `$${price.toFixed(2)}` : 'Free'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
