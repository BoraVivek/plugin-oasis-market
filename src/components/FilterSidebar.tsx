
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface FilterSidebarProps {
  className?: string;
}

const FilterSidebar = ({ className }: FilterSidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);

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

  const FilterContent = () => (
    <div className="flex flex-col space-y-6 py-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Platform</h3>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center space-x-2">
              <Checkbox id={platform.id} />
              <label
                htmlFor={platform.id}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {platform.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox id={category.id} />
              <label
                htmlFor={category.id}
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
            defaultValue={[0, 100]} 
            max={100} 
            step={1} 
            value={priceRange}
            onValueChange={setPriceRange}
          />
          <div className="flex items-center justify-between">
            <Input
              type="number"
              className="w-20 h-8"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="number"
              className="w-20 h-8"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Button className="mt-2">Apply Filters</Button>
      <Button variant="outline">Clear All</Button>
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
