
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  Heart,
  LogIn,
  LogOut,
  User,
  Package,
  Settings,
  ListOrderedIcon,
  LayoutDashboard,
  HelpCircle,
  Home,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-xl md:text-2xl text-primary">
            DigiMarket
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              <Home className="h-4 w-4 inline mr-1" />
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
              All Products
            </Link>
            <Link to="/products?platform=WordPress" className="text-sm font-medium transition-colors hover:text-primary">
              WordPress
            </Link>
            <Link to="/products?platform=XenForo" className="text-sm font-medium transition-colors hover:text-primary">
              XenForo
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/products?category=Plugins" className="w-full cursor-pointer">Plugins</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products?category=Themes" className="w-full cursor-pointer">Themes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products?category=Extensions" className="w-full cursor-pointer">Extensions</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link 
              to="#" 
              onClick={() => window.open('https://support.example.com', '_blank')}
              className="text-sm font-medium transition-colors hover:text-primary flex items-center"
              data-event="navbar-support-click"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Support
            </Link>
          </nav>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex w-full max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative" data-event="navbar-cart-click">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" data-event="navbar-wishlist-click">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} alt={user.first_name || user.email} />
                    <AvatarFallback>
                      {(user.first_name?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex w-full cursor-pointer" data-event="navbar-profile-click">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex w-full cursor-pointer" data-event="navbar-orders-click">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist" className="flex w-full cursor-pointer" data-event="navbar-wishlist-dropdown-click">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex w-full cursor-pointer" data-event="navbar-dashboard-click">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" data-event="navbar-logout-click">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm" className="gap-1" data-event="navbar-signin-click">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center md:hidden">
          <Link to="/cart" className="mr-2">
            <Button variant="ghost" size="icon" className="relative" data-event="navbar-mobile-cart-click">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-event="navbar-mobile-menu-click">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <form onSubmit={handleSearch} className="relative mb-6">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                
                <div className="flex flex-col">
                  <SheetClose asChild>
                    <Link to="/" className="flex items-center py-3 px-4 rounded-md hover:bg-accent" data-event="navbar-mobile-home-click">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/products" className="flex items-center py-3 px-4 rounded-md hover:bg-accent" data-event="navbar-mobile-products-click">
                      All Products
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/products?platform=WordPress" className="flex items-center py-3 px-4 rounded-md hover:bg-accent" data-event="navbar-mobile-wordpress-click">
                      WordPress
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/products?platform=XenForo" className="flex items-center py-3 px-4 rounded-md hover:bg-accent" data-event="navbar-mobile-xenforo-click">
                      XenForo
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/wishlist" className="flex items-center py-3 px-4 rounded-md hover:bg-accent" data-event="navbar-mobile-wishlist-click">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="#" 
                      onClick={() => window.open('https://support.example.com', '_blank')}
                      className="flex items-center py-3 px-4 rounded-md hover:bg-accent"
                      data-event="navbar-mobile-support-click"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Support
                    </Link>
                  </SheetClose>
                  
                  {user ? (
                    <>
                      <SheetClose asChild>
                        <Link to="/profile" className="flex items-center py-3 px-4 rounded-md hover:bg-accent" data-event="navbar-mobile-profile-click">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/orders" className="flex items-center py-3 px-4 rounded-md hover:bg-accent" data-event="navbar-mobile-orders-click">
                          <ListOrderedIcon className="mr-2 h-4 w-4" />
                          Orders
                        </Link>
                      </SheetClose>
                      {user.role === 'admin' && (
                        <SheetClose asChild>
                          <Link to="/dashboard" className="flex items-center py-3 px-4 rounded-md hover:bg-accent" data-event="navbar-mobile-dashboard-click">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </SheetClose>
                      )}
                      <SheetClose asChild>
                        <Button 
                          variant="ghost" 
                          className="justify-start px-4"
                          onClick={handleLogout}
                          data-event="navbar-mobile-logout-click"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Link to="/auth" className="flex items-center py-3 px-4 rounded-md hover:bg-accent" data-event="navbar-mobile-signin-click">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
