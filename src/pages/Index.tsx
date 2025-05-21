
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import { Grid2X2, LayoutList, Loader2 } from "lucide-react";
import { getProducts } from '@/lib/api';
import { FilterOptions, Product } from '@/lib/types';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('popularity');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const navigate = useNavigate();
  
  // Parse search parameters
  useEffect(() => {
    const platform = searchParams.get('platform');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'popularity';
    
    setFilterOptions({
      ...(platform ? { platform: [platform] } : {}),
      ...(category ? { category: [category] } : {})
    });
    
    setSortOption(sort);
  }, [searchParams]);

  // Fetch products based on filters, search and sort
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filterOptions, sortOption, searchParams.get('search')],
    queryFn: () => getProducts({
      filter: filterOptions,
      sort: sortOption,
      search: searchParams.get('search') || undefined,
      limit: 50 // Load more products at once for simplicity
    })
  });

  // Handle filter updates from the sidebar
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
    
    // Update URL search params
    const params = new URLSearchParams();
    
    if (newFilters.platform && newFilters.platform.length > 0) {
      params.set('platform', newFilters.platform[0]);
    }
    
    if (newFilters.category && newFilters.category.length > 0) {
      params.set('category', newFilters.category[0]);
    }
    
    if (searchParams.get('search')) {
      params.set('search', searchParams.get('search')!);
    }
    
    if (sortOption) {
      params.set('sort', sortOption);
    }
    
    setSearchParams(params);
  };

  // Handle sort option change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

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
            <Select value={sortOption} onValueChange={handleSortChange}>
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
          <FilterSidebar 
            className="w-full md:w-64 shrink-0"
            initialFilters={filterOptions}
            onFilterChange={handleFilterChange}
          />
          
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <h2 className="text-xl font-semibold text-destructive">Error loading products</h2>
                <p className="text-muted-foreground mt-2">Please try again later</p>
                <Button onClick={() => navigate(0)} className="mt-4">Refresh</Button>
              </div>
            ) : data?.data.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-xl font-semibold">No products found</h2>
                <p className="text-muted-foreground mt-2">Try changing your search or filter criteria</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewType === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {data?.data.map((product: Product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    title={product.title}
                    image={product.image || `https://picsum.photos/seed/${product.id}/600/400`}
                    price={product.price}
                    rating={product.rating || 0}
                    platform={product.platform}
                    category={product.category}
                    author={product.author}
                    sales={product.download_count}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
