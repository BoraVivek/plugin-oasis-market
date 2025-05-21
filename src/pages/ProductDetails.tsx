
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import ProductTabs from "@/components/ProductTabs";
import ProductSidebar from "@/components/ProductSidebar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight, FileText } from "lucide-react";

// Sample product data - in a real app, you'd fetch this based on productId
const sampleProductData = {
  id: "1",
  title: "WooCommerce Advanced Product Filter",
  version: "2.4.5",
  image: "https://picsum.photos/seed/product1/800/400",
  summary: "The most powerful and customizable product filter for WooCommerce. Boost your store's user experience with real-time ajax filtering, price sliders, and attribute selection.",
  price: 49.99,
  description: `
    <p>Transform your WooCommerce store with the most powerful filtering solution available. Our Advanced Product Filter plugin empowers your customers to find exactly what they're looking for with minimal effort.</p>
    <h3>Key Features</h3>
    <ul>
      <li><strong>AJAX Live Filtering</strong> - Update results instantly without page reloads</li>
      <li><strong>Multiple Filter Types</strong> - Checkboxes, radio buttons, dropdowns, and sliders</li>
      <li><strong>Price Range Sliders</strong> - Let customers filter by their budget</li>
      <li><strong>Attribute Filtering</strong> - Filter by any product attribute</li>
      <li><strong>Category Filtering</strong> - Narrow down by product categories</li>
      <li><strong>Tag Filtering</strong> - Find products with specific tags</li>
      <li><strong>Custom Fields Support</strong> - Filter by any custom field</li>
      <li><strong>Responsive Design</strong> - Works perfectly on all devices</li>
    </ul>
    <h3>Technical Details</h3>
    <p>Built with performance in mind, this plugin uses the latest web technologies to ensure fast loading times even with thousands of products.</p>
    <p>Compatible with all major themes and plugins including Elementor, Divi, WPBakery, and more.</p>
  `,
  versions: [
    {
      version: "2.4.5",
      date: "April 15, 2023",
      changes: [
        "Fixed compatibility issue with WooCommerce 7.5",
        "Improved AJAX response time by 15%",
        "Added support for custom taxonomy filtering"
      ]
    },
    {
      version: "2.4.0",
      date: "February 20, 2023",
      changes: [
        "Added new slider design options",
        "Introduced filter presets feature",
        "Improved mobile responsiveness",
        "Fixed CSS conflicts with Twenty Twenty-Three theme"
      ]
    },
    {
      version: "2.3.2",
      date: "December 5, 2022",
      changes: [
        "Security updates",
        "Performance optimizations",
        "Fixed PHP 8.1 deprecation notices"
      ]
    }
  ],
  reviews: [
    {
      id: "r1",
      author: "Mike Johnson",
      avatar: "https://i.pravatar.cc/100?img=1",
      rating: 5,
      date: "March 28, 2023",
      content: "This plugin has completely transformed my online store. Customers can now find products so much easier and my sales have increased by 20% since installing it. Amazing support too!"
    },
    {
      id: "r2",
      author: "Sarah Wilson",
      avatar: "https://i.pravatar.cc/100?img=2",
      rating: 4,
      date: "February 12, 2023",
      content: "Very good filter plugin with lots of options. The only reason I'm not giving it 5 stars is that the initial setup was a bit complicated. Once you get it configured though, it works perfectly."
    },
    {
      id: "r3",
      author: "David Chen",
      avatar: "https://i.pravatar.cc/100?img=3",
      rating: 5,
      date: "January 5, 2023",
      content: "Best filtering solution I've found for WooCommerce. The AJAX filtering is super fast and I love how it integrates with my existing theme without any conflicts."
    }
  ],
  discussionUrl: "https://forums.example.com/threads/woocommerce-advanced-product-filter-discussion",
  downloadCount: 12543,
  rating: 4.8,
  reviewCount: 86,
  platform: "WordPress" as const,
  category: "Plugins",
  author: "CodeMaster",
  releaseDate: "November 10, 2021",
  lastUpdate: "April 15, 2023",
  tags: ["eCommerce", "WooCommerce", "Filter", "AJAX", "Product"]
};

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  
  // In a real app, you would fetch the product data based on the ID
  const product = sampleProductData; // For this example, we'll use the sample data
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/platform/${product.platform.toLowerCase()}`}>
                {product.platform}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${product.category.toLowerCase()}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <Badge variant="outline" className="h-6">v{product.version}</Badge>
          </div>
          <p className="text-muted-foreground">by <span className="text-primary hover:underline cursor-pointer">{product.author}</span></p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-lg overflow-hidden border border-border">
              <img src={product.image} alt={product.title} className="w-full h-auto" />
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <p className="text-lg">{product.summary}</p>
              </div>
            </div>
            
            <ProductTabs 
              description={product.description}
              versions={product.versions}
              reviews={product.reviews}
              discussionUrl={product.discussionUrl}
            />
          </div>
          
          <div>
            <div className="sticky top-24">
              <ProductSidebar 
                price={product.price}
                downloadCount={product.downloadCount}
                rating={product.rating}
                reviewCount={product.reviewCount}
                platform={product.platform}
                category={product.category}
                releaseDate={product.releaseDate}
                lastUpdate={product.lastUpdate}
                tags={product.tags}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
