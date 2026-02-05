import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Terminal, Crown, Home, Bookmark, Sparkles, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Feed", icon: Home },
    { href: "/watchlist", label: "Watchlist", icon: Bookmark },
    { href: "/builder", label: "AI Builder", icon: Sparkles },
    { href: "/portfolio", label: "Portfolio", icon: Briefcase }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/">
          <div 
            data-testid="logo"
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="p-1.5 bg-primary rounded-md">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:block">
              TLDTerminal
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="input-search"
              type="search"
              placeholder="Search domains..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-muted/50 border-transparent focus:border-input focus:bg-background"
            />
          </div>
        </div>

        <Button
          data-testid="button-upgrade"
          variant="default"
          size="sm"
          className="gap-1.5 hidden sm:flex"
        >
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </Button>

        <nav className="flex md:hidden items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  data-testid={`nav-mobile-${link.label.toLowerCase().replace(' ', '-')}`}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
