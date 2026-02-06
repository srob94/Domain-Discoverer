import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { Crown, CreditCard, Calendar, ArrowRight, Check, Shield } from "lucide-react";
import { Link } from "wouter";

interface BillingData {
  plan: string;
  trialActive: boolean;
  trialEndsAt: string | null;
  nextBillingDate: string | null;
  monthlyPrice: number;
  currency: string;
}

const PRO_FEATURES = [
  "Unlimited watchlist items",
  "Saved searches with alerts",
  "AI Domain Builder",
  "Conversation Search (200/mo)",
  "Portfolio tracker",
  "Trend signals & investor interest",
  "Priority email alerts",
];

export default function Billing() {
  const { isPro, triggerUpgrade } = useUser();

  const { data: billing, isLoading } = useQuery<BillingData>({
    queryKey: ["/api/billing"],
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <Card className="p-6">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2" data-testid="text-billing-title">
          <CreditCard className="w-6 h-6 text-primary" />
          Billing
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and billing details.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground">Current Plan</h3>
              {isPro ? (
                <Badge
                  variant="secondary"
                  className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  data-testid="billing-badge-plan"
                >
                  <Crown className="w-3 h-3" />
                  Pro
                </Badge>
              ) : (
                <Badge variant="outline" data-testid="billing-badge-plan">
                  Starter (Free)
                </Badge>
              )}
            </div>
            {billing?.trialActive && (
              <p className="text-sm text-muted-foreground" data-testid="text-trial-info">
                Trial ends {formatDate(billing.trialEndsAt)}
              </p>
            )}
          </div>
          {isPro && (
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground" data-testid="text-price">
                ${billing?.monthlyPrice}<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
          )}
        </div>

        {isPro && (
          <>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Next billing date</p>
                <p className="text-sm font-medium text-foreground mt-1" data-testid="text-next-billing">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  {formatDate(billing?.nextBillingDate || null)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Payment method</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  <CreditCard className="w-3.5 h-3.5 inline mr-1" />
                  Visa ending 4242
                </p>
              </div>
            </div>
          </>
        )}
      </Card>

      {isPro ? (
        <Card className="p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Manage Subscription</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              data-testid="button-manage-payment"
            >
              <CreditCard className="w-4 h-4" />
              Manage payment method
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-destructive"
              data-testid="button-cancel-subscription"
            >
              Cancel subscription
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Your subscription renews automatically. You can cancel anytime and keep access until the end of your billing period.
          </p>
        </Card>
      ) : (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Upgrade to Pro</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Get the full TLDTerminal experience with unlimited features and priority alerts.
          </p>
          <div className="space-y-2 mb-5">
            {PRO_FEATURES.map(feature => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/pricing">
              <Button className="gap-2" data-testid="button-upgrade-pro">
                <Crown className="w-4 h-4" />
                Start 7-Day Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              Then $79/mo. Cancel anytime.
            </span>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          Billing Support
        </h3>
        <p className="text-sm text-muted-foreground">
          Need help with billing or have questions about your subscription? Contact us at{" "}
          <span className="text-foreground font-medium">support@tldterminal.com</span>
        </p>
      </Card>
    </div>
  );
}
