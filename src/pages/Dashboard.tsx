
import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronRight
} from 'lucide-react';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '@/components/ui/resizable';

import ProductsAdmin from '@/components/admin/ProductsAdmin';
import OrdersAdmin from '@/components/admin/OrdersAdmin';
import UsersAdmin from '@/components/admin/UsersAdmin';
import SettingsAdmin from '@/components/admin/SettingsAdmin';
import DashboardHome from '@/components/admin/DashboardHome';

const Dashboard = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Package, label: 'Products', path: '/dashboard/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/dashboard/orders' },
    { icon: Users, label: 'Users', path: '/dashboard/users' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 py-2 mb-6">
        <h2 className="font-semibold text-lg">Admin Dashboard</h2>
      </div>
      <div className="space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-auto px-4 py-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate('/')}
        >
          <ChevronRight className="mr-2 h-4 w-4" />
          Back to Store
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal">
          {/* Sidebar - Desktop */}
          <ResizablePanel 
            defaultSize={20} 
            minSize={15}
            maxSize={25}
            className="hidden md:block border-r"
          >
            <SidebarContent />
          </ResizablePanel>
          
          <ResizableHandle className="hidden md:flex" />
          
          {/* Main Content */}
          <ResizablePanel defaultSize={80}>
            <div className="p-6">
              {/* Sidebar - Mobile Toggle */}
              <div className="md:hidden mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Menu
                </Button>
                
                {isMobileSidebarOpen && (
                  <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                    <div className="fixed left-0 top-0 h-full w-3/4 max-w-sm bg-background shadow-lg">
                      <SidebarContent />
                    </div>
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setIsMobileSidebarOpen(false)}
                    />
                  </div>
                )}
              </div>
              
              <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/products" element={<ProductsAdmin />} />
                <Route path="/orders" element={<OrdersAdmin />} />
                <Route path="/users" element={<UsersAdmin />} />
                <Route path="/settings" element={<SettingsAdmin />} />
              </Routes>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Dashboard;
