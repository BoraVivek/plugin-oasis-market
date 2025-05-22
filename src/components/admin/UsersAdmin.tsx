
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { User } from "@/lib/types";
import { toast } from "sonner";

const UsersAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Get users from the profiles table
  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["adminUsers", searchTerm],
    queryFn: async () => {
      // Query the profiles table
      let query = supabase.from("profiles").select("*");
      
      if (searchTerm) {
        // Search by first name, last name or email (if email was available in profiles)
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });

  // Function to update user role
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      
      toast.success("User role updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(`Error updating role: ${error.message}`);
    }
  };

  // Get auth users to match with profiles
  const { data: authUsers } = useQuery({
    queryKey: ["authUsers"],
    queryFn: async () => {
      // In a real app, this would use an admin API to get user emails
      // For demo purposes, we'll use a mock approach
      return [];
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading users. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage user accounts and permissions.
          </CardDescription>

          <div className="mt-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage
                            src={user.avatar_url || ""}
                            alt={`${user.first_name || ""} ${user.last_name || ""}`}
                          />
                          <AvatarFallback>
                            {user.first_name ? user.first_name.charAt(0) : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {/* We don't have email in profiles table */}
                            {user.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role || "customer"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <select
                        value={user.role || "customer"}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                        data-event="admin-change-user-role"
                      >
                        <option value="customer">Customer</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersAdmin;
