import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreBadge } from "@/components/ScoreBadge";
import { SavedSearchCard } from "@/components/SavedSearchCard";
import { SavedSearchModal } from "@/components/SavedSearchModal";
import { ProFeatureLock } from "@/components/ProFeatureLock";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Plus, Eye, Bookmark, Trash2, Search, AlertCircle } from "lucide-react";
import type { SavedSearch, WatchlistItem, InsertSavedSearch } from "@shared/schema";

export default function Watchlist() {
  const { toast } = useToast();
  const { isPro } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    data: savedSearches = [], 
    isLoading: searchesLoading,
    error: searchesError 
  } = useQuery<SavedSearch[]>({
    queryKey: ["/api/saved-searches"]
  });

  const { 
    data: watchlist = [], 
    isLoading: watchlistLoading,
    error: watchlistError 
  } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"]
  });

  const createSearchMutation = useMutation({
    mutationFn: async (search: InsertSavedSearch) => {
      return apiRequest("POST", "/api/saved-searches", search);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-searches"] });
      toast({
        title: "Search created",
        description: "Your saved search has been created"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create saved search",
        variant: "destructive"
      });
    }
  });

  const updateAlertsMutation = useMutation({
    mutationFn: async ({ id, alertsEnabled }: { id: string; alertsEnabled: boolean }) => {
      return apiRequest("PATCH", `/api/saved-searches/${id}/alerts`, { alertsEnabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-searches"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update alerts",
        variant: "destructive"
      });
    }
  });

  const deleteSearchMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/saved-searches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-searches"] });
      toast({
        title: "Search deleted",
        description: "Saved search has been removed"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete saved search",
        variant: "destructive"
      });
    }
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/watchlist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Removed",
        description: "Domain removed from watchlist"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive"
      });
    }
  });

  const handleToggleAlerts = (id: string, enabled: boolean) => {
    updateAlertsMutation.mutate({ id, alertsEnabled: enabled });
  };

  const handleDeleteSearch = (id: string) => {
    deleteSearchMutation.mutate(id);
  };

  const handleRemoveFromWatchlist = (id: string) => {
    removeFromWatchlistMutation.mutate(id);
  };

  const handleSaveSearch = (search: InsertSavedSearch) => {
    createSearchMutation.mutate(search);
  };

  if (searchesError || watchlistError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-destructive/10 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Failed to load data</h3>
        <p className="text-muted-foreground max-w-sm">
          There was an error loading your watchlist. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-primary" />
            Your Watchlist
          </h1>
          <p className="text-muted-foreground mt-1">
            Track domains you care about and act at the right moment. Watched domains update automatically as drop time approaches.
          </p>
        </div>
      </div>

      <ProFeatureLock 
        featureType="saved_searches"
      >
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              Saved Searches
            </h2>
            <Button
              data-testid="button-new-search"
              onClick={() => setIsModalOpen(true)}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Search
            </Button>
          </div>

        {searchesLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-5 w-32 rounded skeleton-shimmer" />
                    <div className="h-5 w-16 rounded-full skeleton-shimmer" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 w-12 rounded-full skeleton-shimmer" />
                    <div className="h-5 w-14 rounded-full skeleton-shimmer" />
                  </div>
                  <div className="h-4 w-24 rounded skeleton-shimmer" />
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                    <div className="h-8 w-20 rounded skeleton-shimmer" />
                    <div className="h-8 w-8 rounded skeleton-shimmer" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : savedSearches.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="p-4 bg-muted rounded-full inline-flex mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No saved searches</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first saved search to never miss drops in your niche.
            </p>
            <Button onClick={() => setIsModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              New Search
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedSearches.map((search) => (
              <SavedSearchCard
                key={search.id}
                search={search}
                onToggleAlerts={handleToggleAlerts}
                onDelete={handleDeleteSearch}
              />
            ))}
          </div>
        )}
        </section>
      </ProFeatureLock>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Eye className="w-5 h-5 text-muted-foreground" />
          Watched Domains
          <span className="text-sm font-normal text-muted-foreground">
            ({watchlist.length})
          </span>
        </h2>

        {watchlistLoading ? (
          <Card className="p-4 animate-fade-in">
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-2 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="h-4 flex-1 rounded skeleton-shimmer" />
                  <div className="h-8 w-8 rounded-full skeleton-shimmer" />
                  <div className="h-4 w-20 rounded skeleton-shimmer" />
                  <div className="h-4 w-16 rounded skeleton-shimmer" />
                  <div className="h-8 w-8 rounded skeleton-shimmer" />
                </div>
              ))}
            </div>
          </Card>
        ) : watchlist.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="p-4 bg-muted rounded-full inline-flex mb-4">
              <Eye className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No watched domains</h3>
            <p className="text-sm text-muted-foreground">
              Start watching domains from the Daily Drop Feed
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead>Drops In</TableHead>
                  <TableHead className="text-right">Renewal</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlist.map((item) => (
                  <TableRow key={item.id} data-testid={`watchlist-row-${item.id}`}>
                    <TableCell className="font-medium">{item.domain.fqdn}</TableCell>
                    <TableCell className="text-center">
                      <ScoreBadge score={item.domain.score} size="sm" />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.domain.dropsIn}</TableCell>
                    <TableCell className="text-right">
                      ${item.domain.renewalPrice.toFixed(2)}/yr
                    </TableCell>
                    <TableCell>
                      <Button
                        data-testid={`remove-watchlist-${item.id}`}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveFromWatchlist(item.id)}
                        disabled={removeFromWatchlistMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>

      <SavedSearchModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveSearch}
      />
    </div>
  );
}
