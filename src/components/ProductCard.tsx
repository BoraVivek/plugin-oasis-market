
import { Heart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

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
  const { user } = useAuth();
  const { addItem, removeItem, items, isInWishlist } = useWishlist();
  
  const wishlistItem = items.find(item => item.product_id === id);
  const inWishlist = isInWishlist(id);

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    if (inWishlist && wishlistItem) {
      removeItem(wishlistItem.id);
    } else {
      addItem(id);
    }
  };

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
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${inWishlist ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
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
            {formatPrice(price)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
