import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/ScoreBadge";
import { StatusPill } from "@/components/StatusPill";
import { Clock, Eye, ExternalLink, TrendingUp, AlertTriangle } from "lucide-react";
import type { Domain } from "@shared/schema";

interface DomainCardProps {
  domain: Domain;
  onWatch?: (domain: Domain) => void;
  onBuy?: (domain: Domain) => void;
  isWatched?: boolean;
}

export function DomainCard({ domain, onWatch, onBuy, isWatched = false }: DomainCardProps) {
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
              {domain.trending && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </span>
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
          
          {domain.premiumRenewal && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Premium Renewal
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            data-testid={`watch-button-${domain.id}`}
            variant={isWatched ? "secondary" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => onWatch?.(domain)}
          >
            <Eye className="w-4 h-4 mr-1.5" />
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
