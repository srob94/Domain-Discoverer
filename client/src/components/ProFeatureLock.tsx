import { Button } from "@/components/ui/button";
import { Crown, Lock, Zap } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Link } from "wouter";

type FeatureType = 
  | "watchlist_limit"
  | "saved_searches"
  | "alerts"
  | "ai_builder"
  | "trend_signals"
  | "investor_interest"
  | "portfolio"
  | "generic";

interface FeatureGatingContent {
  title: string;
  description: string;
  buttonText: string;
  proFeatures?: string[];
}

const gatingContent: Record<FeatureType, FeatureGatingContent> = {
  watchlist_limit: {
    title: "Watchlist Full",
    description: "Starter accounts can watch up to 10 domains. Upgrade to Pro for unlimited tracking and drop alerts.",
    buttonText: "Upgrade to Pro",
  },
  saved_searches: {
    title: "Automate Your Deal Flow",
    description: "Saved Searches notify you instantly when high-score domains drop in your niche.",
    buttonText: "Start Pro Trial",
    proFeatures: [
      "Unlimited searches",
      "Match alerts",
      "Trend + investor interest signals",
    ],
  },
  alerts: {
    title: "Drop Alerts Are Pro",
    description: "Get notified before watched domains drop or auctions end.",
    buttonText: "Unlock Alerts with Pro",
  },
  ai_builder: {
    title: "AI Domain Builder (Pro)",
    description: "Generate investable domain ideas instantly, checked for availability and renewal safety.",
    buttonText: "Start Pro Trial",
  },
  trend_signals: {
    title: "Trend Signals Are Pro",
    description: "See when keywords are rising in search demand before the market catches up.",
    buttonText: "Upgrade to Pro",
  },
  investor_interest: {
    title: "Investor Interest (Pro)",
    description: "Pro users can see how many investors are watching a domain to gauge competition.",
    buttonText: "Unlock with Pro",
  },
  portfolio: {
    title: "Portfolio Tracker (Pro)",
    description: "Track renewals, holding costs, and domains expiring soon — all in one place.",
    buttonText: "Upgrade to Pro",
  },
  generic: {
    title: "Pro Feature",
    description: "This feature is available to Pro subscribers.",
    buttonText: "Upgrade to Pro",
  },
};

interface ProFeatureLockProps {
  featureType?: FeatureType;
  feature?: string;
  description?: string;
  children: React.ReactNode;
}

export function ProFeatureLock({ featureType = "generic", feature, description, children }: ProFeatureLockProps) {
  const { isPro, isLoggedIn } = useUser();

  if (isPro) {
    return <>{children}</>;
  }

  const content = gatingContent[featureType];
  const displayTitle = feature || content.title;
  const displayDescription = description || content.description;

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-40 blur-[2px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6 max-w-sm">
          <div className="mx-auto mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full w-fit">
            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">{displayTitle}</h3>
          <p className="text-sm text-muted-foreground mb-4">{displayDescription}</p>
          
          {content.proFeatures && (
            <ul className="text-left text-sm text-muted-foreground mb-4 space-y-1">
              {content.proFeatures.map((feat, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-primary" />
                  {feat}
                </li>
              ))}
            </ul>
          )}
          
          {isLoggedIn ? (
            <Link href="/pricing">
              <Button className="gap-2" data-testid="button-unlock-feature">
                <Crown className="w-4 h-4" />
                {content.buttonText}
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="gap-2"
              data-testid="button-unlock-feature"
            >
              <Crown className="w-4 h-4" />
              Sign Up to Unlock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProBadgeLockProps {
  onClick?: () => void;
}

export function ProBadgeLock({ onClick }: ProBadgeLockProps) {
  const handleClick = () => {
    if (onClick) onClick();
    window.location.href = "/pricing";
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full hover-elevate cursor-pointer"
      data-testid="badge-pro-locked"
    >
      <Lock className="w-3 h-3" />
      Pro
    </span>
  );
}

export function WatchlistLimitReached({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div className="text-center p-6 border rounded-lg bg-muted/50">
      <div className="mx-auto mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full w-fit">
        <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">Watchlist Full</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Starter accounts can watch up to 10 domains.<br />
        Upgrade to Pro for unlimited tracking and drop alerts.
      </p>
      <Link href="/pricing">
        <Button className="gap-2" onClick={onUpgrade} data-testid="button-watchlist-upgrade">
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </Button>
      </Link>
    </div>
  );
}
