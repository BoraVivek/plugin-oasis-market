
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          AddonsHub
        </Link>
        
        <div className="hidden md:flex items-center space-x-6 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for plugins, themes..."
              className="w-full pl-9"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="mr-1">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button className="hidden md:inline-flex">Sign In</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
