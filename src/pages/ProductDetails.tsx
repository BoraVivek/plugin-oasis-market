
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from "@/components/Navbar";
import ProductTabs from "@/components/ProductTabs";
import ProductSidebar from "@/components/ProductSidebar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight, FileText, Loader2 } from "lucide-react";
import { getProductById, getProductVersions, getProductReviews } from '@/lib/api';
import { Button } from '@/components/ui/button';

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const { 
    data: product, 
    isLoading: isLoadingProduct,
    error: productError
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId
  });
  
  const { 
    data: versions, 
    isLoading: isLoadingVersions 
  } = useQuery({
    queryKey: ['productVersions', productId],
    queryFn: () => getProductVersions(productId!),
    enabled: !!productId
  });
  
  const { 
    data: reviews, 
    isLoading: isLoadingReviews 
  } = useQuery({
    queryKey: ['productReviews', productId],
    queryFn: () => getProductReviews(productId!),
    enabled: !!productId
  });

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }
  
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
              <BreadcrumbLink href={`/?platform=${product.platform}`}>
                {product.platform}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/?category=${product.category}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            {product.version && (
              <Badge variant="outline" className="h-6">v{product.version}</Badge>
            )}
          </div>
          <p className="text-muted-foreground">by <span className="text-primary hover:underline cursor-pointer">{product.author}</span></p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-lg overflow-hidden border border-border">
              <img 
                src={product.image || `https://picsum.photos/seed/${product.id}/800/400`} 
                alt={product.title} 
                className="w-full h-auto"
              />
            </div>
            
            {product.summary && (
              <div className="bg-white p-5 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-lg">{product.summary}</p>
                </div>
              </div>
            )}
            
            <ProductTabs 
              description={product.description || ''}
              versions={versions || []}
              reviews={reviews || []}
              discussionUrl={undefined}
            />
          </div>
          
          <div>
            <div className="sticky top-24">
              <ProductSidebar 
                price={product.price}
                downloadCount={product.download_count || 0}
                rating={product.rating || 0}
                reviewCount={product.review_count || 0}
                platform={product.platform}
                category={product.category}
                releaseDate={product.release_date || ''}
                lastUpdate={product.last_update || ''}
                tags={product.tags || []}
                productId={product.id}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
