import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, X, ArrowRight } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const BANNER_DISMISSED_KEY = "tld_watchlist_banner_dismissed";

interface WatchlistBannerProps {
  watchCount: number;
}

export function WatchlistBanner({ watchCount }: WatchlistBannerProps) {
  const { isPro, triggerUpgrade } = useUser();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(BANNER_DISMISSED_KEY) === "true"
  );

  if (isPro || dismissed || watchCount < 2) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
  };

  return (
    <Card
      className="p-4 bg-gradient-to-r from-primary/5 to-accent/10 border-primary/20 mb-4 animate-fade-in-up"
      data-testid="watchlist-upsell-banner"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-full shrink-0 mt-0.5">
          <Bell className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            Want alerts before these domains drop?
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pro investors get notified automatically when watched domains are about to drop.
          </p>
          <Button
            size="sm"
            className="mt-3 gap-1.5"
            onClick={() => triggerUpgrade("Get drop alerts for your watched domains")}
            data-testid="button-watchlist-upsell"
          >
            Start Pro Trial
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="shrink-0"
          data-testid="button-dismiss-watchlist-banner"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
