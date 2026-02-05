import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Target, Shield, Zap, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingHeader />
      <main className="flex-1 pt-16">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="p-2 bg-primary rounded-md">
                  <Terminal className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-about-title">
                Built for Domain Investors
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                TLDTerminal is a focused research tool that helps domain investors find, evaluate,
                and track dropping domains — without the noise.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-16">
              <Card className="p-6 text-center">
                <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto mb-3">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Focused</h3>
                <p className="text-sm text-muted-foreground">
                  No endless scrolling. Every domain is scored and ranked for investability.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Protected</h3>
                <p className="text-sm text-muted-foreground">
                  Renewal trap warnings flag premium pricing before you commit.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto mb-3">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Automated alerts and AI-powered search put deals in front of you instantly.
                </p>
              </Card>
            </div>

            <div className="space-y-6 mb-16">
              <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Domain investing shouldn't require hours of manual research across fragmented tools.
                TLDTerminal consolidates the drop cycle into a single scored feed, adds intelligent
                alerts and watchlists, and layers in AI-powered search to surface opportunities
                that others miss.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a beginner watching your first batch of drops or a seasoned investor
                managing a portfolio, TLDTerminal is designed to save you time and help you make
                better decisions.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to start?</h2>
              <p className="text-muted-foreground mb-6">
                Create a free account and see today's ranked drop feed.
              </p>
              <Button size="lg" asChild className="gap-2" data-testid="button-about-cta">
                <a href="/api/login">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
