import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Sparkles, Crown, Wand2, Lock, ArrowRight, Eye, ExternalLink, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { GeneratedDomain } from "@shared/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Builder() {
  const [keyword, setKeyword] = useState("");
  const [generatedDomains, setGeneratedDomains] = useState<GeneratedDomain[]>([]);
  const [explanation, setExplanation] = useState<{ domain: string; text: string } | null>(null);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const response = await apiRequest("POST", "/api/ai/generate-domains", { keyword, count: 30 });
      return response.json() as Promise<GeneratedDomain[]>;
    },
    onSuccess: (data) => {
      setGeneratedDomains(data);
      toast({
        title: "Domains Generated",
        description: `Generated ${data.length} domain suggestions for "${keyword}"`,
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate domain suggestions. Please try again.",
        variant: "destructive",
      });
    },
  });

  const explainMutation = useMutation({
    mutationFn: async ({ domain, score }: { domain: string; score: number }) => {
      const response = await apiRequest("POST", "/api/ai/explain-score", { domain, score });
      return response.json() as Promise<{ explanation: string }>;
    },
    onSuccess: (data, variables) => {
      setExplanation({ domain: variables.domain, text: data.explanation });
    },
  });

  const handleGenerate = () => {
    if (!keyword.trim()) return;
    setExplanation(null);
    generateMutation.mutate(keyword.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  const handleExplainScore = (domain: string, score: number) => {
    explainMutation.mutate({ domain, score });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            AI Domain Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate high-value domain ideas using AI
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-700 gap-1.5 px-3 py-1.5"
        >
          <Crown className="w-3.5 h-3.5" />
          Pro Feature
        </Badge>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-accent/10 border-primary/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              data-testid="input-keyword"
              type="text"
              placeholder="Enter a keyword or niche (e.g., fintech, health, crypto)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button
            data-testid="button-generate"
            onClick={handleGenerate}
            disabled={!keyword.trim() || generateMutation.isPending}
            className="h-12 px-6 gap-2"
          >
            {generateMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Domains
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Unlock Full AI Power</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Upgrade to Pro for unlimited AI-generated domain suggestions, advanced filters, 
              market value predictions, and priority access to new features.
            </p>
            <Button variant="default" size="sm" className="gap-1.5" data-testid="button-upgrade-pro">
              <Crown className="w-4 h-4" />
              Upgrade to Pro
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {explanation && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                Score Explanation for {explanation.domain}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {explanation.text}
              </p>
            </div>
          </div>
        </Card>
      )}

      {generatedDomains.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Generated Domains
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({generatedDomains.length} suggestions)
              </span>
            </h2>
            <Badge variant="outline" className="text-xs">
              Powered by AI
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {generatedDomains.map((domain, index) => (
              <Card 
                key={domain.fqdn} 
                data-testid={`generated-domain-${index}`}
                className="p-4 hover-elevate transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-foreground">
                      {domain.fqdn}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {domain.reason}
                    </p>
                  </div>
                  <ScoreBadge score={domain.score} size="sm" />
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                  <Badge variant="secondary" className="text-xs">
                    {domain.tld}
                  </Badge>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleExplainScore(domain.fqdn, domain.score)}
                          disabled={explainMutation.isPending}
                          data-testid={`button-explain-${index}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Explain Score</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => window.open(`https://www.namecheap.com/domains/registration/results/?domain=${domain.fqdn}`, '_blank')}
                          data-testid={`button-register-${index}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Check Availability</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
