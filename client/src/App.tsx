import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { UpgradeModal } from "@/components/UpgradeModal";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/use-auth";
import DailyDropFeed from "@/pages/daily-drop-feed";
import Watchlist from "@/pages/watchlist";
import Builder from "@/pages/builder";
import Portfolio from "@/pages/portfolio";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";

function Router({ searchQuery }: { searchQuery: string }) {
  return (
    <Switch>
      <Route path="/">
        <DailyDropFeed searchQuery={searchQuery} />
      </Route>
      <Route path="/watchlist" component={Watchlist} />
      <Route path="/builder" component={Builder} />
      <Route path="/portfolio" component={Portfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp({ searchQuery, setSearchQuery }: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void;
}) {
  const { showUpgradeModal, setShowUpgradeModal, upgradeReason, user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        user={user}
      />
      <main className="container mx-auto px-4 py-6">
        <Router searchQuery={searchQuery} />
      </main>
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        triggerReason={upgradeReason}
      />
    </div>
  );
}

function AppContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <UserProvider authUser={null}>
        <Landing />
      </UserProvider>
    );
  }

  return (
    <UserProvider authUser={user}>
      <AuthenticatedApp searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </UserProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
