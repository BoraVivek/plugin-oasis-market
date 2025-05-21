
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Heart, Share, ShoppingCart, Star } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductSidebarProps {
  productId: string;
  price: number;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  platform: 'WordPress' | 'XenForo';
  category: string;
  releaseDate: string;
  lastUpdate: string;
  tags: string[];
}

const ProductSidebar = ({
  productId,
  price,
  downloadCount,
  rating,
  reviewCount,
  platform,
  category,
  releaseDate,
  lastUpdate,
  tags
}: ProductSidebarProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem, items, isInWishlist } = useWishlist();
  const { user } = useAuth();
  
  const wishlistItem = items.find(item => item.product_id === productId);
  const inWishlist = isInWishlist(productId);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await addItem(productId);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    if (inWishlist && wishlistItem) {
      removeItem(wishlistItem.id);
    } else {
      addToWishlist(productId);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <div className="text-2xl font-bold text-success mb-4">
            {formatPrice(price)}
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {price > 0 ? (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Now
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
            
            <div className="flex space-x-2">
              <Button 
                variant={inWishlist ? "default" : "outline"}
                className="flex-1"
                onClick={handleWishlistToggle}
              >
                <Heart className={`mr-2 h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
                {inWishlist ? 'Wishlisted' : 'Wishlist'}
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 pt-2 border-t border-border">
          <div>
            <div className="text-sm text-muted-foreground">Downloads</div>
            <div className="font-medium">{downloadCount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Rating</div>
            <div className="flex items-center">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating) 
                        ? "text-amber-400 fill-amber-400" 
                        : "text-gray-300 fill-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 pt-2 border-t border-border">
          <div>
            <div className="text-sm text-muted-foreground">Platform</div>
            <div className="font-medium">{platform}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Category</div>
            <div className="font-medium">{category}</div>
          </div>
          {releaseDate && (
            <div>
              <div className="text-sm text-muted-foreground">Released</div>
              <div className="font-medium">{formatDate(releaseDate)}</div>
            </div>
          )}
          {lastUpdate && (
            <div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="font-medium">{formatDate(lastUpdate)}</div>
            </div>
          )}
        </div>
        
        {tags.length > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="text-sm text-muted-foreground mb-2">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground text-center w-full">
          Need help with this product?
          <a href="#" className="text-primary ml-1 hover:underline">Contact Support</a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductSidebar;
