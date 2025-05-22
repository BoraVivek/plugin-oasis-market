
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import { ArrowRight, Sparkles, Heart, Download, HelpCircle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  
  // Fetch featured products (newest and most popular)
  const { data: featuredProducts } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getProducts({
      limit: 4,
      sort: 'newest'
    }),
  });

  // Fetch popular products
  const { data: popularProducts } = useQuery({
    queryKey: ['popularProducts'],
    queryFn: () => getProducts({
      limit: 4,
      sort: 'popularity'
    }),
  });
  
  return (
    <div className="min-h-screen flex flex-col" data-page="home">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Professional Digital Products <br className="hidden md:block" />
            <span className="text-primary">for Creators</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-2xl mb-8">
            High-quality WordPress and XenForo themes, plugins, and extensions to elevate your online presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8" 
              onClick={() => navigate('/') } 
              data-event="browse-products-click"
            >
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')} 
              data-event="join-marketplace-click"
            >
              Join Our Marketplace
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-background" data-section="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">
                All our products pass through rigorous quality checks to ensure the best user experience.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lifetime Updates</h3>
              <p className="text-muted-foreground">
                Purchase once and receive lifetime updates with new features and security patches.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
              <p className="text-muted-foreground">
                Our support team is always ready to help you with any questions or issues.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* New Releases Section */}
      <section className="py-16 bg-muted/30" data-section="new-releases">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">New Releases</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/?sort=newest')}
              data-event="view-all-new-click"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.data.map((product: Product) => (
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
              />
            ))}
            
            {!featuredProducts?.data.length && (
              <div className="col-span-4 text-center py-12">
                <p className="text-muted-foreground">No products found. Check back soon for new releases!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Popular Products Section */}
      <section className="py-16 bg-background" data-section="popular-products">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Popular Products</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/?sort=popularity')}
              data-event="view-all-popular-click"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts?.data.map((product: Product) => (
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
              />
            ))}
            
            {!popularProducts?.data.length && (
              <div className="col-span-4 text-center py-12">
                <p className="text-muted-foreground">No products found. Check back soon for popular items!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Support Section */}
      <section className="py-16 bg-primary/5" data-section="support">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our support team is ready to assist you with any questions about our products or services.
          </p>
          <Button 
            size="lg" 
            variant="default" 
            onClick={() => window.open('https://support.example.com', '_blank')}
            data-event="visit-forum-click"
          >
            Visit Support Forum
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-12 mt-auto" data-section="footer">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">DigiMarket</h3>
              <p className="text-muted-foreground">
                Premium digital products for WordPress and XenForo platforms.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Products</h3>
              <ul className="space-y-2">
                <li><a href="/?platform=WordPress" className="text-muted-foreground hover:text-primary">WordPress</a></li>
                <li><a href="/?platform=XenForo" className="text-muted-foreground hover:text-primary">XenForo</a></li>
                <li><a href="/?category=Plugins" className="text-muted-foreground hover:text-primary">Plugins</a></li>
                <li><a href="/?category=Themes" className="text-muted-foreground hover:text-primary">Themes</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="https://support.example.com" target="_blank" className="text-muted-foreground hover:text-primary">Support Forum</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">FAQs</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} DigiMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
