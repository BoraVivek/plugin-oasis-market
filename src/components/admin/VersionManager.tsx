
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProductById, getProductVersions, addProductVersion, uploadProductFile } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface VersionManagerProps {
  productId: string;
}

const VersionManager = ({ productId }: VersionManagerProps) => {
  const queryClient = useQueryClient();
  const [version, setVersion] = useState('');
  const [changes, setChanges] = useState('');
  const [changesList, setChangesList] = useState<string[]>([]);
  const [versionFile, setVersionFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: product,
    isLoading: isLoadingProduct,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
  });

  const {
    data: versions,
    isLoading: isLoadingVersions,
  } = useQuery({
    queryKey: ['productVersions', productId],
    queryFn: () => getProductVersions(productId),
  });

  const addVersionMutation = useMutation({
    mutationFn: async () => {
      if (!version) {
        throw new Error('Version is required');
      }

      // Add version to db
      const newVersion = await addProductVersion({
        product_id: productId,
        version,
        date: new Date().toISOString(),
        changes: changesList.length > 0 ? changesList : undefined,
      });
      
      // Upload file if present
      if (versionFile && newVersion) {
        setIsUploading(true);
        try {
          await uploadProductFile(newVersion.id, versionFile);
        } finally {
          setIsUploading(false);
        }
      }
      
      return newVersion;
    },
    onSuccess: () => {
      toast.success('Version added successfully');
      setVersion('');
      setChanges('');
      setChangesList([]);
      setVersionFile(null);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['productVersions', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onError: (error: any) => {
      toast.error(`Failed to add version: ${error.message}`);
    },
  });

  const handleAddChange = () => {
    if (changes.trim()) {
      setChangesList([...changesList, changes.trim()]);
      setChanges('');
    }
  };

  const handleRemoveChange = (index: number) => {
    setChangesList(changesList.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVersionFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (changes.trim()) {
      handleAddChange(); // Add any pending change
    }
    addVersionMutation.mutate();
  };

  if (isLoadingProduct || isLoadingVersions) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Version Manager</h1>
        <p className="text-muted-foreground">
          Manage versions for{' '}
          <span className="font-medium text-foreground">{product?.title}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Version Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Version</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version Number*</Label>
                  <Input
                    id="version"
                    placeholder="e.g., 1.2.0"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">Version File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      ref={fileInputRef}
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {versionFile ? 'Change File' : 'Upload File'}
                    </Button>
                  </div>
                  {versionFile && (
                    <div className="text-sm mt-1 truncate">
                      {versionFile.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changes">Changelog</Label>
                  <div className="flex items-start gap-2">
                    <Textarea
                      id="changes"
                      placeholder="e.g., Fixed a bug with..."
                      value={changes}
                      onChange={(e) => setChanges(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddChange}
                      disabled={!changes.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {changesList.length > 0 && (
                  <div className="space-y-2">
                    <Label>Changelog Items</Label>
                    <ul className="space-y-1 list-disc list-inside">
                      {changesList.map((change, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                          <span className="truncate flex-1">{change}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveChange(index)}
                            className="h-6 w-6 p-0"
                          >
                            &times;
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!version.trim() || addVersionMutation.isPending || isUploading}
                >
                  {addVersionMutation.isPending || isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add Version'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Versions List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              {versions && versions.length > 0 ? (
                <div className="space-y-4">
                  {versions
                    .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
                    .map((version) => (
                      <div key={version.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-lg font-medium">
                            v{version.version}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(version.date || '')}
                          </span>
                        </div>
                        
                        {version.changes && version.changes.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium mb-1">Changes:</h4>
                            <ul className="list-disc list-inside text-sm">
                              {version.changes.map((change, index) => (
                                <li key={index}>{change}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {version.file_path && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">File:</span> Available for download
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No versions have been added yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VersionManager;
