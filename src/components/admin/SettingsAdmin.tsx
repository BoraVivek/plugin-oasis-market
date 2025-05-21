
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const SettingsAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveGeneralSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('General settings saved successfully');
    }, 1000);
  };
  
  const handleSavePaymentSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Payment settings saved successfully');
    }, 1000);
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your store's general settings and configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input id="store-name" defaultValue="Digital Marketplace" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Input id="store-description" defaultValue="Premium WordPress and XenForo products" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@example.com" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings} disabled={isLoading}>
                Save General Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment gateways and checkout options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">Accept credit card payments</p>
                  </div>
                  <Switch id="stripe-enabled" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stripe-public-key">Stripe Public Key</Label>
                  <Input id="stripe-public-key" type="text" placeholder="pk_..." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
                  <Input id="stripe-secret-key" type="password" placeholder="sk_..." />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                  </div>
                  <Switch id="paypal-enabled" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
                  <Input id="paypal-client-id" type="text" placeholder="Client ID" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paypal-secret">PayPal Secret</Label>
                  <Input id="paypal-secret" type="password" placeholder="Secret" />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Currency Settings</p>
                    <p className="text-sm text-muted-foreground">Configure your store's currency</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      defaultValue="USD"
                    >
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency-position">Symbol Position</Label>
                    <select
                      id="currency-position"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      defaultValue="before"
                    >
                      <option value="before">Before - $10.00</option>
                      <option value="after">After - 10.00$</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePaymentSettings} disabled={isLoading}>
                Save Payment Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email notifications and alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Order Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for new orders</p>
                </div>
                <Switch id="order-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New User Registrations</p>
                  <p className="text-sm text-muted-foreground">Receive notifications when a new user registers</p>
                </div>
                <Switch id="user-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Reviews</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for new product reviews</p>
                </div>
                <Switch id="review-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for low stock items</p>
                </div>
                <Switch id="stock-notifications" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsAdmin;
