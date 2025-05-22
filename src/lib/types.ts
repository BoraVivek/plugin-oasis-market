
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'vendor' | 'customer';
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface Product {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  price: number;
  image?: string;
  platform: 'WordPress' | 'XenForo' | string;
  category: string;
  tags?: string[];
  author: string;
  version?: string;
  download_count?: number;
  rating?: number;
  review_count?: number;
  release_date?: string;
  last_update?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVersion {
  id: string;
  product_id: string;
  version: string;
  date?: string;
  changes?: string[];
  file_url?: string;
  file_size?: number;
  created_at?: string;
  file_path?: string; // Added for file upload/download
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  author?: string;
  avatar?: string;
  rating: number;
  content?: string;
  date: string;
  status?: 'pending' | 'approved' | 'rejected'; // Added for review moderation
}

export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  product: Product;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  user_id: string;
  product: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
  payment_method?: string;
  payment_id?: string;
  total: number;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  price: number;
  quantity: number;
  product?: Product;
}

export interface FilterOptions {
  platform?: string[];
  category?: string[];
  priceRange?: [number, number];
  tags?: string[];
}

export type SortOption = 'popularity' | 'newest' | 'price-asc' | 'price-desc';

export interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  position: number;
  type: string;
}

export interface ConfigItem {
  id: string;
  name: string;
  value: string;
}
