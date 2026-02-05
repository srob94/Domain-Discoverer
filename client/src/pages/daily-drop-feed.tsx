import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { DomainCard } from "@/components/DomainCard";
import { FilterBar } from "@/components/FilterBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { TrendingUp, Calendar, AlertCircle } from "lucide-react";
import type { Domain, DomainFilters, WatchlistItem } from "@shared/schema";

const FREE_WATCHLIST_LIMIT = 10;

interface DailyDropFeedProps {
  searchQuery: string;
}

export default function DailyDropFeed({ searchQuery }: DailyDropFeedProps) {
  const { toast } = useToast();
  const { isPro, triggerUpgrade } = useUser();
  const [filters, setFilters] = useState<DomainFilters>({
    tld: "all",
    minScore: 75,
    premiumOnly: false,
    searchQuery: ""
  });

  const { data: domains = [], isLoading, error } = useQuery<Domain[]>({
    queryKey: ["/api/domains"]
  });

  const { data: watchlist = [] } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"]
  });

  const watchedDomainIds = new Set(watchlist.map((item) => item.domain.id));

  const addToWatchlistMutation = useMutation({
    mutationFn: async (domainId: string) => {
      return apiRequest("POST", "/api/watchlist", { domainId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Added to watchlist",
        description: "Domain is now being tracked"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive"
      });
    }
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (watchlistItemId: string) => {
      return apiRequest("DELETE", `/api/watchlist/${watchlistItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Removed from watchlist",
        description: "Domain is no longer being tracked"
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

  const filteredDomains = useMemo(() => {
    return domains.filter((domain) => {
      if (filters.tld !== "all" && domain.tld !== filters.tld) return false;
      if (domain.score < filters.minScore) return false;
      if (filters.premiumOnly && !domain.premiumRenewal) return false;
      if (searchQuery && !domain.fqdn.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.score - a.score);
  }, [domains, filters, searchQuery]);

  const handleWatch = (domain: Domain) => {
    const watchlistItem = watchlist.find((item) => item.domain.id === domain.id);
    if (watchlistItem) {
      removeFromWatchlistMutation.mutate(watchlistItem.id);
    } else {
      if (!isPro && watchlist.length >= FREE_WATCHLIST_LIMIT) {
        triggerUpgrade(`You've reached your ${FREE_WATCHLIST_LIMIT} domain watchlist limit. Upgrade to Pro for unlimited watchlist items.`);
        return;
      }
      addToWatchlistMutation.mutate(domain.id);
    }
  };

  const handleBuy = (domain: Domain) => {
    window.open(`https://www.namecheap.com/domains/registration/results/?domain=${domain.fqdn}`, "_blank");
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-destructive/10 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Failed to load domains</h3>
        <p className="text-muted-foreground max-w-sm">
          There was an error loading the domain feed. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-primary" />
            Daily Drop Feed
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Top domains dropping soon • Updated {today}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
          <span className="font-medium text-foreground">{filteredDomains.length}</span>
          domains found
        </div>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : filteredDomains.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No domains found</h3>
          <p className="text-muted-foreground max-w-sm">
            Try adjusting your filters or search query to find more domains.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDomains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              isWatched={watchedDomainIds.has(domain.id)}
              onWatch={handleWatch}
              onBuy={handleBuy}
            />
          ))}
        </div>
      )}
    </div>
  );
}
