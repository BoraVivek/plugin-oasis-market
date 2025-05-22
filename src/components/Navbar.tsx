
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Menu, ShoppingCart, Heart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface NavItem {
  id: string;
  label: string;
  href: string;
  position: number;
}

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { totalItems: cartItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Fetch nav items from Supabase
  const { data: navItems = [] } = useQuery({
    queryKey: ['navItems'],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from('nav_items')
          .select('*')
          .eq('type', 'main')
          .order('position', { ascending: true });
        
        return data || [];
      } catch (error) {
        console.error('Error loading nav items:', error);
        return [];
      }
    }
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };
  
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" data-event="mobile-menu-open">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="mb-6">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-4">
              {navItems.map((item: NavItem) => (
                <Link 
                  key={item.id}
                  to={item.href}
                  className="flex items-center py-2 text-lg"
                  data-event="mobile-nav-item-click"
                  data-event-label={item.label}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 mr-6"
          data-event="logo-click"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="font-bold text-xl hidden sm:inline-block">MarketPlace</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 flex-1">
          {navItems.map((item: NavItem) => (
            <Link 
              key={item.id}
              to={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
              data-event="desktop-nav-item-click"
              data-event-label={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Search Bar */}
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
              <Input
                id="search-input"
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                data-event="search-submit-button-click"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchToggle}
              data-event="search-toggle-button-click"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          {/* Wishlist */}
          <Link to="/wishlist">
            <Button 
              variant="ghost" 
              size="icon"
              data-event="wishlist-button-click"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {wishlistItems}
                </Badge>
              )}
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart">
            <Button 
              variant="ghost" 
              size="icon"
              data-event="cart-button-click"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItems}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full" 
                  aria-label="User menu"
                  data-event="user-menu-button-click"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.avatar_url || ""} />
                    <AvatarFallback>
                      {user.first_name?.[0] || user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">
                    {user.first_name ? `${user.first_name} ${user.last_name || ""}` : user.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => navigate("/profile")}
                  data-event="user-menu-profile-click"
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate("/orders")}
                  data-event="user-menu-orders-click"
                >
                  Orders
                </DropdownMenuItem>
                {(user.role === "admin" || user.role === "vendor") && (
                  <DropdownMenuItem 
                    onClick={() => navigate("/dashboard")}
                    data-event="user-menu-dashboard-click"
                  >
                    Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  data-event="user-menu-signout-click"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/auth")}
              data-event="signin-button-click"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
