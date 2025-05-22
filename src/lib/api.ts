
import { supabase } from '@/integrations/supabase/client';
import { 
  Product, ProductVersion, Review, CartItem, 
  WishlistItem, FilterOptions, Order, OrderItem
} from '@/lib/types';

// Products API
export async function getProducts(options?: {
  filter?: FilterOptions;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // Apply filters
    if (options?.filter) {
      const filter = options.filter;
      
      if (filter.platform && filter.platform.length > 0) {
        query = query.in('platform', filter.platform);
      }
      
      if (filter.category && filter.category.length > 0) {
        query = query.in('category', filter.category);
      }
      
      if (filter.priceRange) {
        const [min, max] = filter.priceRange;
        query = query.gte('price', min).lte('price', max);
      }
      
      if (filter.tags && filter.tags.length > 0) {
        query = query.contains('tags', filter.tags);
      }
    }

    // Apply search
    if (options?.search) {
      query = query.ilike('title', `%${options.search}%`);
    }

    // Apply sort
    if (options?.sort) {
      switch (options.sort) {
        case 'popularity':
          query = query.order('download_count', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      // Default sort
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data: data as Product[], count: count || 0 };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data as Product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
}

export async function getProductVersions(productId: string) {
  try {
    const { data, error } = await supabase
      .from('product_versions')
      .select('*')
      .eq('product_id', productId)
      .order('date', { ascending: false });

    if (error) throw error;

    return data as ProductVersion[];
  } catch (error) {
    console.error(`Error fetching versions for product ${productId}:`, error);
    throw error;
  }
}

// New function to get product file URL
export async function getProductFileURL(versionId: string) {
  try {
    // Check if user has purchased the product
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Get the version to find the product ID
    const { data: version, error: versionError } = await supabase
      .from('product_versions')
      .select('product_id')
      .eq('id', versionId)
      .single();
      
    if (versionError) throw versionError;
    
    // Check if user has purchased this product
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_items!inner(
          product_id
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .eq('order_items.product_id', version.product_id);
      
    if (orderError) throw orderError;
    
    if (!orders || orders.length === 0) {
      throw new Error('You have not purchased this product');
    }
    
    // Get signed URL for the file
    const { data: signedUrl, error: signedUrlError } = await supabase
      .storage
      .from('product-files')
      .createSignedUrl(`versions/${versionId}`, 60 * 5); // 5 minutes expiry
      
    if (signedUrlError) throw signedUrlError;
    
    return signedUrl.signedUrl;
  } catch (error) {
    console.error('Error getting product file URL:', error);
    throw error;
  }
}

// Upload product file
export async function uploadProductFile(versionId: string, file: File) {
  try {
    const { data, error } = await supabase
      .storage
      .from('product-files')
      .upload(`versions/${versionId}`, file);
      
    if (error) throw error;
    
    return data.path;
  } catch (error) {
    console.error('Error uploading product file:', error);
    throw error;
  }
}

export async function getProductReviews(productId: string) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('product_id', productId)
      .order('date', { ascending: false });

    if (error) throw error;

    // Format reviews with author information
    return data.map(review => {
      const profile = review.profiles as any;
      return {
        ...review,
        profiles: undefined, // Remove the nested profiles object
        author: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous' : 'Anonymous',
        avatar: profile?.avatar_url,
      };
    }) as Review[];
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    throw error;
  }
}

// Cart API
export async function getCartItems() {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:product_id (*)
      `);

    if (error) throw error;

    return data as CartItem[];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
}

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to add to cart');

    // First check if the item is already in the cart
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('product_id', productId)
      .eq('user_id', user.id);
    
    if (existingItems && existingItems.length > 0) {
      // Update quantity
      const newQuantity = existingItems[0].quantity + quantity;
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', existingItems[0].id);
      
      if (error) throw error;
      
      return { success: true, message: 'Cart updated successfully' };
    } else {
      // Add new item
      const { error } = await supabase
        .from('cart_items')
        .insert({ 
          product_id: productId, 
          user_id: user.id,
          quantity 
        });
      
      if (error) throw error;
      
      return { success: true, message: 'Product added to cart' };
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', cartItemId);
    
    if (error) throw error;
    
    return { success: true, message: 'Cart updated successfully' };
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    
    if (error) throw error;
    
    return { success: true, message: 'Item removed from cart' };
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
}

// Wishlist API
export async function getWishlistItems() {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        product:product_id (*)
      `);

    if (error) throw error;

    return data as WishlistItem[];
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    throw error;
  }
}

export async function addToWishlist(productId: string) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to add to wishlist');

    const { error } = await supabase
      .from('wishlist_items')
      .insert({ 
        product_id: productId,
        user_id: user.id
      });
    
    if (error) throw error;
    
    return { success: true, message: 'Product added to wishlist' };
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    throw error;
  }
}

export async function removeFromWishlist(wishlistItemId: string) {
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', wishlistItemId);
    
    if (error) throw error;
    
    return { success: true, message: 'Item removed from wishlist' };
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    throw error;
  }
}

// Orders API
export async function createOrder(items: CartItem[], paymentMethod: string, paymentId: string) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to create an order');
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ 
        user_id: user.id,
        total, 
        payment_method: paymentMethod, 
        payment_id: paymentId, 
        status: 'paid' 
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      price: item.product.price,
      quantity: item.quantity
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    // Clear cart
    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .in('id', items.map(item => item.id));
    
    if (cartError) throw cartError;
    
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as Order[];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getOrderById(id: string) {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (orderError) throw orderError;
    
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        product:product_id (*)
      `)
      .eq('order_id', id);
    
    if (itemsError) throw itemsError;
    
    return { ...order, items } as Order;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
}

// Admin API
export async function createProduct(product: Product) {
  try {
    // Make sure required fields are included
    if (!product.title || !product.platform || !product.category || !product.author) {
      throw new Error('Missing required product fields');
    }

    const { data, error } = await supabase
      .from('products')
      .insert({ 
        title: product.title,
        summary: product.summary,
        description: product.description,
        price: product.price,
        image: product.image,
        platform: product.platform,
        category: product.category,
        tags: product.tags,
        author: product.author,
        version: product.version
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Product;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
}

export async function addProductVersion(version: ProductVersion) {
  try {
    // Make sure required fields are included
    if (!version.product_id || !version.version) {
      throw new Error('Missing required version fields');
    }
    
    const { data, error } = await supabase
      .from('product_versions')
      .insert({ 
        product_id: version.product_id,
        version: version.version,
        date: version.date || new Date().toISOString(),
        changes: version.changes
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as ProductVersion;
  } catch (error) {
    console.error('Error adding product version:', error);
    throw error;
  }
}

// New function to check if user has purchased a product
export async function hasUserPurchasedProduct(productId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_items!inner(
          product_id
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .eq('order_items.product_id', productId);
      
    if (error) throw error;
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking purchase status for product ${productId}:`, error);
    return false;
  }
}
