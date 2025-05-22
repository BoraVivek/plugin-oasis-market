
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { FilterOptions } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FilterSidebarProps {
  initialFilters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

const FilterSidebar = ({
  initialFilters,
  onFilterChange,
  className,
}: FilterSidebarProps) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  
  // Get platforms and categories from the database
  const { data: platforms } = useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('platform')
        .order('platform', { ascending: true });
      
      // Get unique platforms
      return Array.from(new Set(data?.map(item => item.platform).filter(Boolean))) as string[];
    }
  });
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('category')
        .order('category', { ascending: true });
      
      // Get unique categories
      return Array.from(new Set(data?.map(item => item.category).filter(Boolean))) as string[];
    }
  });
  
  // Get maximum price for the slider
  useQuery({
    queryKey: ['maxPrice'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('price')
        .order('price', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        const maxProductPrice = Math.ceil(data[0].price);
        setMaxPrice(maxProductPrice > 0 ? maxProductPrice : 1000);
        setPriceRange([0, maxProductPrice > 0 ? maxProductPrice : 1000]);
      }
      
      return null;
    }
  });

  // Initialize filters from props
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
      
      // Set initial price range if provided
      if (initialFilters.priceRange) {
        setPriceRange(initialFilters.priceRange);
      }
    }
  }, [initialFilters]);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleCheckboxChange = (
    category: "platform" | "category",
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => {
      const currentValues = prev[category] || [];
      let newValues;

      if (checked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter((val) => val !== value);
      }

      return {
        ...prev,
        [category]: newValues,
      };
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    setFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]],
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setPriceRange([0, maxPrice]);
    onFilterChange({});
  };

  const hasActiveFilters = () => {
    return (
      (filters.platform && filters.platform.length > 0) ||
      (filters.category && filters.category.length > 0) ||
      (filters.priceRange &&
        (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice))
    );
  };

  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 px-2 text-xs"
              data-event="clear-all-filters"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active filters */}
        {hasActiveFilters() && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {filters.platform?.map((platform) => (
                <Badge
                  key={platform}
                  variant="secondary"
                  className="flex items-center gap-1 pl-2"
                >
                  {platform}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleCheckboxChange("platform", platform, false)
                    }
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    data-event="remove-platform-filter"
                    data-event-label={platform}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {platform} filter</span>
                  </Button>
                </Badge>
              ))}
              
              {filters.category?.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="flex items-center gap-1 pl-2"
                >
                  {category}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleCheckboxChange("category", category, false)
                    }
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    data-event="remove-category-filter"
                    data-event-label={category}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {category} filter</span>
                  </Button>
                </Badge>
              ))}
              
              {filters.priceRange &&
                (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 pl-2"
                  >
                    {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setPriceRange([0, maxPrice]);
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [0, maxPrice],
                        }));
                      }}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      data-event="remove-price-filter"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove price filter</span>
                    </Button>
                  </Badge>
                )}
            </div>
          </div>
        )}

        <Separator />

        {/* Platform filter */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Platform</h3>
          <div className="grid gap-2">
            {platforms && platforms.length > 0 ? (
              platforms.map((platform) => (
                <div
                  key={platform}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`platform-${platform}`}
                    checked={filters.platform?.includes(platform)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("platform", platform, checked === true)
                    }
                    data-event="platform-filter-change"
                    data-event-label={platform}
                  />
                  <Label htmlFor={`platform-${platform}`} className="text-sm">
                    {platform}
                  </Label>
                </div>
              ))
            ) : (
              <>
                {["WordPress", "XenForo"].map((platform) => (
                  <div
                    key={platform}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`platform-${platform}`}
                      checked={filters.platform?.includes(platform)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("platform", platform, checked === true)
                      }
                      data-event="platform-filter-change"
                      data-event-label={platform}
                    />
                    <Label htmlFor={`platform-${platform}`} className="text-sm">
                      {platform}
                    </Label>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Category filter */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Category</h3>
          <div className="grid gap-2">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.category?.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("category", category, checked === true)
                    }
                    data-event="category-filter-change"
                    data-event-label={category}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))
            ) : (
              <>
                {["Plugins", "Themes", "Extensions"].map((category) => (
                  <div
                    key={category}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.category?.includes(category)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("category", category, checked === true)
                      }
                      data-event="category-filter-change"
                      data-event-label={category}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Price range filter */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Price Range</h3>
            <span className="text-xs text-muted-foreground">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
          </div>
          
          <Slider
            defaultValue={priceRange}
            value={priceRange}
            max={maxPrice}
            step={1}
            onValueChange={handlePriceRangeChange}
            className="w-full"
            data-event="price-range-filter-change"
          />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatPrice(0)}</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
