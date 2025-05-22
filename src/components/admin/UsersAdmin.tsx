
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, UserCog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';

const UsersAdmin = () => {
  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      // Using separate queries instead of joins to avoid TypeScript parsing errors
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      
      // Fetch emails separately for each user
      if (profiles && profiles.length > 0) {
        const userIds = profiles.map(profile => profile.id);
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        
        // Merge the data
        return profiles.map(profile => {
          const authUser = authUsers?.users?.find(user => user.id === profile.id);
          return {
            ...profile,
            email: authUser?.email || 'No email',
            authCreatedAt: authUser?.created_at || profile.created_at
          };
        });
      }
      
      return profiles || [];
    }
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default">Admin</Badge>;
      case 'vendor':
        return <Badge variant="secondary">Vendor</Badge>;
      default:
        return <Badge variant="outline">Customer</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage users and their roles in your marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => {
                  const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Anonymous';
                  const initials = name.substring(0, 2).toUpperCase();
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || undefined} alt={name} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role || 'customer')}
                      </TableCell>
                      <TableCell>{formatDate(user.authCreatedAt || user.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <UserCog className="mr-2 h-4 w-4" />
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {users?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersAdmin;
