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
  Zap
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Daily Drop Feed",
    description: "Top domains dropping today, ranked by investability score",
  },
  {
    icon: Shield,
    title: "Premium Renewal Detection",
    description: "Avoid hidden costs with renewal price warnings",
  },
  {
    icon: Bell,
    title: "Drop Alerts",
    description: "Get notified when your tracked domains become available",
  },
  {
    icon: Sparkles,
    title: "AI Domain Builder",
    description: "Generate brandable domain ideas instantly with AI",
  },
];

const sampleDomains = [
  { name: "cryptoflow.com", score: 92, status: "Drops in 12h", trending: true },
  { name: "aiventure.com", score: 88, status: "Drops in 6h", premium: true },
  { name: "webflow.dev", score: 83, status: "Drops in 5h", trending: true },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
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
                Get Started Free
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
                  Never miss a 
                  <span className="text-primary"> high-value </span>
                  domain drop
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  TLDTerminal shows you the best expiring domains daily, ranked by 
                  investability with premium renewal warnings. Stop missing deals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="gap-2" data-testid="button-cta-primary">
                    <a href="/api/login">
                      Start Free
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    View Demo Feed
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Free forever plan
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    No credit card required
                  </div>
                </div>
              </div>

              <div className="relative">
                <Card className="p-6 bg-card/50 backdrop-blur">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Today's Top Drops</h3>
                    <Badge variant="outline">Live Preview</Badge>
                  </div>
                  <div className="space-y-3">
                    {sampleDomains.map((domain, i) => (
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

        <section className="py-20 px-4 bg-muted/30">
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="p-6 hover-elevate">
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Start finding domains today
            </h2>
            <p className="text-muted-foreground mb-8">
              Join investors who use TLDTerminal to discover high-value domains before anyone else.
            </p>
            <Button size="lg" asChild className="gap-2">
              <a href="/api/login">
                Create Free Account
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
            Built for domain investors
          </p>
        </div>
      </footer>
    </div>
  );
}
