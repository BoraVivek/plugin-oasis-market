
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FilterOptions } from '@/lib/types';

interface FilterSidebarProps {
  className?: string;
  initialFilters?: FilterOptions;
  onFilterChange?: (filters: FilterOptions) => void;
}

const FilterSidebar = ({ className, initialFilters = {}, onFilterChange }: FilterSidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [platformFilters, setPlatformFilters] = useState<string[]>(initialFilters.platform || []);
  const [categoryFilters, setCategoryFilters] = useState<string[]>(initialFilters.category || []);
  const [tagFilters, setTagFilters] = useState<string[]>(initialFilters.tags || []);

  useEffect(() => {
    // Update local filter states when initialFilters change
    setPlatformFilters(initialFilters.platform || []);
    setCategoryFilters(initialFilters.category || []);
    setTagFilters(initialFilters.tags || []);
    setPriceRange(initialFilters.priceRange || [0, 100]);
  }, [initialFilters]);

  const platforms = [
    { id: 'wordpress', label: 'WordPress' },
    { id: 'xenforo', label: 'XenForo' },
  ];

  const categories = [
    { id: 'plugins', label: 'Plugins' },
    { id: 'themes', label: 'Themes' },
    { id: 'extensions', label: 'Extensions' },
    { id: 'templates', label: 'Templates' },
    { id: 'integrations', label: 'Integrations' },
  ];

  const tags = [
    'eCommerce', 'SEO', 'Security', 'Media', 'Forms', 'Social', 'Admin', 'Forum'
  ];

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const newPlatforms = checked
      ? [...platformFilters, platform]
      : platformFilters.filter(p => p !== platform);
    
    setPlatformFilters(newPlatforms);
    updateFilters({ ...getFilterState(), platform: newPlatforms });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...categoryFilters, category]
      : categoryFilters.filter(c => c !== category);
    
    setCategoryFilters(newCategories);
    updateFilters({ ...getFilterState(), category: newCategories });
  };

  const handleTagChange = (tag: string) => {
    const newTags = tagFilters.includes(tag)
      ? tagFilters.filter(t => t !== tag)
      : [...tagFilters, tag];
    
    setTagFilters(newTags);
    updateFilters({ ...getFilterState(), tags: newTags });
  };

  const handlePriceChange = (values: number[]) => {
    const newPriceRange: [number, number] = [values[0], values[1]];
    setPriceRange(newPriceRange);
  };

  const applyFilters = () => {
    updateFilters(getFilterState());
  };

  const clearFilters = () => {
    setPlatformFilters([]);
    setCategoryFilters([]);
    setTagFilters([]);
    setPriceRange([0, 100]);
    updateFilters({});
  };

  const getFilterState = (): FilterOptions => ({
    platform: platformFilters.length > 0 ? platformFilters : undefined,
    category: categoryFilters.length > 0 ? categoryFilters : undefined,
    tags: tagFilters.length > 0 ? tagFilters : undefined,
    priceRange: priceRange[0] !== 0 || priceRange[1] !== 100 ? priceRange : undefined,
  });

  const updateFilters = (filters: FilterOptions) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const FilterContent = () => (
    <div className="flex flex-col space-y-6 py-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Platform</h3>
        <div className="space-y-2">
          {platforms.map((platform) => {
            const platformValue = platform.label.toLowerCase();
            return (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`platform-${platform.id}`}
                  checked={platformFilters.includes(platform.label)}
                  onCheckedChange={(checked) => handlePlatformChange(platform.label, checked === true)}
                />
                <label
                  htmlFor={`platform-${platform.id}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {platform.label}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category.id}`}
                checked={categoryFilters.includes(category.label)}
                onCheckedChange={(checked) => handleCategoryChange(category.label, checked === true)}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider 
            value={priceRange} 
            max={100} 
            step={1} 
            onValueChange={handlePriceChange}
          />
          <div className="flex items-center justify-between">
            <Input
              type="number"
              className="w-20 h-8"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
              min={0}
              max={priceRange[1]}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="number"
              className="w-20 h-8"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
              min={priceRange[0]}
              max={100}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              variant={tagFilters.includes(tag) ? "default" : "outline"} 
              className="cursor-pointer hover:bg-muted"
              onClick={() => handleTagChange(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Button className="mt-2" onClick={applyFilters}>Apply Filters</Button>
      <Button variant="outline" onClick={clearFilters}>Clear All</Button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:block ${className}`}>
        <FilterContent />
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Narrow down your search with these filters
              </SheetDescription>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default FilterSidebar;
