import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Zap, HelpCircle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const starterFeatures = [
  "Daily Drop Feed (Top 25/day)",
  "Domain scoring + renewal warnings",
  "Watchlist (up to 10 domains)",
  "Basic filters (.com, score threshold)",
];

const proFeatures = [
  "Everything in Starter, plus:",
  "Unlimited watchlist tracking",
  "Saved searches + automated alerts",
  "AI Domain Builder",
  "Google Trends keyword signals",
  "Investor interest counts",
  "Portfolio renewal exposure tracker",
];

const comparisonData = [
  { feature: "Daily feed", starter: "Top 25", pro: "Top 100" },
  { feature: "Watchlist", starter: "10 max", pro: "Unlimited" },
  { feature: "Saved searches", starter: "locked", pro: "Unlimited" },
  { feature: "Alerts", starter: "locked", pro: "Included" },
  { feature: "AI Builder", starter: "locked", pro: "Included" },
  { feature: "Trend signals", starter: "locked", pro: "Included" },
  { feature: "Investor interest counts", starter: "locked", pro: "Included" },
  { feature: "Portfolio tracker", starter: "locked", pro: "Included" },
];

const faqs = [
  {
    question: "Do I need Pro to browse domains?",
    answer: "No — Starter lets you explore the daily feed for free.",
  },
  {
    question: "What do Pro investors use most?",
    answer: "Saved searches + alerts. That's how investors catch drops before others.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Pro is month-to-month.",
  },
];

export default function Pricing() {
  const { isPro } = useUser();

  const handleStartFree = () => {
    window.location.href = "/api/login";
  };

  const handleStartTrial = () => {
    window.open("https://buy.stripe.com/placeholder-trial", "_blank");
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Upgrade to Pro</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Automate your domain investing with alerts, trend signals, and unlimited tracking.
        </p>
        <p className="text-muted-foreground">
          Starter is great for browsing. Pro is built for investors who want deal flow on autopilot.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="relative" data-testid="card-plan-starter">
          <CardHeader>
            <CardTitle className="flex items-center justify-between" data-testid="text-plan-starter-title">
              <span>Starter</span>
              <Badge variant="secondary">Free</Badge>
            </CardTitle>
            <CardDescription>Best for exploring drops</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div data-testid="text-plan-starter-price">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3" data-testid="list-starter-features">
              {starterFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3" data-testid={`text-starter-feature-${index}`}>
                  <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleStartFree}
              data-testid="button-start-free"
            >
              Start Free
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              No credit card required.
            </p>
          </CardFooter>
        </Card>

        <Card className="relative border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5" data-testid="card-plan-pro">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground gap-1" data-testid="badge-most-popular">
              <Crown className="w-3 h-3" />
              Most Popular
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center justify-between" data-testid="text-plan-pro-title">
              <span>Pro</span>
              <Badge variant="secondary">Investor</Badge>
            </CardTitle>
            <CardDescription>Best for serious domain buyers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div data-testid="text-plan-pro-price">
              <span className="text-4xl font-bold">$79</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3" data-testid="list-pro-features">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3" data-testid={`text-pro-feature-${index}`}>
                  <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {isPro ? (
              <Button 
                variant="outline" 
                className="w-full"
                disabled
                data-testid="button-current-plan"
              >
                Current Plan
              </Button>
            ) : (
              <Button 
                className="w-full gap-2"
                onClick={handleStartTrial}
                data-testid="button-start-trial"
              >
                <Crown className="w-4 h-4" />
                Start 7-Day Pro Trial
              </Button>
            )}
            <p className="text-xs text-muted-foreground text-center">
              Cancel anytime. Alerts stay active while subscribed.
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Compare Plans</h2>
        <div className="rounded-lg border overflow-hidden" data-testid="table-comparison">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 font-medium">Feature</th>
                <th className="text-center p-4 font-medium">Starter</th>
                <th className="text-center p-4 font-medium">Pro</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className="border-t" data-testid={`row-comparison-${index}`}>
                  <td className="p-4 text-sm" data-testid={`text-feature-${index}`}>{row.feature}</td>
                  <td className="p-4 text-center" data-testid={`text-starter-value-${index}`}>
                    {row.starter === "locked" ? (
                      <X className="w-4 h-4 text-muted-foreground mx-auto" />
                    ) : (
                      <span className="text-sm text-muted-foreground">{row.starter}</span>
                    )}
                  </td>
                  <td className="p-4 text-center" data-testid={`text-pro-value-${index}`}>
                    {row.pro === "Included" ? (
                      <Check className="w-4 h-4 text-primary mx-auto" />
                    ) : row.pro === "Unlimited" ? (
                      <span className="text-sm font-medium text-primary">{row.pro}</span>
                    ) : (
                      <span className="text-sm">{row.pro}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full" data-testid="accordion-faq">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} data-testid={`faq-item-${index}`}>
              <AccordionTrigger className="text-left" data-testid={`button-faq-${index}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent data-testid={`text-faq-answer-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center space-y-4 py-8 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 rounded-lg">
        <h2 className="text-2xl font-bold">Don't miss drops while you sleep.</h2>
        <p className="text-muted-foreground">
          Upgrade to Pro and automate your deal flow.
        </p>
        {!isPro && (
          <Button 
            size="lg"
            className="gap-2"
            onClick={handleStartTrial}
            data-testid="button-cta-start-trial"
          >
            <Zap className="w-5 h-5" />
            Start Pro Trial
          </Button>
        )}
      </div>
    </div>
  );
}
