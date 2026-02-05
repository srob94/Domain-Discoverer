import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Eye, 
  EyeOff, 
  Flag, 
  Star,
  Search,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import type { AdminDomain } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function AdminDomains() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: domains = [], isLoading } = useQuery<AdminDomain[]>({
    queryKey: ["/api/admin/domains"]
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, update }: { id: string; update: Partial<AdminDomain> }) => {
      return apiRequest("PATCH", `/api/admin/domains/${id}`, update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/domains"] });
      toast({ title: "Domain updated" });
    },
    onError: () => {
      toast({ title: "Failed to update domain", variant: "destructive" });
    }
  });

  const filteredDomains = domains.filter(d => 
    d.fqdn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id: string, field: keyof Pick<AdminDomain, "isHidden" | "isFlagged" | "isFeatured">, currentValue: boolean) => {
    updateMutation.mutate({ id, update: { [field]: !currentValue } });
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
        <h1 className="text-2xl font-bold text-foreground">Domain Management</h1>
        <Badge variant="outline">{domains.length} domains</Badge>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-testid="input-search-domains"
            placeholder="Search domains..."
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
              <TableHead>Domain</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">TLD</TableHead>
              <TableHead className="text-center">Renewal</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDomains.map((domain) => (
              <TableRow key={domain.id} data-testid={`row-domain-${domain.id}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {domain.fqdn}
                    {domain.isFeatured && (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </Badge>
                    )}
                    {domain.isFlagged && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Flagged
                      </Badge>
                    )}
                    {domain.isHidden && (
                      <Badge variant="secondary" className="gap-1">
                        <EyeOff className="w-3 h-3" />
                        Hidden
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={domain.score >= 85 ? "default" : "secondary"}>
                    {domain.score}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={domain.status === "dropping" ? "default" : "outline"}>
                    {domain.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {domain.tld}
                </TableCell>
                <TableCell className="text-center">
                  <span className={domain.premiumRenewal ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                    ${domain.renewalPrice}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant={domain.isHidden ? "default" : "ghost"}
                      onClick={() => handleToggle(domain.id, "isHidden", domain.isHidden)}
                      data-testid={`button-toggle-hidden-${domain.id}`}
                    >
                      {domain.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant={domain.isFlagged ? "destructive" : "ghost"}
                      onClick={() => handleToggle(domain.id, "isFlagged", domain.isFlagged)}
                      data-testid={`button-toggle-flagged-${domain.id}`}
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={domain.isFeatured ? "default" : "ghost"}
                      onClick={() => handleToggle(domain.id, "isFeatured", domain.isFeatured)}
                      className={domain.isFeatured ? "bg-amber-500 hover:bg-amber-600" : ""}
                      data-testid={`button-toggle-featured-${domain.id}`}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
