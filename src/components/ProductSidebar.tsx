
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import { Download, ShoppingCart, Calendar, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ProductSidebarProps {
  productId: string;
  price: number;
  downloadCount?: number;
  rating?: number;
  reviewCount?: number;
  platform?: string;
  category?: string;
  releaseDate?: string;
  lastUpdate?: string;
  tags?: string[];
  hasPurchased?: boolean;
  isPurchaseCheckLoading?: boolean;
}

const ProductSidebar = ({
  productId,
  price,
  downloadCount = 0,
  rating = 0,
  reviewCount = 0,
  platform,
  category,
  releaseDate,
  lastUpdate,
  tags = [],
  hasPurchased = false,
  isPurchaseCheckLoading = false
}: ProductSidebarProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [isInWishlistState, setIsInWishlistState] = useState<boolean>(isInWishlist(productId));

  // Star rating rendering
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="fill-yellow-400 text-yellow-400 h-4 w-4" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="text-gray-300 h-4 w-4" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="fill-yellow-400 text-yellow-400 h-4 w-4" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="text-gray-300 h-4 w-4" />);
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    addToCart(productId);
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    addToCart(productId);
    navigate("/checkout");
  };

  const handleToggleWishlist = () => {
    toggleWishlistItem(productId);
    setIsInWishlistState(!isInWishlistState);
    
    if (isInWishlistState) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  const handleDownload = () => {
    // This is just a placeholder - actual download functionality is in ProductDownloadSection
    toast.success("Downloading latest version...");
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm divide-y">
      {/* Price section */}
      <div className="p-6">
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold">{formatPrice(price)}</span>
          <div className="flex items-center">
            <div className="flex">
              {renderStars()}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              ({reviewCount})
            </span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {downloadCount} downloads
        </div>

        <div className="space-y-3 mt-6">
          {isPurchaseCheckLoading ? (
            <Button disabled className="w-full">
              Checking purchase status...
            </Button>
          ) : hasPurchased ? (
            <>
              <Button 
                className="w-full" 
                variant="default"
                onClick={handleDownload}
                data-event="product-download-button"
              >
                <Download className="mr-2 h-4 w-4" /> Download Latest
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleBuyNow}
                data-event="product-buy-again-button"
              >
                Purchase Again
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="w-full" 
                variant="default" 
                onClick={handleBuyNow}
                data-event="product-buy-now-button"
              >
                Buy Now
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handleAddToCart}
                data-event="product-add-to-cart-button"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </>
          )}
          <Button 
            className="w-full" 
            variant={isInWishlistState ? "secondary" : "ghost"}
            onClick={handleToggleWishlist}
            data-event="product-wishlist-toggle-button"
          >
            {isInWishlistState ? "Remove from Wishlist" : "Add to Wishlist"}
          </Button>
        </div>
      </div>

      {/* Product details */}
      <div className="p-6">
        <div className="space-y-4">
          {platform && (
            <div>
              <div className="text-sm font-medium mb-1">Platform</div>
              <Badge variant="outline">{platform}</Badge>
            </div>
          )}

          {category && (
            <div>
              <div className="text-sm font-medium mb-1">Category</div>
              <Badge variant="outline">{category}</Badge>
            </div>
          )}

          {releaseDate && (
            <div>
              <div className="text-sm font-medium mb-1">Released</div>
              <div className="text-sm flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(releaseDate)}
              </div>
            </div>
          )}

          {lastUpdate && (
            <div>
              <div className="text-sm font-medium mb-1">Last Updated</div>
              <div className="text-sm flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(lastUpdate)}
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-1">Tags</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Support section */}
      <div className="p-6">
        <h3 className="font-medium mb-2">Support</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Need help with this product? Contact our support team or visit our forums.
        </p>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open("https://support.example.com", "_blank")}
          data-event="product-support-click"
        >
          Visit Support Forum
        </Button>
      </div>
    </div>
  );
};

export default ProductSidebar;
