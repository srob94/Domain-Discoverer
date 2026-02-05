import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  TrendingUp, 
  Bell, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap,
  Search,
  Eye,
  Clock,
  Crown,
  Infinity,
  BarChart3,
  Briefcase
} from "lucide-react";

const valueProps = [
  {
    icon: TrendingUp,
    title: "Daily Ranked Drops",
    description: "Top domains dropping soon, filtered and scored so you don't waste hours digging.",
  },
  {
    icon: Shield,
    title: "Renewal Trap Protection",
    description: "Instantly see premium renewal risk before you buy a name that costs $500/year.",
  },
  {
    icon: Bell,
    title: "Automated Deal Flow",
    description: "Saved searches + alerts notify you when new high-score domains appear.",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Browse Today's Best Drops",
    description: "We surface the top opportunities from the drop cycle every day.",
    icon: Search,
  },
  {
    step: 2,
    title: "Watch What Matters",
    description: "Save domains and track timing automatically.",
    icon: Eye,
  },
  {
    step: 3,
    title: "Act Before the Market Does",
    description: "Get notified when domains drop or match your criteria.",
    icon: Clock,
  },
];

const proFeatures = [
  { icon: Infinity, text: "Unlimited watchlists" },
  { icon: Search, text: "Saved searches + alerts" },
  { icon: Sparkles, text: "AI Domain Builder" },
  { icon: BarChart3, text: "Trend + investor interest signals" },
  { icon: Briefcase, text: "Portfolio renewal tracking" },
];

const sampleDomains = [
  { name: "cryptoflow.com", score: 92, status: "Drops in 12h", trending: true },
  { name: "aiventure.com", score: 88, status: "Drops in 6h", premium: true },
  { name: "webflow.dev", score: 83, status: "Drops in 5h", trending: true },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full z-[1000] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-md">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">TLDTerminal</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild data-testid="button-login">
              <a href="/api/login">Log in</a>
            </Button>
            <Button asChild data-testid="button-signup">
              <a href="/api/login" className="gap-2">
                Start Free Account
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="gap-1.5">
                  <Zap className="w-3 h-3" />
                  For Domain Investors
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  The Daily Terminal for 
                  <span className="text-primary"> Domain Investors</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Find the best dropping domains before anyone else — ranked by resale potential, 
                  protected from premium renewal traps, and delivered with alerts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="gap-2" data-testid="button-cta-primary">
                    <a href="/api/login">
                      View Today's Drop Feed
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="gap-2" data-testid="button-cta-secondary">
                    <a href="/api/login">
                      Start Free Account
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  No noise. No junk lists. Just investable domains, scored and ready.
                </p>
              </div>

              <div className="relative">
                <Card className="p-6 bg-card/50 backdrop-blur">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Today's Top Drops</h3>
                    <Badge variant="outline">Live Preview</Badge>
                  </div>
                  <div className="space-y-3">
                    {sampleDomains.map((domain) => (
                      <div 
                        key={domain.name}
                        className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                            domain.score >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            domain.score >= 80 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {domain.score}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{domain.name}</p>
                            <p className="text-xs text-muted-foreground">{domain.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {domain.trending && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Trending
                            </Badge>
                          )}
                          {domain.premium && (
                            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">
                      Sign up to see all 25+ domains dropping today
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-4 px-4 bg-muted/30 border-y border-border">
          <div className="container mx-auto max-w-4xl">
            <p className="text-center text-sm text-muted-foreground">
              Trusted by early domain investors tracking drops, trends, and renewal risk daily.
            </p>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Everything you need to find deals
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built for domain investors who want to stop scrolling endless lists
                and start finding investable opportunities.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {valueProps.map((prop, i) => (
                <Card key={i} className="p-6 hover-elevate">
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                    <prop.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground">{prop.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How It Works
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {howItWorks.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-sm font-medium text-primary mb-2">Step {step.step}</div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-accent/10 border-primary/20">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4 gap-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Crown className="w-3.5 h-3.5" />
                  Pro
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Unlock Pro Automation
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Serious investors don't search manually — they automate deal flow.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {proFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                    <div className="p-1.5 bg-primary/10 rounded">
                      <feature.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button size="lg" asChild className="gap-2" data-testid="button-pro-trial">
                  <a href="/api/login">
                    <Crown className="w-4 h-4" />
                    Start Pro Trial
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Start finding better domains today.
            </h2>
            <p className="text-muted-foreground mb-8">
              Create a free account and see today's ranked drop feed.
            </p>
            <Button size="lg" asChild className="gap-2" data-testid="button-get-started">
              <a href="/api/login">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary rounded">
              <Terminal className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              TLDTerminal
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your daily terminal for domain deals.
          </p>
        </div>
      </footer>
    </div>
  );
}
