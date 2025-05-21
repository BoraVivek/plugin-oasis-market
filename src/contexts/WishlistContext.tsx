
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem } from '@/lib/types';
import { getWishlistItems, addToWishlist, removeFromWishlist } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  totalItems: number;
  addItem: (productId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const totalItems = items.length;

  // Load wishlist items when user changes
  useEffect(() => {
    const loadWishlistItems = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const data = await getWishlistItems();
          setItems(data);
        } catch (error) {
          console.error('Failed to load wishlist:', error);
          toast.error('Failed to load wishlist items');
        } finally {
          setIsLoading(false);
        }
      } else {
        setItems([]);
        setIsLoading(false);
      }
    };

    loadWishlistItems();
  }, [user]);

  const addItem = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    try {
      await addToWishlist(productId);
      const data = await getWishlistItems();
      setItems(data);
      toast.success('Product added to wishlist');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast.error('Failed to add product to wishlist');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeFromWishlist(itemId);
      setItems(items.filter(item => item.id !== itemId));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  const value = {
    items,
    isLoading,
    totalItems,
    addItem,
    removeItem,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
