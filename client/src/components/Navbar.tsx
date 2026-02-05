import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Terminal, Crown, Home, Bookmark, Sparkles, Briefcase, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import type { User as AuthUser } from "@shared/schema";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  user?: AuthUser | null;
}

export function Navbar({ searchQuery, onSearchChange, user }: NavbarProps) {
  const [location] = useLocation();
  const { triggerUpgrade } = useUser();

  const navLinks = [
    { href: "/", label: "Feed", icon: Home },
    { href: "/watchlist", label: "Watchlist", icon: Bookmark },
    { href: "/builder", label: "AI Builder", icon: Sparkles },
    { href: "/portfolio", label: "Portfolio", icon: Briefcase }
  ];

  const handleUpgradeClick = () => {
    triggerUpgrade("Upgrade to Pro to unlock all features");
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

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
          onClick={handleUpgradeClick}
        >
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                </p>
                {user.email && user.firstName && (
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/api/logout" className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  Log out
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
