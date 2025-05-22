
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { ProductVersion } from '@/lib/types';
import { getProductFileURL, hasUserPurchasedProduct } from '@/lib/api';
import { toast } from 'sonner';

interface ProductDownloadSectionProps {
  productId: string;
  versions: ProductVersion[];
}

const ProductDownloadSection = ({ productId, versions }: ProductDownloadSectionProps) => {
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingVersion, setDownloadingVersion] = useState<string | null>(null);
  
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        const result = await hasUserPurchasedProduct(productId);
        setHasPurchased(result);
      } catch (error) {
        console.error('Error checking purchase status:', error);
        setHasPurchased(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPurchaseStatus();
  }, [productId]);
  
  const handleDownload = async (versionId: string) => {
    if (!hasPurchased) {
      toast.error('You need to purchase this product first');
      return;
    }
    
    try {
      setDownloadingVersion(versionId);
      const fileUrl = await getProductFileURL(versionId);
      if (fileUrl) {
        // Create a temporary anchor element to download the file
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started');
      } else {
        toast.error('File not found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to download file');
    } finally {
      setDownloadingVersion(null);
    }
  };
  
  // Sort versions by date (latest first)
  const sortedVersions = [...(versions || [])].sort((a, b) => {
    return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
  });
  
  const latestVersion = sortedVersions[0];
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!hasPurchased) {
    return (
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-center text-sm text-muted-foreground">
          Purchase this product to access the download files
        </p>
      </div>
    );
  }
  
  if (versions.length === 0) {
    return (
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-center text-sm text-muted-foreground">
          No downloadable files available yet
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Latest version download button */}
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">Latest Version</h4>
            <p className="text-sm text-muted-foreground">v{latestVersion?.version}</p>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => handleDownload(latestVersion.id)}
            disabled={downloadingVersion === latestVersion.id}
          >
            {downloadingVersion === latestVersion.id ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Download className="h-4 w-4 mr-1" />
            )}
            Download Latest
          </Button>
        </div>
      </div>
      
      {/* Previous versions */}
      {sortedVersions.length > 1 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Previous Versions</h4>
          <ul className="space-y-2">
            {sortedVersions.slice(1).map((version) => (
              <li 
                key={version.id} 
                className="flex justify-between items-center p-2 border-b border-border"
              >
                <span className="text-sm">v{version.version}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownload(version.id)}
                  disabled={downloadingVersion === version.id}
                >
                  {downloadingVersion === version.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Download className="h-4 w-4 mr-1" />
                  )}
                  Download
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDownloadSection;
