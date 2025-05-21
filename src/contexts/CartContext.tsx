
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/lib/types';
import { getCartItems, addToCart, updateCartItemQuantity, removeFromCart } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Calculate totals
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Load cart items when user changes
  useEffect(() => {
    const loadCartItems = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const data = await getCartItems();
          setItems(data);
        } catch (error) {
          console.error('Failed to load cart:', error);
          toast.error('Failed to load cart items');
        } finally {
          setIsLoading(false);
        }
      } else {
        setItems([]);
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, [user]);

  const addItem = async (productId: string, quantity = 1) => {
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      return;
    }

    try {
      await addToCart(productId, quantity);
      const data = await getCartItems();
      setItems(data);
      toast.success('Product added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartItemQuantity(itemId, quantity);
      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      setItems(items.filter(item => item.id !== itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    try {
      for (const item of items) {
        await removeFromCart(item.id);
      }
      setItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const value = {
    items,
    isLoading,
    totalItems,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
