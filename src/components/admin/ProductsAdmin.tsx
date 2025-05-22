
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Trash2, Eye } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/lib/types";
import { getProducts, deleteProduct } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import ProductForm from "./ProductForm";
import VersionManager from "./VersionManager";

const ProductsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminProducts", searchTerm],
    queryFn: () => getProducts({
      search: searchTerm || undefined,
      limit: 100,
    }),
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    setEditingProduct(null);
    setIsCreating(false);
  };

  const products = productsData?.data || [];

  if (editingProduct || isCreating) {
    return (
      <div>
        <Button variant="outline" className="mb-6" onClick={() => {
          setEditingProduct(null);
          setIsCreating(false);
        }}>
          &larr; Back to Products
        </Button>
        <ProductForm
          initialData={editingProduct || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setEditingProduct(null);
            setIsCreating(false);
          }}
        />
      </div>
    );
  }

  if (selectedProductId) {
    return (
      <div>
        <Button variant="outline" className="mb-6" onClick={() => setSelectedProductId(null)}>
          &larr; Back to Products
        </Button>
        <VersionManager productId={selectedProductId} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsCreating(true)} data-event="admin-create-product-click">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            Manage your marketplace products.
          </CardDescription>

          <div className="mt-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-4">Loading products...</div>
          ) : isError ? (
            <div className="text-center text-red-500 p-4">Error loading products</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-[3/2] relative bg-muted">
                    <img
                      src={product.image || `https://picsum.photos/seed/${product.id}/600/400`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold truncate">{product.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.platform} - {product.category}
                        </p>
                      </div>
                      <div className="text-success font-semibold">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.summary || "No description available"}
                    </p>

                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                      <div>Version: {product.version || "1.0.0"}</div>
                      <div>Updated: {formatDate(product.updated_at || "")}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedProductId(product.id)}
                        data-event="admin-manage-versions-click"
                      >
                        Versions
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                        data-event="admin-edit-product-click"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(`/product/${product.id}`, '_blank')}
                        data-event="admin-view-product-click"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        data-event="admin-delete-product-click"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {products.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No products found. Add your first product to get started.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsAdmin;
