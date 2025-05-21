
import { useWishlist } from '@/contexts/WishlistContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

const Wishlist = () => {
  const { items, totalItems, removeItem } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (productId: string) => {
    await addItem(productId);
  };

  const handleRemove = (itemId: string) => {
    removeItem(itemId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container max-w-6xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
        
        {totalItems === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Discover products you'd like to save for later.</p>
            <Button onClick={() => navigate('/')}>Explore Products</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden border border-border card-hover">
                <div 
                  className="aspect-[4/3] relative overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${item.product.id}`)}
                >
                  <img 
                    src={item.product.image || 'https://picsum.photos/seed/placeholder/600/400'} 
                    alt={item.product.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-white/80 text-secondary hover:bg-white/70">
                      {item.product.platform}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div 
                      className="hover:underline cursor-pointer"
                      onClick={() => navigate(`/product/${item.product.id}`)}
                    >
                      <h3 className="font-medium text-lg line-clamp-1">{item.product.title}</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">by {item.product.author}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-success font-semibold">
                      {formatPrice(item.product.price)}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAddToCart(item.product_id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
