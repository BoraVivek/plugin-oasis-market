
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { Loader2, ChevronRight, Download, Star, CheckCircle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  
  // Fetch latest products
  const { data: latestProducts, isLoading: isLoadingLatest } = useQuery({
    queryKey: ['homeLatestProducts'],
    queryFn: () => getProducts({
      sort: 'newest',
      limit: 4
    })
  });
  
  // Fetch popular products
  const { data: popularProducts, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['homePopularProducts'],
    queryFn: () => getProducts({
      sort: 'popularity',
      limit: 4
    })
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-foreground overflow-hidden py-20">
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Premium Digital Products Marketplace
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mb-8">
            Discover high-quality WordPress and XenForo plugins, themes, and extensions for your next project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/products')}
              className="bg-white text-primary hover:bg-white/90"
              data-event="hero-browse-products"
            >
              Browse Products
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="bg-transparent border-white text-white hover:bg-white/10"
              data-event="hero-sign-up"
            >
              Sign Up
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 w-full max-w-4xl">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">100+</p>
              <p className="text-white/80">Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10k+</p>
              <p className="text-white/80">Downloads</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">4.8</p>
              <p className="text-white/80">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-white/80">Support</p>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute bottom-0 left-0 transform translate-x-1/2" width="300" height="300" fill="none">
            <circle cx="150" cy="150" r="150" fill="white" fillOpacity="0.05" />
          </svg>
          <svg className="absolute top-0 right-0 transform -translate-x-1/2" width="400" height="400" fill="none">
            <circle cx="200" cy="200" r="200" fill="white" fillOpacity="0.03" />
          </svg>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Latest Releases</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/products?sort=newest')}
              data-event="view-all-latest"
            >
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {isLoadingLatest ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : latestProducts?.data && latestProducts.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.data.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  image={product.image || `https://picsum.photos/seed/${product.id}/600/400`}
                  price={product.price}
                  rating={product.rating || 0}
                  platform={product.platform}
                  category={product.category}
                  author={product.author}
                  sales={product.download_count}
                  version={product.version}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Popular Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Most Popular</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/products?sort=popularity')}
              data-event="view-all-popular"
            >
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {isLoadingPopular ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : popularProducts?.data && popularProducts.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.data.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  image={product.image || `https://picsum.photos/seed/${product.id}/600/400`}
                  price={product.price}
                  rating={product.rating || 0}
                  platform={product.platform}
                  category={product.category}
                  author={product.author}
                  sales={product.download_count}
                  version={product.version}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Marketplace?</h2>
            <p className="text-lg text-muted-foreground">
              We provide high-quality, well-supported digital products for your websites and forums
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">
                All products are carefully reviewed for quality and performance before being listed in our marketplace.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Downloads</h3>
              <p className="text-muted-foreground">
                Get immediate access to your purchases with our instant download system, no waiting required.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
              <p className="text-muted-foreground">
                Our vendors provide dedicated support through our forums, ensuring you get help when you need it.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to find your perfect digital product?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our collection of premium WordPress and XenForo products to enhance your website or forum.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/products')}
              className="bg-white text-primary hover:bg-white/90"
              data-event="cta-browse-products"
            >
              Browse Products
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => window.open('https://support.example.com/forum', '_blank')}
              className="border-white text-white hover:bg-white/10"
              data-event="cta-visit-forum"
            >
              Visit Support Forum
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">MarketPlace</h3>
              <p className="text-sm text-muted-foreground">
                Your source for premium digital products for WordPress and XenForo platforms.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Products</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/products?platform=WordPress" className="text-muted-foreground hover:text-foreground">WordPress Plugins</a></li>
                <li><a href="/products?platform=WordPress&category=Themes" className="text-muted-foreground hover:text-foreground">WordPress Themes</a></li>
                <li><a href="/products?platform=XenForo" className="text-muted-foreground hover:text-foreground">XenForo Addons</a></li>
                <li><a href="/products?platform=XenForo&category=Themes" className="text-muted-foreground hover:text-foreground">XenForo Themes</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://support.example.com/forum" className="text-muted-foreground hover:text-foreground">Support Forum</a></li>
                <li><a href="/faq" className="text-muted-foreground hover:text-foreground">FAQs</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="/refunds" className="text-muted-foreground hover:text-foreground">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MarketPlace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
