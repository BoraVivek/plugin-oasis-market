
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  rating?: number;
  platform?: string;
  category?: string;
  author?: string;
  sales?: number;
  version?: string;
}

const ProductCard = ({
  id,
  title,
  image,
  price,
  rating = 0,
  platform,
  category,
  author,
  sales = 0,
  version,
}: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  // Generate stars based on rating
  const renderRating = () => {
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

  return (
    <Card 
      className="overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md"
      onClick={handleClick}
      data-event="product-card-click"
      data-event-category="Product"
      data-event-label={title}
      data-product-id={id}
    >
      <div className="aspect-[16/9] relative bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {platform && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary">{platform}</Badge>
          </div>
        )}
        
        {version && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-white/80">v{version}</Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate">{title}</h3>
          <span className="font-semibold text-green-600">{formatPrice(price)}</span>
        </div>
        
        {category && (
          <div className="mt-1 text-sm text-muted-foreground truncate">
            {category}
          </div>
        )}
        
        {author && (
          <div className="mt-2 text-sm">
            by <span className="text-primary">{author}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex">{renderRating()}</div>
          {sales > 0 && (
            <div className="text-xs text-muted-foreground flex items-center">
              <Download className="h-3 w-3 mr-1" /> {sales}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        <Button variant="secondary" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
