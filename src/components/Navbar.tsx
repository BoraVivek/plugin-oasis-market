
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
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-xl md:text-2xl">
            DigiMarket
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/?platform=WordPress" className="text-sm font-medium transition-colors hover:text-primary">
              WordPress
            </Link>
            <Link to="/?platform=XenForo" className="text-sm font-medium transition-colors hover:text-primary">
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
                  <Link to="/?category=Plugins" className="w-full cursor-pointer">Plugins</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/?category=Themes" className="w-full cursor-pointer">Themes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/?category=Extensions" className="w-full cursor-pointer">Extensions</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Link to="/wishlist">
            <Button variant="ghost" size="icon">
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
                  <Link to="/profile" className="flex w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex w-full cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist" className="flex w-full cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex w-full cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm" className="gap-1">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center md:hidden">
          <Link to="/cart" className="mr-2">
            <Button variant="ghost" size="icon" className="relative">
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
              <Button variant="ghost" size="icon">
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
                    <Link to="/" className="flex items-center py-3 px-4 rounded-md hover:bg-accent">
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/?platform=WordPress" className="flex items-center py-3 px-4 rounded-md hover:bg-accent">
                      WordPress
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/?platform=XenForo" className="flex items-center py-3 px-4 rounded-md hover:bg-accent">
                      XenForo
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/wishlist" className="flex items-center py-3 px-4 rounded-md hover:bg-accent">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </SheetClose>
                  
                  {user ? (
                    <>
                      <SheetClose asChild>
                        <Link to="/profile" className="flex items-center py-3 px-4 rounded-md hover:bg-accent">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/orders" className="flex items-center py-3 px-4 rounded-md hover:bg-accent">
                          <ListOrderedIcon className="mr-2 h-4 w-4" />
                          Orders
                        </Link>
                      </SheetClose>
                      {user.role === 'admin' && (
                        <SheetClose asChild>
                          <Link to="/dashboard" className="flex items-center py-3 px-4 rounded-md hover:bg-accent">
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
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Link to="/auth" className="flex items-center py-3 px-4 rounded-md hover:bg-accent">
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
