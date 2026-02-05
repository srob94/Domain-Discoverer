import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Zap, Bell, Sparkles, TrendingUp, Users, Briefcase } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerReason?: string;
}

const proFeatures = [
  { icon: Zap, text: "Unlimited watchlist tracking" },
  { icon: Bell, text: "Drop alerts + saved searches" },
  { icon: Sparkles, text: "AI domain builder" },
  { icon: TrendingUp, text: "Trend + investor interest signals" },
  { icon: Briefcase, text: "Portfolio renewal tracker" },
  { icon: Users, text: "See who's watching domains" },
];

export function UpgradeModal({ open, onOpenChange, triggerReason }: UpgradeModalProps) {
  const handleUpgrade = () => {
    window.open("https://buy.stripe.com/placeholder", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-3 p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full w-fit">
            <Crown className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Don't miss drops. Automate your deal flow.
          </DialogTitle>
          {triggerReason && (
            <DialogDescription className="text-center text-base mt-2">
              {triggerReason}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground">Pro Plan</h3>
                <p className="text-muted-foreground text-sm">Everything you need to find deals</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">$79</div>
                <div className="text-sm text-muted-foreground">/month</div>
              </div>
            </div>

            <div className="space-y-3">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-primary/10 rounded">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleUpgrade}
            className="w-full h-12 text-base gap-2"
            data-testid="button-upgrade-checkout"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Pro — $79/mo
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Cancel anytime. 7-day money-back guarantee.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
