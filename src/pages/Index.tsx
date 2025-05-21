
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Grid2X2, LayoutList } from "lucide-react";

// Sample data for demonstration
const sampleProducts = [
  {
    id: "1",
    title: "WooCommerce Advanced Product Filter",
    image: "https://picsum.photos/seed/product1/600/400",
    price: 49.99,
    rating: 4.8,
    platform: "WordPress" as const,
    category: "Plugins",
    author: "CodeMaster",
    sales: 2345
  },
  {
    id: "2",
    title: "XenForo Media Gallery Pro",
    image: "https://picsum.photos/seed/product2/600/400",
    price: 39.99,
    rating: 4.5,
    platform: "XenForo" as const,
    category: "Extensions",
    author: "XenTech",
    sales: 1298
  },
  {
    id: "3",
    title: "Elementor Page Builder Addons Pack",
    image: "https://picsum.photos/seed/product3/600/400",
    price: 29.99,
    rating: 4.6,
    platform: "WordPress" as const,
    category: "Plugins",
    author: "DesignElite",
    sales: 3421
  },
  {
    id: "4",
    title: "Modern Forum Theme for XenForo",
    image: "https://picsum.photos/seed/product4/600/400",
    price: 59.99,
    rating: 4.9,
    platform: "XenForo" as const,
    category: "Themes",
    author: "ForumMaster",
    sales: 876
  },
  {
    id: "5",
    title: "SEO Toolkit for WordPress",
    image: "https://picsum.photos/seed/product5/600/400",
    price: 19.99,
    rating: 4.7,
    platform: "WordPress" as const,
    category: "Plugins",
    author: "RankPro",
    sales: 5643
  },
  {
    id: "6",
    title: "Advanced Login and Registration",
    image: "https://picsum.photos/seed/product6/600/400",
    price: 0,
    rating: 4.3,
    platform: "XenForo" as const,
    category: "Extensions",
    author: "SecurityPro",
    sales: 2187
  },
  {
    id: "7",
    title: "Responsive Business WordPress Theme",
    image: "https://picsum.photos/seed/product7/600/400",
    price: 79.99,
    rating: 4.8,
    platform: "WordPress" as const,
    category: "Themes",
    author: "ThemeCraft",
    sales: 3210
  },
  {
    id: "8",
    title: "Forum Gamification Suite",
    image: "https://picsum.photos/seed/product8/600/400",
    price: 44.99,
    rating: 4.6,
    platform: "XenForo" as const,
    category: "Extensions",
    author: "ForumPlus",
    sales: 1532
  }
];

const Index = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Digital Marketplace</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewType === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewType('grid')}
              className="h-9 w-9"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewType('list')}
              className="h-9 w-9"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Select defaultValue="popularity">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar className="w-full md:w-64 shrink-0" />
          
          <div className="flex-1">
            <div className={`grid gap-6 ${
              viewType === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {sampleProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
