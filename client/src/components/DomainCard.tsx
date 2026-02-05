import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { StatusPill } from "@/components/StatusPill";
import { ProBadgeLock } from "@/components/ProFeatureLock";
import { Clock, Eye, ExternalLink, TrendingUp, AlertTriangle, Users, Zap, Lock } from "lucide-react";
import type { Domain } from "@shared/schema";
import { useUser } from "@/contexts/UserContext";

interface DomainCardProps {
  domain: Domain;
  onWatch?: (domain: Domain) => void;
  onBuy?: (domain: Domain) => void;
  isWatched?: boolean;
}

function getReasonTag(domain: Domain): { label: string; variant: "trending" | "strongBuy" | "solid" } | null {
  if (domain.score >= 90) {
    return { label: "Strong Buy", variant: "strongBuy" };
  }
  if (domain.trending && domain.score >= 80) {
    return { label: "Trending", variant: "trending" };
  }
  if (domain.score >= 85) {
    return { label: "Solid Pick", variant: "solid" };
  }
  return null;
}

function getInvestorCount(domain: Domain): number {
  const baseCount = Math.floor(domain.score / 10);
  if (domain.trending) return baseCount + 5;
  if (domain.premiumRenewal) return Math.max(1, baseCount - 2);
  return baseCount;
}

export function DomainCard({ domain, onWatch, onBuy, isWatched = false }: DomainCardProps) {
  const { isPro, triggerUpgrade } = useUser();
  const reasonTag = getReasonTag(domain);
  const investorCount = getInvestorCount(domain);

  return (
    <Card 
      data-testid={`domain-card-${domain.id}`}
      className="p-4 hover-elevate transition-all duration-200"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 
                data-testid={`domain-name-${domain.id}`}
                className="text-lg font-semibold text-foreground truncate"
              >
                {domain.fqdn}
              </h3>
              {reasonTag && (
                <Badge 
                  variant="secondary"
                  className={
                    reasonTag.variant === "strongBuy" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : reasonTag.variant === "trending"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  }
                >
                  {reasonTag.variant === "trending" && <TrendingUp className="w-3 h-3 mr-1" />}
                  {reasonTag.variant === "strongBuy" && <Zap className="w-3 h-3 mr-1" />}
                  {reasonTag.label}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StatusPill status={domain.status} />
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                Drops in {domain.dropsIn}
              </span>
            </div>
          </div>
          <ScoreBadge score={domain.score} size="lg" />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Renewal</span>
            <span className="text-base font-medium text-foreground">
              ${domain.renewalPrice.toFixed(2)}/yr
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {domain.premiumRenewal && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  Premium
                </span>
              </div>
            )}
            
            {isPro ? (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{investorCount} watching</span>
              </div>
            ) : (
              <button
                onClick={() => triggerUpgrade("See who's watching this domain with Pro")}
                className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                data-testid={`investor-interest-locked-${domain.id}`}
              >
                <Lock className="w-3 h-3" />
                <span>Investor interest</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            data-testid={`watch-button-${domain.id}`}
            variant={isWatched ? "secondary" : "outline"}
            size="sm"
            className="flex-1 transition-all duration-200"
            onClick={() => onWatch?.(domain)}
          >
            <Eye className={`w-4 h-4 mr-1.5 transition-colors duration-200 ${isWatched ? 'text-primary' : ''}`} />
            {isWatched ? "Watching" : "Watch"}
          </Button>
          <Button
            data-testid={`buy-button-${domain.id}`}
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onBuy?.(domain)}
          >
            <ExternalLink className="w-4 h-4 mr-1.5" />
            Buy
          </Button>
        </div>
      </div>
    </Card>
  );
}
