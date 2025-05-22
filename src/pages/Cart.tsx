
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Trash2, Minus, Plus, ShoppingBag, AlertTriangle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

const Cart = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemove = (itemId: string) => {
    removeItem(itemId);
  };

  const handleCheckout = () => {
    if (!user) {
      sessionStorage.setItem('redirectTo', '/checkout');
      navigate('/auth');
      toast.error('Please sign in to proceed to checkout');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container max-w-6xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        
        {totalItems === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Button onClick={() => navigate('/')}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {items.map((item) => (
                <Card key={item.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={item.product.image || 'https://picsum.photos/seed/placeholder/200/200'} 
                          alt={item.product.title} 
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.product.title}</h3>
                        <p className="text-sm text-muted-foreground">by {item.product.author}</p>
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="text-xs">
                            {item.product.platform}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-lg font-medium text-success">
                          {formatPrice(item.product.price)}
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className="h-8 w-12 mx-1 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items ({totalItems})</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    {/* We could add discounts, taxes, etc. here */}
                    <div className="border-t my-4 pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 px-6 pb-6 pt-0">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
