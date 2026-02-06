import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/NotificationBell";
import { ConversationSearch } from "@/components/ConversationSearch";
import { Search, Terminal, Crown, Home, Bookmark, Sparkles, Briefcase, LogOut, Lock, Settings, User, CreditCard } from "lucide-react";
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
  const { isPro, triggerUpgrade } = useUser();

  const navLinks = [
    { href: "/", label: "Feed", icon: Home, proOnly: false },
    { href: "/watchlist", label: "Watchlist", icon: Bookmark, proOnly: false },
    { href: "/builder", label: "AI Builder", icon: Sparkles, proOnly: true },
    { href: "/portfolio", label: "Portfolio", icon: Briefcase, proOnly: true }
  ];

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
    <header className="sticky top-0 z-[1000] w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
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
                  {link.proOnly && !isPro && (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  )}
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

        <div className="flex items-center gap-2">
          <ConversationSearch />
          <NotificationBell />

          {isPro ? (
            <Badge
              variant="secondary"
              className="hidden sm:flex gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              data-testid="badge-plan-pro"
            >
              <Crown className="w-3 h-3" />
              Pro
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="hidden sm:flex"
              data-testid="badge-plan-starter"
            >
              Starter
            </Badge>
          )}

          {!isPro && (
            <Link href="/pricing">
              <Button
                data-testid="button-upgrade"
                variant="default"
                size="sm"
                className="gap-1.5 hidden sm:flex"
              >
                <Crown className="w-4 h-4" />
                Upgrade
              </Button>
            </Link>
          )}
        </div>

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
                <div className="mt-1">
                  {isPro ? (
                    <Badge variant="secondary" className="text-xs gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      <Crown className="w-2.5 h-2.5" />
                      Pro
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Starter</Badge>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
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
