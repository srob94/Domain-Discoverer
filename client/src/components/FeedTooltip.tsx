import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";

const FEED_TIP_KEY = "tld_feed_tip_seen";

export function FeedTooltip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(FEED_TIP_KEY);
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(FEED_TIP_KEY, "true");
  };

  if (!visible) return null;

  return (
    <div
      className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-md flex items-center gap-3 animate-fade-in-up"
      data-testid="feed-tooltip"
    >
      <div className="p-2 bg-primary/10 rounded-full shrink-0">
        <Eye className="w-4 h-4 text-primary" />
      </div>
      <p className="text-sm text-foreground flex-1">
        Click <span className="font-medium">Watch</span> to track domains and get alerts before they drop.
      </p>
      <Button
        variant="ghost"
        size="icon"
        onClick={dismiss}
        data-testid="button-dismiss-feed-tip"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
