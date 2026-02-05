import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Sparkles, Crown, Wand2, Lock, ArrowRight, Eye, ExternalLink } from "lucide-react";

const mockGeneratedDomains = [
  { fqdn: "aisynergy.com", score: 87, available: true },
  { fqdn: "quantumleap.io", score: 84, available: true },
  { fqdn: "nexustech.co", score: 82, available: false },
  { fqdn: "cloudpulse.dev", score: 79, available: true },
  { fqdn: "dataforge.ai", score: 91, available: true },
  { fqdn: "cybervault.net", score: 76, available: false }
];

export default function Builder() {
  const [keyword, setKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDomains, setGeneratedDomains] = useState<typeof mockGeneratedDomains>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedDomains(mockGeneratedDomains);
      setHasGenerated(true);
      setIsGenerating(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
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
            disabled={!keyword.trim() || isGenerating}
            className="h-12 px-6 gap-2"
          >
            {isGenerating ? (
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

      {hasGenerated && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Generated Domains
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Demo Results)
              </span>
            </h2>
            <Badge variant="outline" className="text-xs">
              {generatedDomains.filter(d => d.available).length} available
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {generatedDomains.map((domain, index) => (
              <Card 
                key={domain.fqdn} 
                data-testid={`generated-domain-${index}`}
                className={`p-4 transition-all duration-200 ${
                  domain.available 
                    ? "hover-elevate" 
                    : "opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground truncate">
                        {domain.fqdn}
                      </span>
                      {!domain.available && (
                        <Badge variant="secondary" className="text-xs">
                          Taken
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreBadge score={domain.score} size="sm" />
                    {domain.available && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center py-2">
            These are demo results. Upgrade to Pro for real AI-powered domain suggestions.
          </p>
        </section>
      )}
    </div>
  );
}
