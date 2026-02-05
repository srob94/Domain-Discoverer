import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search,
  Crown,
  Shield,
  Bookmark,
  FileSearch
} from "lucide-react";
import { useState } from "react";
import type { AdminUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: users = [], isLoading, refetch } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users", searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, update }: { id: string; update: { isPro?: boolean; isAdmin?: boolean } }) => {
      return apiRequest("PATCH", `/api/admin/users/${id}`, update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User updated" });
    },
    onError: () => {
      toast({ title: "Failed to update user", variant: "destructive" });
    }
  });

  const handleTogglePro = (user: AdminUser) => {
    updateMutation.mutate({ id: user.id, update: { isPro: !user.isPro } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <Badge variant="outline">{users.length} users</Badge>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-testid="input-search-users"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Watchlist</TableHead>
              <TableHead className="text-center">Searches</TableHead>
              <TableHead className="text-center">Created</TableHead>
              <TableHead className="text-center">Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {user.isAdmin && (
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="w-3 h-3" />
                        Admin
                      </Badge>
                    )}
                    {user.isPro ? (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                        <Crown className="w-3 h-3" />
                        Pro
                      </Badge>
                    ) : (
                      <Badge variant="outline">Free</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Bookmark className="w-3 h-3 text-muted-foreground" />
                    {user.watchlistCount}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FileSearch className="w-3 h-3 text-muted-foreground" />
                    {user.savedSearchCount}
                  </div>
                </TableCell>
                <TableCell className="text-center text-muted-foreground text-sm">
                  {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "--"}
                </TableCell>
                <TableCell className="text-center text-muted-foreground text-sm">
                  {user.lastActiveAt ? format(new Date(user.lastActiveAt), "MMM d, yyyy") : "--"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={user.isPro ? "outline" : "default"}
                    onClick={() => handleTogglePro(user)}
                    disabled={user.isAdmin}
                    data-testid={`button-toggle-pro-${user.id}`}
                  >
                    {user.isPro ? "Revoke Pro" : "Grant Pro"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
