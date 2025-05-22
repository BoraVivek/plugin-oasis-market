
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Plus, DragHandleDots2Icon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface NavItem {
  id: string;
  label: string;
  href: string;
  position: number;
  type: string;
}

interface ConfigItem {
  id: string;
  name: string;
  value: string;
}

const SettingsAdmin = () => {
  const queryClient = useQueryClient();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newPlatform, setNewPlatform] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newNavItem, setNewNavItem] = useState({ label: "", href: "" });
  
  // Query for maintenance mode
  const { data: configData } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: async () => {
      const { data } = await supabase
        .from('config')
        .select('*');
      return data || [];
    }
  });
  
  // Query for nav items
  const { data: navItems, refetch: refetchNavItems } = useQuery({
    queryKey: ['navItems'],
    queryFn: async () => {
      const { data } = await supabase
        .from('nav_items')
        .select('*')
        .order('position', { ascending: true });
      return data || [];
    }
  });
  
  // Query for platforms and categories
  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ['productsForSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('platform, category');
      return data || [];
    }
  });
  
  // Extract unique platforms and categories
  const platforms = Array.from(new Set(products?.map(p => p.platform).filter(Boolean))) || [];
  const categories = Array.from(new Set(products?.map(p => p.category).filter(Boolean))) || [];
  
  // Set initial maintenance mode
  useEffect(() => {
    if (configData) {
      const maintenanceConfig = configData.find((item: ConfigItem) => item.name === 'maintenance_mode');
      if (maintenanceConfig) {
        setMaintenanceMode(maintenanceConfig.value === 'true');
      }
    }
  }, [configData]);
  
  const handleMaintenanceModeToggle = async () => {
    const newValue = !maintenanceMode;
    setMaintenanceMode(newValue);
    
    try {
      const { data: existingConfig } = await supabase
        .from('config')
        .select('*')
        .eq('name', 'maintenance_mode')
        .single();
      
      if (existingConfig) {
        // Update existing config
        await supabase
          .from('config')
          .update({ value: String(newValue) })
          .eq('id', existingConfig.id);
      } else {
        // Insert new config
        await supabase
          .from('config')
          .insert({ name: 'maintenance_mode', value: String(newValue) });
      }
      
      toast.success(`Maintenance mode ${newValue ? 'enabled' : 'disabled'}`);
      queryClient.invalidateQueries({ queryKey: ['siteConfig'] });
    } catch (error) {
      console.error('Error updating maintenance mode:', error);
      toast.error('Failed to update maintenance mode');
      setMaintenanceMode(!newValue); // Revert UI state
    }
  };
  
  const handleAddPlatform = async () => {
    if (!newPlatform.trim()) {
      toast.error('Platform name cannot be empty');
      return;
    }
    
    // Since we don't have a platforms table, we'll add a dummy product with this platform
    try {
      await supabase
        .from('products')
        .insert({
          title: `Platform: ${newPlatform}`,
          platform: newPlatform,
          category: 'Template',
          price: 0,
          author: 'Admin',
          download_count: 0
        });
        
      toast.success(`Platform "${newPlatform}" added`);
      setNewPlatform("");
      refetchProducts();
    } catch (error) {
      console.error('Error adding platform:', error);
      toast.error('Failed to add platform');
    }
  };
  
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    // Since we don't have a categories table, we'll add a dummy product with this category
    try {
      await supabase
        .from('products')
        .insert({
          title: `Category: ${newCategory}`,
          platform: 'Template',
          category: newCategory,
          price: 0,
          author: 'Admin',
          download_count: 0
        });
        
      toast.success(`Category "${newCategory}" added`);
      setNewCategory("");
      refetchProducts();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };
  
  const handleAddNavItem = async () => {
    if (!newNavItem.label.trim() || !newNavItem.href.trim()) {
      toast.error('Both label and URL are required');
      return;
    }
    
    try {
      // Get the highest position value
      const maxPosition = navItems && navItems.length > 0
        ? Math.max(...navItems.map((item: NavItem) => item.position)) + 1
        : 0;
      
      await supabase
        .from('nav_items')
        .insert({
          label: newNavItem.label,
          href: newNavItem.href,
          position: maxPosition,
          type: 'main'
        });
        
      toast.success('Navigation item added');
      setNewNavItem({ label: "", href: "" });
      refetchNavItems();
    } catch (error) {
      console.error('Error adding nav item:', error);
      toast.error('Failed to add navigation item');
    }
  };
  
  const handleDeleteNavItem = async (id: string) => {
    try {
      await supabase
        .from('nav_items')
        .delete()
        .eq('id', id);
        
      toast.success('Navigation item removed');
      refetchNavItems();
    } catch (error) {
      console.error('Error deleting nav item:', error);
      toast.error('Failed to remove navigation item');
    }
  };
  
  const handleMoveNavItem = async (id: string, direction: 'up' | 'down') => {
    if (!navItems) return;
    
    const currentIndex = navItems.findIndex((item: NavItem) => item.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Check bounds
    if (newIndex < 0 || newIndex >= navItems.length) return;
    
    const item1 = navItems[currentIndex];
    const item2 = navItems[newIndex];
    
    // Swap positions
    try {
      await supabase
        .from('nav_items')
        .update({ position: item2.position })
        .eq('id', item1.id);
        
      await supabase
        .from('nav_items')
        .update({ position: item1.position })
        .eq('id', item2.id);
        
      refetchNavItems();
    } catch (error) {
      console.error('Error reordering nav items:', error);
      toast.error('Failed to reorder navigation items');
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage basic site settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the site will show a maintenance message to visitors
                  </p>
                </div>
                <Switch
                  id="maintenance"
                  checked={maintenanceMode}
                  onCheckedChange={handleMaintenanceModeToggle}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Navigation Settings */}
        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menu</CardTitle>
              <CardDescription>Manage navigation items in the top menu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nav Items List */}
              <div className="space-y-4">
                <h3 className="font-medium">Current Menu Items</h3>
                
                {navItems && navItems.length > 0 ? (
                  <div className="space-y-2">
                    {navItems
                      .filter((item: NavItem) => item.type === 'main')
                      .sort((a: NavItem, b: NavItem) => a.position - b.position)
                      .map((item: NavItem) => (
                        <div key={item.id} className="flex items-center justify-between bg-muted/30 rounded-md p-2">
                          <div className="flex items-center gap-2">
                            <DragHandleDots2Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.label}</span>
                            <span className="text-sm text-muted-foreground">{item.href}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => handleMoveNavItem(item.id, 'up')}
                            >
                              ↑
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => handleMoveNavItem(item.id, 'down')}
                            >
                              ↓
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => handleDeleteNavItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No menu items added yet.</p>
                )}
              </div>
              
              {/* Add New Nav Item */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">Add New Menu Item</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nav-label">Label</Label>
                    <Input 
                      id="nav-label" 
                      placeholder="Products" 
                      value={newNavItem.label}
                      onChange={(e) => setNewNavItem({...newNavItem, label: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nav-href">URL</Label>
                    <Input 
                      id="nav-href" 
                      placeholder="/products" 
                      value={newNavItem.href}
                      onChange={(e) => setNewNavItem({...newNavItem, href: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button onClick={handleAddNavItem}>
                  <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Platforms Settings */}
        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Platforms</CardTitle>
              <CardDescription>Manage available platforms for products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Platforms */}
              <div className="space-y-4">
                <h3 className="font-medium">Current Platforms</h3>
                
                {platforms && platforms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                      <Badge key={platform} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No platforms defined yet.</p>
                )}
              </div>
              
              {/* Add New Platform */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">Add New Platform</h3>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Platform name" 
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                  />
                  <Button onClick={handleAddPlatform}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Categories Settings */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage available categories for products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Categories */}
              <div className="space-y-4">
                <h3 className="font-medium">Current Categories</h3>
                
                {categories && categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No categories defined yet.</p>
                )}
              </div>
              
              {/* Add New Category */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">Add New Category</h3>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Category name" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button onClick={handleAddCategory}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsAdmin;
