import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Search, X, TrendingUp, MessageSquare, Loader2, Crown, Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { apiRequest } from "@/lib/queryClient";
import type { Domain, ConversationSearchResult, ConversationSearchUsage } from "@shared/schema";
import { Link } from "wouter";

interface ConversationSearchProps {
  onDomainSelect?: (domain: Domain) => void;
}

export function ConversationSearch({ onDomainSelect }: ConversationSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<ConversationSearchResult | null>(null);
  const { isLoggedIn, isPro } = useUser();
  const queryClient = useQueryClient();

  const { data: usage } = useQuery<ConversationSearchUsage>({
    queryKey: ["/api/conversation-search/usage"],
    enabled: isLoggedIn,
  });

  const searchMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      const res = await apiRequest("POST", "/api/conversation-search", { query: searchQuery });
      return await res.json() as ConversationSearchResult & { usage: ConversationSearchUsage };
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/conversation-search/usage"] });
    },
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    searchMutation.mutate(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDomainClick = (domain: Domain) => {
    if (onDomainSelect) {
      onDomainSelect(domain);
    }
    setIsOpen(false);
  };

  const clearResults = () => {
    setResult(null);
    setQuery("");
  };

  if (!isLoggedIn) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => window.location.href = "/api/login"}
        data-testid="button-conversation-search-login"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">AI Search</span>
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 relative"
        onClick={() => setIsOpen(true)}
        data-testid="button-conversation-search"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">AI Search</span>
        {usage && (
          <span className="text-xs text-muted-foreground hidden md:inline">
            {usage.limit - usage.count} left
          </span>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Conversation Search
            </DialogTitle>
            <DialogDescription>
              Ask questions naturally like "Find AI .com domains under $30" or "Why is VaultLedger.io scored high?"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="input-conversation-search"
                  placeholder="Ask about domains..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!query.trim() || searchMutation.isPending || (usage && usage.count >= usage.limit)}
                data-testid="button-search-submit"
              >
                {searchMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {usage && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Monthly searches: {usage.count} / {usage.limit}</span>
                {usage.count >= usage.limit && (
                  <Badge variant="destructive" className="gap-1">
                    <Lock className="w-3 h-3" />
                    Limit reached
                  </Badge>
                )}
              </div>
            )}

            {searchMutation.isPending && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Analyzing your query...</span>
              </div>
            )}

            {searchMutation.error && (
              <Card className="border-destructive">
                <CardContent className="pt-4">
                  <p className="text-destructive text-sm">
                    {(searchMutation.error as any)?.message?.includes("429") 
                      ? "You've reached your monthly search limit. Upgrade to Pro for more searches."
                      : (searchMutation.error as any)?.message || "Failed to process your search. Please try again."}
                  </p>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>Understanding</span>
                      <Button variant="ghost" size="icon" onClick={clearResults} data-testid="button-clear-results">
                        <X className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.filters?.explanation || "Searching..."}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(result.filters?.keywords || []).map((kw, i) => (
                        <Badge key={i} variant="secondary">{kw}</Badge>
                      ))}
                      {(result.filters?.tlds || []).map((tld, i) => (
                        <Badge key={i} variant="outline">{tld}</Badge>
                      ))}
                      {result.filters?.minScore && (
                        <Badge variant="outline">Score {result.filters.minScore}+</Badge>
                      )}
                      {result.filters?.maxRenewalPrice && (
                        <Badge variant="outline">${result.filters.maxRenewalPrice} max</Badge>
                      )}
                      {result.filters?.trending && (
                        <Badge className="gap-1"><TrendingUp className="w-3 h-3" /> Trending</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {result.explanation && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
                    </CardContent>
                  </Card>
                )}

                {(result.domains?.length || 0) > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Found {result.domains?.length || 0} domains
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(result.domains || []).map((domain) => (
                          <div
                            key={domain.id}
                            className="flex items-center justify-between p-2 rounded-md hover-elevate cursor-pointer border"
                            onClick={() => handleDomainClick(domain)}
                            data-testid={`result-domain-${domain.id}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{domain.fqdn}</span>
                              <Badge variant="outline" className="text-xs">{domain.tld}</Badge>
                              {domain.trending && (
                                <TrendingUp className="w-3 h-3 text-primary" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">${domain.renewalPrice}/yr</span>
                              <Badge className={domain.score >= 90 ? "bg-green-500" : domain.score >= 80 ? "bg-primary" : "bg-muted"}>
                                {domain.score}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(result.domains?.length || 0) === 0 && !result.explanation && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">No domains match your criteria. Try a broader search.</p>
                    </CardContent>
                  </Card>
                )}

                {result.suggestedSavedSearch && (
                  <Card className="border-primary/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Create Alert from Search
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Want to be notified when new domains match "{result.suggestedSavedSearch.name}"?
                      </p>
                      <Link href="/builder">
                        <Button size="sm" className="gap-2" data-testid="button-create-alert">
                          <Crown className="w-4 h-4" />
                          Create Alert
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Example queries:</p>
              <ul className="space-y-1 pl-4">
                <li>"Find trending .io domains with score above 85"</li>
                <li>"Show me AI domains under $20"</li>
                <li>"Why is VaultLedger.io scored so high?"</li>
                <li>"Alert me when fintech .com drops"</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
