
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WishlistItem } from '@/lib/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { addToWishlist as apiAddToWishlist, removeFromWishlist, getWishlistItems } from '@/lib/api';

interface WishlistContextType {
  items: WishlistItem[];
  totalItems: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlistItem: (productId: string) => void;
  clearWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Load wishlist items when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      
      try {
        if (user) {
          const wishlistItems = await getWishlistItems();
          setItems(wishlistItems);
        } else {
          // If no user, clear the wishlist
          setItems([]);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWishlist();
    
    // Listen for wishlist changes
    const channel = supabase
      .channel('wishlist_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wishlist_items'
      }, () => {
        // Reload wishlist items when changes occur
        if (user) {
          loadWishlist();
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Check if a product is in the wishlist
  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  // Toggle wishlist item
  const toggleWishlistItem = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }
    
    try {
      const existingItem = items.find(item => item.product_id === productId);
      
      if (existingItem) {
        // Remove from wishlist
        await removeFromWishlist(existingItem.id);
        setItems(items.filter(item => item.id !== existingItem.id));
      } else {
        // Add to wishlist
        await apiAddToWishlist(productId);
        // We'll let the subscription update the items
      }
    } catch (error: any) {
      console.error('Error toggling wishlist item:', error);
      toast.error('Failed to update wishlist');
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      for (const item of items) {
        await removeFromWishlist(item.id);
      }
      setItems([]);
    } catch (error: any) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        totalItems: items.length,
        isInWishlist,
        toggleWishlistItem,
        clearWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
