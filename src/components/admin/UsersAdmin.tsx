
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
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          email:id (
            email:auth.users!id(email),
            created_at:auth.users!id(created_at)
          )
        `);
      
      if (error) throw error;
      return profiles;
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

  const getUserEmail = (user: any) => {
    if (user.email && user.email[0] && user.email[0].email) {
      return user.email[0].email;
    }
    return 'No email';
  };

  const getCreatedAt = (user: any) => {
    if (user.email && user.email[0] && user.email[0].created_at) {
      return formatDate(user.email[0].created_at);
    }
    return formatDate(user.created_at);
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
                  const email = getUserEmail(user);
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
                            <div className="text-sm text-muted-foreground">{email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>{getCreatedAt(user)}</TableCell>
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
