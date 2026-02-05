import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Terminal, ArrowRight } from "lucide-react";

export function MarketingHeader() {
  const [location] = useLocation();

  return (
    <header className="fixed top-0 w-full z-[1000] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="logo-marketing">
              <div className="p-1.5 bg-primary rounded-md">
                <Terminal className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">TLDTerminal</span>
            </div>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link href="/#features">
              <Button
                variant="ghost"
                size="sm"
                data-testid="nav-product"
              >
                Product
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="ghost"
                size="sm"
                data-testid="nav-pricing"
                className={location === "/pricing" ? "bg-accent text-accent-foreground" : ""}
              >
                Pricing
              </Button>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild data-testid="button-login">
            <a href="/api/login">Log in</a>
          </Button>
          <Button asChild data-testid="button-get-started-nav">
            <a href="/api/login" className="gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
